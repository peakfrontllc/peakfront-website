import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  normalizeProject,
  parseProjectsDocument,
  type Project,
  type ProjectImage,
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

export async function readStoredProjects() {
  const raw = await readFile(PROJECTS_JSON_PATH, "utf8");
  return parseProjectsDocument(JSON.parse(raw));
}

export async function getProjects(): Promise<Project[]> {
  const stored = await readStoredProjects();
  const catalog = stored.map((entry) => normalizeProject(entry));

  return Promise.all(
    catalog.map(async (project) => {
      const folderImages = await readFolderImages(project.id, project.projectName);
      const seen = new Set(folderImages.map((image) => image.src));
      const extra = project.images.filter((image) => !seen.has(image.src));

      return {
        ...project,
        images: [...folderImages, ...extra],
      };
    }),
  );
}
