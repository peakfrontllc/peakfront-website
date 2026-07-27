import projectsData from "../../data/projects.json";

export type ProjectStatus = "completed" | "ongoing";

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
};

type RawProject = Omit<Project, "equipment" | "status"> & {
  equipment?: unknown;
  status?: string;
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
  return completionDate.toLowerCase() === "running" ? "ongoing" : "completed";
}

function normalizeProject(raw: RawProject): Project {
  return {
    ...raw,
    equipment: normalizeEquipment(raw.equipment),
    status: normalizeStatus(raw.status, raw.completionDate),
  };
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
    project.completionDate.toLowerCase() === "running"
  );
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
};
