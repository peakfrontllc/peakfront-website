import { mkdir, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, list, put } from "@vercel/blob";
import { imageBasename } from "@/lib/project-form";
import {
  parseProjectsDocument,
  type ProjectImage,
  type StoredProject,
} from "@/lib/projects";

export const PROJECTS_JSON_PATH = path.join(
  process.cwd(),
  "public",
  "projects",
  "projects.json",
);

export const PROJECTS_IMAGES_DIR = path.join(
  process.cwd(),
  "public",
  "projects",
  "images",
);

const BLOB_JSON_PATHNAME = "projects/projects.json";

export const LIVE_BLOB_SETUP_MESSAGE =
  "The live server cannot save files to disk. In Vercel, open Storage → Create → Blob, connect this project, then redeploy.";

export function usesBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function needsLiveBlobSetup() {
  return Boolean(process.env.VERCEL) && !usesBlobStore();
}

function isReadOnlyFsError(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = (error as { code?: string }).code;
  return (
    code === "EROFS" || (Boolean(process.env.VERCEL) && code === "EPERM")
  );
}

function throwIfReadOnly(error: unknown): never {
  if (isReadOnlyFsError(error)) {
    throw new Error(LIVE_BLOB_SETUP_MESSAGE);
  }
  throw error;
}

function isRemoteSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

function contentTypeForExtension(ext: string) {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}

async function readDiskProjects(): Promise<StoredProject[]> {
  const raw = await readFile(PROJECTS_JSON_PATH, "utf8");
  return parseProjectsDocument(JSON.parse(raw));
}

async function readBlobProjects(): Promise<StoredProject[] | null> {
  const { blobs } = await list({ prefix: BLOB_JSON_PATHNAME, limit: 20 });
  const match = blobs.find((blob) => blob.pathname === BLOB_JSON_PATHNAME);
  if (!match) return null;

  const headers: HeadersInit = {};
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(match.url, { cache: "no-store", headers });
  if (!response.ok) return null;
  return parseProjectsDocument(await response.json());
}

export async function readStoredProjects() {
  if (usesBlobStore()) {
    try {
      const fromBlob = await readBlobProjects();
      if (fromBlob) return fromBlob;
    } catch {
      // Fall back to the deployed JSON if Blob is unavailable.
    }
  }

  return readDiskProjects();
}

export async function writeStoredProjects(projects: StoredProject[]) {
  const body = `${JSON.stringify({ projects }, null, 2)}\n`;

  if (usesBlobStore()) {
    await put(BLOB_JSON_PATHNAME, body, {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60,
    });
    return;
  }

  try {
    await writeFile(PROJECTS_JSON_PATH, body, "utf8");
  } catch (error) {
    throwIfReadOnly(error);
  }
}

export async function saveImageFiles(
  projectId: string,
  files: { buffer: Buffer; filename: string; src: string }[],
): Promise<ProjectImage[]> {
  if (files.length === 0) return [];

  if (usesBlobStore()) {
    return Promise.all(
      files.map(async (file) => {
        const blob = await put(file.filename.replace(/\\/g, "/"), file.buffer, {
          access: "public",
          addRandomSuffix: true,
          contentType: contentTypeForExtension(path.extname(file.filename)),
        });
        return { src: blob.url, alt: "" };
      }),
    );
  }

  const imageDir = path.join(PROJECTS_IMAGES_DIR, projectId);
  await mkdir(imageDir, { recursive: true }).catch((error) => {
    throwIfReadOnly(error);
  });

  const saved: ProjectImage[] = [];
  for (const file of files) {
    const dest = path.join(imageDir, path.basename(file.filename));
    try {
      await writeFile(dest, file.buffer);
    } catch (error) {
      throwIfReadOnly(error);
    }
    saved.push({ src: file.src, alt: "" });
  }
  return saved;
}

export async function removeImageFiles(
  projectId: string,
  images: ProjectImage[],
) {
  const remote = images
    .map((image) => image.src)
    .filter((src) => isRemoteSrc(src));
  if (remote.length > 0) {
    await del(remote).catch(() => undefined);
  }

  const imageDir = path.join(PROJECTS_IMAGES_DIR, projectId);
  await Promise.all(
    images
      .filter((image) => !isRemoteSrc(image.src))
      .map((image) =>
        unlink(path.join(imageDir, imageBasename(image.src))).catch(
          () => undefined,
        ),
      ),
  );
}

export async function deleteProjectFiles(
  projectId: string,
  images: ProjectImage[],
) {
  await removeImageFiles(projectId, images);

  if (usesBlobStore()) {
    const { blobs } = await list({
      prefix: `projects/images/${projectId}/`,
      limit: 100,
    });
    if (blobs.length > 0) {
      await del(blobs.map((blob) => blob.url)).catch(() => undefined);
    }
  }

  await rm(path.join(PROJECTS_IMAGES_DIR, projectId), {
    recursive: true,
    force: true,
  }).catch(() => undefined);
}

export async function nextDiskImageNumber(projectId: string) {
  const dir = path.join(PROJECTS_IMAGES_DIR, projectId);
  try {
    const files = await readdir(dir);
    const numbers = files
      .map((file) => Number.parseInt(path.parse(file).name, 10))
      .filter((value) => Number.isInteger(value) && value > 0);
    return (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
  } catch {
    return 1;
  }
}
