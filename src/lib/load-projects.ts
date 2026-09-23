import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";
import { toStoredImageSrc } from "@/lib/project-paths";
import {
  PROJECTS_IMAGES_DIR,
  readStoredProjects,
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
      src: `/projects/images/${projectId}/${file}`,
      alt: `${projectName} — photo ${index + 1}`,
    }));
  } catch {
    return [];
  }
}

function uniqueImages(images: ProjectImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    const src = toStoredImageSrc(image.src);
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

export async function readProjectImages(
  projectId: string,
  projectName: string,
  storedImages: unknown[],
): Promise<ProjectImage[]> {
  const fromJson = uniqueImages(
    normalizeImages(storedImages, projectName).map((image) => ({
      ...image,
      src: toStoredImageSrc(image.src),
    })),
  );
  if (fromJson.length > 0) return fromJson;

  return uniqueImages(await readFolderImages(projectId, projectName));
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
