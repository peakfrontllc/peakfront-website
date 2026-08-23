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

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export function parseProjectDate(value: string | undefined): number | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed || trimmed.toLowerCase() === "running") return null;

  const named = trimmed.match(
    /^(\d{1,2})[-\s/]([A-Za-z]{3,9})[-\s/](\d{2,4})$/,
  );
  if (named) {
    const day = Number.parseInt(named[1], 10);
    const month = MONTH_INDEX[named[2].slice(0, 3).toLowerCase()];
    let year = Number.parseInt(named[3], 10);
    if (year < 100) year += 2000;
    if (month === undefined || day < 1 || day > 31) return null;
    return Date.UTC(year, month, day);
  }

  const numeric = trimmed.match(/^(\d{1,2})[-\s/](\d{1,2})[-\s/](\d{2,4})$/);
  if (numeric) {
    const day = Number.parseInt(numeric[1], 10);
    const month = Number.parseInt(numeric[2], 10) - 1;
    let year = Number.parseInt(numeric[3], 10);
    if (year < 100) year += 2000;
    if (month < 0 || month > 11 || day < 1 || day > 31) return null;
    return Date.UTC(year, month, day);
  }

  const timestamp = Date.parse(trimmed);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function projectRecency(project: Pick<Project, "startDate" | "completionDate">) {
  return (
    parseProjectDate(project.startDate) ??
    parseProjectDate(project.completionDate) ??
    0
  );
}

export function sortProjectsNewestFirst<
  T extends Pick<Project, "startDate" | "completionDate">,
>(items: T[]): T[] {
  return items
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
      const recency = projectRecency(b.project) - projectRecency(a.project);
      if (recency !== 0) return recency;
      return b.index - a.index;
    })
    .map(({ project }) => project);
}

export const projects: Project[] = sortProjectsNewestFirst(
  dedupeProjects((projectsData.projects as RawProject[]).map(normalizeProject)),
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
