import path from "node:path";
import { readProjectImages } from "@/lib/load-projects";
import { imageBasename } from "@/lib/project-form";
import {
  deleteProjectFiles,
  nextDiskImageNumber,
  removeImageFiles,
  saveImageFiles,
  usesBlobStore,
  writeStoredProjects,
  readStoredProjects,
} from "@/lib/project-store";
import type { ProjectImage, ProjectStatus, StoredProject } from "@/lib/projects";

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
  imageUrls?: string[];
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

function imageNumberFromSrc(src: string): number | null {
  const name = imageBasename(src).replace(/\.[^.]+$/, "");
  const match = name.match(/^(\d+)/);
  if (!match) return null;
  const value = Number.parseInt(match[1], 10);
  return Number.isInteger(value) && value > 0 ? value : null;
}

async function nextImageNumber(projectId: string, images: ProjectImage[]) {
  const fromSrc = images
    .map((image) => imageNumberFromSrc(image.src))
    .filter((value): value is number => value !== null);
  const fromDisk = usesBlobStore() ? 1 : await nextDiskImageNumber(projectId);
  const highest = Math.max(0, ...fromSrc, fromDisk - 1);
  return highest + 1;
}

function withAlts(projectName: string, images: ProjectImage[]): ProjectImage[] {
  return images.map((image, index) => ({
    src: image.src,
    alt: image.alt.trim() || `${projectName} — photo ${index + 1}`,
  }));
}

function toStoredProject(
  id: string,
  input: ProjectInput,
  images: ProjectImage[],
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
    images: withAlts(input.projectName.trim(), images),
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
  const incoming = input.images.length + (input.imageUrls?.length ?? 0);
  if (existingImageCount + incoming > MAX_IMAGES) {
    throw new Error(`You can keep up to ${MAX_IMAGES} photos per project.`);
  }
  for (const image of input.images) {
    if (image.buffer.byteLength > MAX_IMAGE_BYTES) {
      throw new Error("Each photo must be 8 MB or smaller.");
    }
  }
}

function urlsToImages(projectName: string, urls: string[]): ProjectImage[] {
  return urls
    .map((src) => src.trim())
    .filter(Boolean)
    .map((src) => ({ src, alt: `${projectName} — photo` }));
}

async function appendUploadedImages(
  id: string,
  input: ProjectInput,
  existing: ProjectImage[],
): Promise<ProjectImage[]> {
  let imageNumber = await nextImageNumber(id, existing);
  const prepared = input.images.map((image) => {
    const ext = imageExtension(image.filename);
    const filename = usesBlobStore()
      ? `projects/images/${id}/${imageNumber}${ext}`
      : `${imageNumber}${ext}`;
    const src = `/projects/images/${id}/${imageNumber}${ext}`;
    imageNumber += 1;
    return { buffer: image.buffer, filename, src };
  });

  const savedFiles = await saveImageFiles(id, prepared);
  const fromUrls = urlsToImages(input.projectName, input.imageUrls ?? []);
  return [...existing, ...savedFiles, ...fromUrls];
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
  const images = await appendUploadedImages(id, input, []);
  await writeStoredProjects([
    ...stored,
    toStoredProject(id, input, images),
  ]);
  return { id, imageCount: images.length };
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

  const current = stored[index];
  const existingImages = await readProjectImages(
    id,
    current.projectName,
    current.images,
  );
  const removeNames = new Set(input.removeImageFiles ?? []);
  const remaining = existingImages.filter(
    (image) => !removeNames.has(imageBasename(image.src)),
  );
  const removed = existingImages.filter((image) =>
    removeNames.has(imageBasename(image.src)),
  );

  validateInput(input, remaining.length);

  if (removed.length > 0) {
    await removeImageFiles(id, removed);
  }

  const images = await appendUploadedImages(id, input, remaining);
  const next = [...stored];
  next[index] = toStoredProject(id, input, images);
  await writeStoredProjects(next);

  return { id, imageCount: images.length };
}

export async function deleteProject(id: string): Promise<void> {
  const stored = await readStoredProjects();
  const current = stored.find((project) => project.id === id);
  if (!current) {
    throw new Error("Project not found.");
  }

  const images = await readProjectImages(id, current.projectName, current.images);
  await writeStoredProjects(stored.filter((project) => project.id !== id));
  await deleteProjectFiles(id, images);
}
