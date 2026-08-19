import { readdir } from "node:fs/promises";
import path from "node:path";
import { PROJECTS_IMAGES_DIR, readStoredProjects } from "@/lib/project-store";
import {
  normalizeImages,
  normalizeProject,
  type Project,
  type ProjectImage,
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

export async function readProjectImages(
  projectId: string,
  projectName: string,
  storedImages: unknown[],
): Promise<ProjectImage[]> {
  const fromJson = normalizeImages(storedImages, projectName);
  const folderImages = await readFolderImages(projectId, projectName);
  const seen = new Set(folderImages.map((image) => image.src));
  return [...folderImages, ...fromJson.filter((image) => !seen.has(image.src))];
}

export { readStoredProjects };

export async function getProjects(): Promise<Project[]> {
  const stored = await readStoredProjects();
  const catalog = stored.map((entry) => normalizeProject(entry));

  return Promise.all(
    catalog.map(async (project) => {
      const images = await readProjectImages(
        project.id,
        project.projectName,
        project.images,
      );
      return { ...project, images };
    }),
  );
}
