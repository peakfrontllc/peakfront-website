import projectsData from "../../public/projects/projects.json";

export type ProjectStatus = "completed" | "ongoing";

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  id: string;
  projectName: string;
  client: string;
  mainContractor: string;
  scopeOfWork: string;
  equipment: string[];
  location?: string;
  startDate: string;
  completionDate: string;
  status: ProjectStatus;
  images: ProjectImage[];
};

export type StoredProject = {
  id: string;
  projectName: string;
  client: string;
  mainContractor: string;
  scopeOfWork: string;
  equipment: string[];
  location?: string;
  startDate: string;
  completionDate: string;
  status: ProjectStatus;
  images: unknown[];
};

type RawProject = Omit<Project, "equipment" | "status" | "images"> & {
  equipment?: unknown;
  status?: string;
  images?: unknown;
};

function normalizeEquipment(equipment: unknown): string[] {
  if (!Array.isArray(equipment)) return [];

  return equipment
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      if (entry && typeof entry === "object" && "item" in entry) {
        const item = (entry as { item?: unknown }).item;
        return typeof item === "string" ? item.trim() : "";
      }
      return "";
    })
    .filter(Boolean);
}

function normalizeStatus(status: unknown, completionDate: string): ProjectStatus {
  if (status === "ongoing" || status === "completed") return status;
  return (completionDate ?? "").trim().toLowerCase() === "running"
    ? "ongoing"
    : "completed";
}

export function normalizeImages(images: unknown, projectName: string): ProjectImage[] {
  if (!Array.isArray(images)) return [];

  return images
    .map((entry, index) => {
      const fallbackAlt = `${projectName} — photo ${index + 1}`;

      if (typeof entry === "string") {
        const src = entry.trim();
        return src ? { src, alt: fallbackAlt } : null;
      }

      if (entry && typeof entry === "object") {
        const record = entry as {
          src?: unknown;
          image?: unknown;
          url?: unknown;
          alt?: unknown;
        };
        const srcRaw = record.src ?? record.image ?? record.url;
        const src = typeof srcRaw === "string" ? srcRaw.trim() : "";
        if (!src) return null;

        const alt =
          typeof record.alt === "string" && record.alt.trim()
            ? record.alt.trim()
            : fallbackAlt;

        return { src, alt };
      }

      return null;
    })
    .filter((image): image is ProjectImage => image !== null);
}

export function normalizeProject(raw: RawProject): Project {
  return {
    ...raw,
    equipment: normalizeEquipment(raw.equipment),
    status: normalizeStatus(raw.status, raw.completionDate),
    images: normalizeImages(raw.images, raw.projectName),
  };
}

export function parseProjectsDocument(data: unknown): StoredProject[] {
  if (!data || typeof data !== "object" || !("projects" in data)) return [];
  const list = (data as { projects: unknown }).projects;
  if (!Array.isArray(list)) return [];
  return list.filter(
    (entry): entry is StoredProject =>
      Boolean(entry) &&
      typeof entry === "object" &&
      typeof (entry as StoredProject).id === "string" &&
      typeof (entry as StoredProject).projectName === "string",
  );
}

function dedupeProjects(items: Project[]): Project[] {
  const seen = new Set<string>();
  return items.filter((project) => {
    if (seen.has(project.id)) return false;
    seen.add(project.id);
    return true;
  });
}

export const projects: Project[] = dedupeProjects(
  (projectsData.projects as RawProject[]).map(normalizeProject),
);

export function isProjectOngoing(project: Project): boolean {
  return (
    project.status === "ongoing" ||
    (project.completionDate ?? "").trim().toLowerCase() === "running"
  );
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
};
