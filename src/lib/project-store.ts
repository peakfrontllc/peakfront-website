import "server-only";

import { mkdir, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  commitGitHubFiles,
  readGitHubTextFile,
  usesGitHubStore,
  type GitHubFileChange,
} from "@/lib/github-projects";
import {
  readSupabaseProjects,
  removeSupabaseImages,
  saveSupabaseImages,
  seedSupabaseProjects,
  usesSupabaseStore,
  writeSupabaseProjects,
} from "@/lib/supabase-projects";
import { imageBasename } from "@/lib/project-form";
import {
  assertProjectRepoPath,
  repoPathFromImageSrc,
  toStoredImageSrc,
} from "@/lib/project-paths";
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
  "The live server cannot save files to disk. Add SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel, then redeploy.";

export { usesGitHubStore, usesSupabaseStore };

export function needsLiveStoreSetup() {
  return (
    Boolean(process.env.VERCEL) && !usesSupabaseStore() && !usesGitHubStore()
  );
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

function withStoredImagePaths(projects: StoredProject[]) {
  return projects.map((project) => ({
    ...project,
    images: Array.isArray(project.images)
      ? project.images.map((image) => {
          if (typeof image === "string") return toStoredImageSrc(image);
          if (image && typeof image === "object" && "src" in image) {
            const src = (image as { src?: unknown }).src;
            if (typeof src === "string") {
              return { ...image, src: toStoredImageSrc(src) };
            }
          }
          return image;
        })
      : project.images,
  }));
}

async function loadStoredProjects() {
  if (
    !usesSupabaseStore() &&
    inProcessCatalog &&
    Date.now() - catalogWrittenAt < CATALOG_TRUST_MS
  ) {
    return inProcessCatalog;
  }

  if (usesSupabaseStore()) {
    const fromSupabase = await readSupabaseProjects();
    if (fromSupabase && fromSupabase.length > 0) {
      const catalog = withStoredImagePaths(fromSupabase);
      rememberCatalog(catalog);
      return catalog;
    }

    const seeded = withStoredImagePaths(
      await seedSupabaseProjects(await readDiskProjects()),
    );
    rememberCatalog(seeded);
    return seeded;
  }

  const fromDisk = withStoredImagePaths(await readDiskProjects());
  rememberCatalog(fromDisk);
  return fromDisk;
}

export async function readStoredProjectsForWrite() {
  if (usesSupabaseStore()) {
    return readStoredProjects();
  }

  if (usesGitHubStore()) {
    const raw = await readGitHubTextFile(PROJECTS_JSON_REPO_PATH);
    if (raw) {
      const fromGitHub = withStoredImagePaths(
        parseProjectsDocument(JSON.parse(raw)),
      );
      rememberCatalog(fromGitHub);
      return fromGitHub;
    }
  }

  return readStoredProjects();
}

export async function readStoredProjects() {
  if (
    !usesSupabaseStore() &&
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
  const ordered = withStoredImagePaths(sortProjectsNewestFirst(projects));
  const body = `${JSON.stringify({ projects: ordered }, null, 2)}\n`;

  if (usesSupabaseStore()) {
    await writeSupabaseProjects(ordered);
    rememberCatalog(ordered);
    return;
  }

  if (usesGitHubStore()) {
    const files = [
      ...(extras.files ?? []),
      {
        path: PROJECTS_JSON_REPO_PATH,
        content: Buffer.from(body, "utf8"),
      },
    ];
    files.forEach((file) => assertProjectRepoPath(file.path));
    (extras.deletes ?? []).forEach(assertProjectRepoPath);
    await commitGitHubFiles(
      extras.message ?? "Update projects",
      files,
      extras.deletes ?? [],
    );
    rememberCatalog(ordered);
    return;
  }

  try {
    await writeFile(PROJECTS_JSON_PATH, body, "utf8");
  } catch (error) {
    throwIfReadOnly(error);
  }
  rememberCatalog(ordered);
}

export async function saveImageFiles(
  projectId: string,
  files: { buffer: Buffer; filename: string; src: string }[],
): Promise<{
  images: ProjectImage[];
  commitFiles: GitHubFileChange[];
}> {
  if (files.length === 0) return { images: [], commitFiles: [] };

  if (usesSupabaseStore()) {
    return {
      images: await saveSupabaseImages(projectId, files),
      commitFiles: [],
    };
  }

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

export { repoPathFromImageSrc };

export async function removeImageFiles(
  projectId: string,
  images: ProjectImage[],
): Promise<{ commitDeletes: string[] }> {
  const commitDeletes = images
    .map((image) => repoPathFromImageSrc(image.src, projectId))
    .filter((value): value is string => Boolean(value));

  if (usesSupabaseStore()) {
    await removeSupabaseImages(projectId, images);
    return { commitDeletes: [] };
  }

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

  if (!usesGitHubStore() && !usesSupabaseStore()) {
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
