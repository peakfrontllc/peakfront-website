import type { ProjectStatus } from "@/lib/projects";

export function imageBasename(src: string) {
  try {
    const name = new URL(src, "https://www.peakfront.ae").pathname
      .split("/")
      .pop();
    return name ? decodeURIComponent(name) : src;
  } catch {
    return src.split("/").pop() ?? src;
  }
}

export function asFormString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export function parseEquipment(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseStatus(value: string): ProjectStatus {
  return value === "ongoing" ? "ongoing" : "completed";
}

export async function filesFromForm(formData: FormData) {
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  return Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      buffer: Buffer.from(await file.arrayBuffer()),
    })),
  );
}

export function projectInputFromForm(formData: FormData) {
  return {
    projectName: asFormString(formData.get("projectName")),
    client: asFormString(formData.get("client")),
    mainContractor: asFormString(formData.get("mainContractor")),
    scopeOfWork: asFormString(formData.get("scopeOfWork")),
    equipment: parseEquipment(asFormString(formData.get("equipment"))),
    location: asFormString(formData.get("location")),
    startDate: asFormString(formData.get("startDate")),
    completionDate: asFormString(formData.get("completionDate")),
    status: parseStatus(asFormString(formData.get("status"))),
    imageUrls: formData
      .getAll("imageUrls")
      .filter((entry): entry is string => typeof entry === "string" && entry.length > 0),
    removeImageFiles: formData
      .getAll("removeImages")
      .filter((entry): entry is string => typeof entry === "string" && entry.length > 0),
  };
}
