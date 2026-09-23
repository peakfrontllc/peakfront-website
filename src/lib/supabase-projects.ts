import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { imageBasename } from "@/lib/project-form";
import type { ProjectImage, StoredProject } from "@/lib/projects";

const BUCKET = "project-images";

type ProjectRow = {
  id: string;
  project_name: string;
  client: string;
  main_contractor: string;
  scope_of_work: string;
  equipment: unknown;
  location: string | null;
  start_date: string;
  completion_date: string;
  status: string;
  images: unknown;
};

function supabaseUrl() {
  const raw = process.env.SUPABASE_URL?.trim() || "";
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url.origin;
  } catch {
    return raw.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
  }
}

function supabaseServiceKey() {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    ""
  );
}

export function usesSupabaseStore() {
  return Boolean(supabaseUrl() && supabaseServiceKey());
}

export function getSupabase(): SupabaseClient {
  if (!usesSupabaseStore()) {
    throw new Error(
      "Add SUPABASE_URL and SUPABASE_SECRET_KEY, then redeploy.",
    );
  }

  return createClient(supabaseUrl(), supabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function imageContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".avif") return "image/avif";
  return "image/jpeg";
}

function publicImageUrl(projectId: string, filename: string) {
  return getSupabase().storage.from(BUCKET).getPublicUrl(
    `${projectId}/${filename}`,
  ).data.publicUrl;
}

function storagePathFromSrc(src: string, projectId: string) {
  const name = imageBasename(src);
  if (!name || name.includes("..") || !/^[a-z0-9._-]+$/i.test(name)) {
    return null;
  }
  return `${projectId}/${name}`;
}

function rowToProject(row: ProjectRow): StoredProject {
  const project: StoredProject = {
    id: row.id,
    projectName: row.project_name,
    client: row.client,
    mainContractor: row.main_contractor,
    scopeOfWork: row.scope_of_work,
    equipment: Array.isArray(row.equipment)
      ? row.equipment.filter((item): item is string => typeof item === "string")
      : [],
    startDate: row.start_date,
    completionDate: row.completion_date,
    status: row.status === "ongoing" ? "ongoing" : "completed",
    images: Array.isArray(row.images) ? row.images : [],
  };

  if (row.location) project.location = row.location;
  return project;
}

function projectToRow(project: StoredProject): ProjectRow {
  return {
    id: project.id,
    project_name: project.projectName,
    client: project.client,
    main_contractor: project.mainContractor,
    scope_of_work: project.scopeOfWork,
    equipment: project.equipment,
    location: project.location ?? null,
    start_date: project.startDate,
    completion_date: project.completionDate,
    status: project.status,
    images: project.images,
  };
}

async function uploadBuffer(
  projectId: string,
  filename: string,
  buffer: Buffer,
) {
  const objectPath = `${projectId}/${filename}`;
  const { error } = await getSupabase().storage.from(BUCKET).upload(
    objectPath,
    buffer,
    {
      contentType: imageContentType(filename),
      upsert: true,
    },
  );
  if (error) {
    throw new Error(error.message || "Could not upload the photo.");
  }
  return publicImageUrl(projectId, filename);
}

async function copyLocalImages(project: StoredProject): Promise<StoredProject> {
  const images: ProjectImage[] = [];

  for (const image of project.images) {
    const entry =
      typeof image === "string"
        ? { src: image, alt: "" }
        : image && typeof image === "object" && "src" in image
          ? (image as ProjectImage)
          : null;
    if (!entry?.src) continue;

    if (entry.src.startsWith("http://") || entry.src.startsWith("https://")) {
      images.push(entry);
      continue;
    }

    const filename = imageBasename(entry.src);
    const localPath = path.join(
      process.cwd(),
      "public",
      "projects",
      "images",
      project.id,
      filename,
    );
    try {
      const buffer = await readFile(localPath);
      const src = await uploadBuffer(project.id, filename, buffer);
      images.push({ ...entry, src });
    } catch {
      images.push(entry);
    }
  }

  return { ...project, images };
}

export async function readSupabaseProjects(): Promise<StoredProject[] | null> {
  const { data, error } = await getSupabase()
    .from("projects")
    .select(
      "id, project_name, client, main_contractor, scope_of_work, equipment, location, start_date, completion_date, status, images",
    );

  if (error) {
    throw new Error(error.message || "Could not read projects from Supabase.");
  }

  if (!data || data.length === 0) return null;
  return data.map((row) => rowToProject(row as ProjectRow));
}

export async function seedSupabaseProjects(projects: StoredProject[]) {
  if (projects.length === 0) return [];

  const uploaded = [];
  for (const project of projects) {
    uploaded.push(await copyLocalImages(project));
  }

  const { error } = await getSupabase()
    .from("projects")
    .upsert(uploaded.map(projectToRow), { onConflict: "id" });
  if (error) {
    throw new Error(error.message || "Could not save projects to Supabase.");
  }

  return uploaded;
}

export async function writeSupabaseProjects(projects: StoredProject[]) {
  const supabase = getSupabase();
  const { data: existing, error: readError } = await supabase
    .from("projects")
    .select("id");
  if (readError) {
    throw new Error(readError.message || "Could not read projects from Supabase.");
  }

  const keep = new Set(projects.map((project) => project.id));
  const removed = (existing ?? [])
    .map((row) => row.id as string)
    .filter((id) => !keep.has(id));

  if (removed.length > 0) {
    const { error } = await supabase.from("projects").delete().in("id", removed);
    if (error) {
      throw new Error(error.message || "Could not delete projects.");
    }
  }

  if (projects.length > 0) {
    const { error } = await supabase
      .from("projects")
      .upsert(
        projects.map((project) => ({
          ...projectToRow(project),
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "id" },
      );
    if (error) {
      throw new Error(error.message || "Could not save projects to Supabase.");
    }
  }
}

export async function saveSupabaseImages(
  projectId: string,
  files: { buffer: Buffer; filename: string }[],
): Promise<ProjectImage[]> {
  const images: ProjectImage[] = [];
  for (const file of files) {
    const filename = path.basename(file.filename);
    const src = await uploadBuffer(projectId, filename, file.buffer);
    images.push({ src, alt: "" });
  }
  return images;
}

export async function removeSupabaseImages(
  projectId: string,
  images: ProjectImage[],
) {
  const paths = images
    .map((image) => storagePathFromSrc(image.src, projectId))
    .filter((value): value is string => Boolean(value));
  if (paths.length === 0) return;

  await getSupabase().storage.from(BUCKET).remove(paths);
}
