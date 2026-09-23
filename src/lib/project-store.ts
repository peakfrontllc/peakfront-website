import "server-only";

import { mkdir, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  commitGitHubFiles,
  readGitHubTextFile,
  usesGitHubStore,
  type GitHubFileChange,
} from "@/lib/github-projects";
import { imageBasename } from "@/lib/project-form";
import {
  parseProjectsDocument,
  sortProjectsNewestFirst,
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

const PROJECTS_JSON_REPO_PATH = "public/projects/projects.json";

let inProcessCatalog: StoredProject[] | null = null;
let catalogWrittenAt = 0;
let inFlightRead: Promise<StoredProject[]> | null = null;
const CATALOG_TRUST_MS = 60_000;

export const LIVE_STORE_SETUP_MESSAGE =
  "The live server cannot save files to disk. Add PROJECTS_GITHUB_TOKEN in Vercel (Contents read/write on this repo), then redeploy.";

export { usesGitHubStore };

export function needsLiveStoreSetup() {
  return Boolean(process.env.VERCEL) && !usesGitHubStore();
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
    throw new Error(LIVE_STORE_SETUP_MESSAGE);
  }
  throw error;
}

function rememberCatalog(projects: StoredProject[]) {
  inProcessCatalog = projects;
  catalogWrittenAt = Date.now();
}

async function readDiskProjects(): Promise<StoredProject[]> {
  const raw = await readFile(PROJECTS_JSON_PATH, "utf8");
  return parseProjectsDocument(JSON.parse(raw));
}

async function loadStoredProjects() {
  if (
    inProcessCatalog &&
    Date.now() - catalogWrittenAt < CATALOG_TRUST_MS
  ) {
    return inProcessCatalog;
  }

  if (usesGitHubStore()) {
    try {
      const raw = await readGitHubTextFile(PROJECTS_JSON_REPO_PATH);
      if (raw) {
        const fromGitHub = parseProjectsDocument(JSON.parse(raw));
        rememberCatalog(fromGitHub);
        return fromGitHub;
      }
    } catch {
      if (inProcessCatalog) return inProcessCatalog;
    }
  }

  const fromDisk = await readDiskProjects();
  rememberCatalog(fromDisk);
  return fromDisk;
}

export async function readStoredProjects() {
  if (
    inProcessCatalog &&
    Date.now() - catalogWrittenAt < CATALOG_TRUST_MS
  ) {
    return inProcessCatalog;
  }

  if (!inFlightRead) {
    inFlightRead = loadStoredProjects().finally(() => {
      inFlightRead = null;
    });
  }

  return inFlightRead;
}

export type ProjectWriteExtras = {
  files?: GitHubFileChange[];
  deletes?: string[];
  message?: string;
};

export async function writeStoredProjects(
  projects: StoredProject[],
  extras: ProjectWriteExtras = {},
) {
  const ordered = sortProjectsNewestFirst(projects);
  const body = `${JSON.stringify({ projects: ordered }, null, 2)}\n`;
  rememberCatalog(ordered);

  if (usesGitHubStore()) {
    await commitGitHubFiles(
      extras.message ?? "Update projects",
      [
        ...(extras.files ?? []),
        {
          path: PROJECTS_JSON_REPO_PATH,
          content: Buffer.from(body, "utf8"),
        },
      ],
      extras.deletes ?? [],
    );
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
): Promise<{
  images: ProjectImage[];
  commitFiles: GitHubFileChange[];
}> {
  if (files.length === 0) return { images: [], commitFiles: [] };

  if (usesGitHubStore()) {
    return {
      images: files.map((file) => ({ src: file.src, alt: "" })),
      commitFiles: files.map((file) => ({
        path: `public/projects/images/${projectId}/${path.basename(file.filename)}`,
        content: file.buffer,
      })),
    };
  }

  const imageDir = path.join(PROJECTS_IMAGES_DIR, projectId);
  await mkdir(imageDir, { recursive: true }).catch((error) => {
    throwIfReadOnly(error);
  });

  const images: ProjectImage[] = [];
  for (const file of files) {
    const dest = path.join(imageDir, path.basename(file.filename));
    try {
      await writeFile(dest, file.buffer);
    } catch (error) {
      throwIfReadOnly(error);
    }
    images.push({ src: file.src, alt: "" });
  }
  return { images, commitFiles: [] };
}

export function repoPathFromImageSrc(src: string) {
  const match = src.match(/^\/projects\/images\/(.+)$/);
  return match ? `public/projects/images/${match[1]}` : null;
}

export async function removeImageFiles(
  projectId: string,
  images: ProjectImage[],
): Promise<{ commitDeletes: string[] }> {
  const commitDeletes = images
    .map((image) => repoPathFromImageSrc(image.src))
    .filter((value): value is string => Boolean(value));

  if (usesGitHubStore()) {
    return { commitDeletes };
  }

  const imageDir = path.join(PROJECTS_IMAGES_DIR, projectId);
  await Promise.all(
    images.map((image) =>
      unlink(path.join(imageDir, imageBasename(image.src))).catch(
        () => undefined,
      ),
    ),
  );
  return { commitDeletes: [] };
}

export async function deleteProjectFiles(
  projectId: string,
  images: ProjectImage[],
): Promise<{ commitDeletes: string[] }> {
  const removed = await removeImageFiles(projectId, images);

  if (!usesGitHubStore()) {
    await rm(path.join(PROJECTS_IMAGES_DIR, projectId), {
      recursive: true,
      force: true,
    }).catch(() => undefined);
  }

  return removed;
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
