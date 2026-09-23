import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  PROJECTS_IMAGES_DIR,
  readStoredProjects,
  usesGitHubStore,
} from "@/lib/project-store";
import {
  normalizeImages,
  normalizeProject,
  sortProjectsNewestFirst,
  type Project,
  type ProjectImage,
  type StoredProject,
} from "@/lib/projects";

const IMAGE_EXTENSIONS = new Set([
  ".webp",
  ".jpg",
  ".jpeg",
  ".png",
  ".avif",
  ".gif",
]);

async function readFolderImages(
  projectId: string,
  projectName: string,
): Promise<ProjectImage[]> {
  const dir = path.join(PROJECTS_IMAGES_DIR, projectId);

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
      )
      .map((entry) => entry.name)
      .sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
      );

    return files.map((file, index) => ({
      src: publicImageSrc(`/projects/images/${projectId}/${file}`),
      alt: `${projectName} — photo ${index + 1}`,
    }));
  } catch {
    return [];
  }
}

export async function readProjectImages(
  projectId: string,
  projectName: string,
  storedImages: unknown[],
): Promise<ProjectImage[]> {
  const fromJson = normalizeImages(storedImages, projectName).map((image) => ({
    ...image,
    src: publicImageSrc(image.src),
  }));

  // On Vercel the deploy snapshot can be older than GitHub. JSON is the source of truth.
  if (usesGitHubStore()) return fromJson;

  const folderImages = await readFolderImages(projectId, projectName);
  const seen = new Set(folderImages.map((image) => image.src));
  return [...folderImages, ...fromJson.filter((image) => !seen.has(image.src))];
}

function publicImageSrc(src: string) {
  if (!usesGitHubStore()) return src;
  const match = src.match(/^\/projects\/images\/(.+)$/);
  return match ? `/api/project-media/${match[1]}` : src;
}

export { readStoredProjects };

export async function hydrateProjects(
  stored: StoredProject[],
): Promise<Project[]> {
  const catalog = stored.map((entry) => normalizeProject(entry));

  const hydrated = await Promise.all(
    catalog.map(async (project) => {
      const images = await readProjectImages(
        project.id,
        project.projectName,
        project.images,
      );
      return { ...project, images };
    }),
  );

  return sortProjectsNewestFirst(hydrated);
}

export async function getProjects(): Promise<Project[]> {
  return hydrateProjects(await readStoredProjects());
}
