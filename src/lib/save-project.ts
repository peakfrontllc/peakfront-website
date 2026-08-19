import { mkdir, readdir, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  PROJECTS_IMAGES_DIR,
  PROJECTS_JSON_PATH,
  readStoredProjects,
} from "@/lib/load-projects";
import type { ProjectStatus, StoredProject } from "@/lib/projects";

const MAX_IMAGES = 12;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export type ProjectInput = {
  projectName: string;
  client: string;
  mainContractor: string;
  scopeOfWork: string;
  equipment: string[];
  location: string;
  startDate: string;
  completionDate: string;
  status: ProjectStatus;
  images: { buffer: Buffer; filename: string }[];
  removeImageFiles?: string[];
};

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "project";
}

function uniqueId(base: string, existing: Set<string>): string {
  if (!existing.has(base)) return base;
  let n = 2;
  while (existing.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function yearSuffix(startDate: string): string {
  const match = startDate.match(/(\d{2,4})\s*$/);
  if (!match) return String(new Date().getFullYear());
  const value = match[1];
  if (value.length === 2) return `20${value}`;
  return value;
}

function imageExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".jpeg") return ".jpg";
  if ([".webp", ".jpg", ".png", ".gif", ".avif"].includes(ext)) return ext;
  return ".jpg";
}

function safeImageFilename(filename: string): string {
  const base = path.basename(filename);
  if (!base || base !== filename.replace(/\\/g, "/").split("/").pop()) {
    throw new Error("Invalid photo filename.");
  }
  return base;
}

function toStoredProject(
  id: string,
  input: ProjectInput,
): StoredProject {
  const project: StoredProject = {
    id,
    projectName: input.projectName.trim(),
    client: input.client.trim(),
    mainContractor: input.mainContractor.trim(),
    scopeOfWork: input.scopeOfWork.trim(),
    equipment: input.equipment.map((item) => item.trim()).filter(Boolean),
    startDate: input.startDate.trim(),
    completionDate:
      input.status === "ongoing" && !input.completionDate.trim()
        ? "Running"
        : input.completionDate.trim(),
    status: input.status,
    images: [],
  };

  if (input.location.trim()) {
    project.location = input.location.trim();
  }

  return project;
}

function validateInput(input: ProjectInput, existingImageCount = 0) {
  if (!input.projectName.trim()) {
    throw new Error("Project name is required.");
  }
  if (input.status === "completed" && !input.completionDate.trim()) {
    throw new Error("Completion date is required for completed projects.");
  }
  if (existingImageCount + input.images.length > MAX_IMAGES) {
    throw new Error(`You can keep up to ${MAX_IMAGES} photos per project.`);
  }
  for (const image of input.images) {
    if (image.buffer.byteLength > MAX_IMAGE_BYTES) {
      throw new Error("Each photo must be 8 MB or smaller.");
    }
  }
}

async function writeProjects(projects: StoredProject[]) {
  await writeFile(
    PROJECTS_JSON_PATH,
    `${JSON.stringify({ projects }, null, 2)}\n`,
    "utf8",
  );
}

async function nextImageNumber(projectId: string): Promise<number> {
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

async function saveImages(projectId: string, images: ProjectInput["images"]) {
  const imageDir = path.join(PROJECTS_IMAGES_DIR, projectId);
  await mkdir(imageDir, { recursive: true });

  let imageNumber = await nextImageNumber(projectId);
  let saved = 0;

  for (const image of images) {
    const ext = imageExtension(image.filename);
    await writeFile(path.join(imageDir, `${imageNumber}${ext}`), image.buffer);
    imageNumber += 1;
    saved += 1;
  }

  return saved;
}

async function removeImages(projectId: string, filenames: string[]) {
  const imageDir = path.join(PROJECTS_IMAGES_DIR, projectId);

  for (const filename of filenames) {
    const safe = safeImageFilename(filename);
    await unlink(path.join(imageDir, safe)).catch(() => undefined);
  }
}

export async function saveUploadedProject(input: ProjectInput): Promise<{
  id: string;
  imageCount: number;
}> {
  validateInput(input);
  const stored = await readStoredProjects();
  const id = uniqueId(
    `${slugify(input.projectName)}-${yearSuffix(input.startDate)}`,
    new Set(stored.map((project) => project.id)),
  );
  const imageCount = await saveImages(id, input.images);
  await writeProjects([...stored, toStoredProject(id, input)]);
  return { id, imageCount };
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<{ id: string; imageCount: number }> {
  const stored = await readStoredProjects();
  const index = stored.findIndex((project) => project.id === id);
  if (index === -1) {
    throw new Error("Project not found.");
  }

  const removeImageFiles = input.removeImageFiles ?? [];
  const remainingEstimate = Math.max(
    0,
    (await nextImageNumber(id)) - 1 - removeImageFiles.length,
  );
  validateInput(input, remainingEstimate);

  if (removeImageFiles.length > 0) {
    await removeImages(id, removeImageFiles);
  }

  const imageCount = await saveImages(id, input.images);
  const next = [...stored];
  next[index] = toStoredProject(id, input);
  await writeProjects(next);

  return { id, imageCount };
}

export async function deleteProject(id: string): Promise<void> {
  const stored = await readStoredProjects();
  const next = stored.filter((project) => project.id !== id);
  if (next.length === stored.length) {
    throw new Error("Project not found.");
  }

  await writeProjects(next);
  await rm(path.join(PROJECTS_IMAGES_DIR, id), {
    recursive: true,
    force: true,
  });
}
