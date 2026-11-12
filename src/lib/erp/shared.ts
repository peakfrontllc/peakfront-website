import { redirect } from "next/navigation";

export const EMIRATES = [
  "Abu Dhabi",
  "Al Ain",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export const EQUIPMENT_STATUSES = [
  "available",
  "reserved",
  "deployed",
  "maintenance",
  "inactive",
] as const;

export const OWNERSHIP = ["owned", "supplier", "both"] as const;

export function ownershipLabel(value: string) {
  if (value === "owned") return "Ours";
  if (value === "both") return "Ours and supplier";
  return "Supplier";
}

export const ASSET_STATUSES = ["available", "deployed", "maintenance", "retired"] as const;

export function chosenEmirates(formData: FormData) {
  const picked = new Set(
    formData.getAll("emirates").filter((value): value is string => typeof value === "string"),
  );
  return EMIRATES.filter((emirate) => picked.has(emirate));
}

export function emiratesFromRow(emirates: unknown, emirate: string) {
  const allowed = new Set<string>(EMIRATES);
  if (Array.isArray(emirates)) {
    const values = emirates.filter((item): item is string => typeof item === "string" && allowed.has(item));
    if (values.length > 0) return EMIRATES.filter((item) => values.includes(item));
  }
  const stored = emirate.split(",").map((item) => item.trim());
  return EMIRATES.filter((item) => stored.includes(item));
}

export function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export type SocialLink = { label: string; url: string };

export function socialLinkPairs(formData: FormData) {
  const labels = formData.getAll("socialLabel").map((value) => (typeof value === "string" ? value.trim() : ""));
  const urls = formData.getAll("socialUrl").map((value) => (typeof value === "string" ? value.trim() : ""));
  const links: SocialLink[] = [];
  const count = Math.max(labels.length, urls.length);
  for (let index = 0; index < count; index += 1) {
    const label = labels[index] ?? "";
    const url = urls[index] ?? "";
    if (!label && !url) continue;
    if (!url) return { error: "Enter the social link.", links: [] as SocialLink[] };
    links.push({ label, url });
  }
  return { error: null, links };
}

export function socialLinksFromValue(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { label?: unknown; url?: unknown };
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const url = typeof record.url === "string" ? record.url.trim() : "";
    if (!url) return [];
    return [{ label, url }];
  });
}

export function socialHref(url: string) {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9][\w.-]*\.[a-z]{2,}([/?#].*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return "";
}

export function extraFieldPairs(formData: FormData) {
  const labels = formData.getAll("fieldLabel").map((value) => (typeof value === "string" ? value.trim() : ""));
  const values = formData.getAll("fieldValue").map((value) => (typeof value === "string" ? value.trim() : ""));
  const pairs: { label: string; value: string }[] = [];
  const count = Math.max(labels.length, values.length);
  for (let index = 0; index < count; index += 1) {
    const label = labels[index] ?? "";
    const value = values[index] ?? "";
    if (!label && !value) continue;
    if (!label || !value) return { error: "Each extra field needs a name and a value.", pairs: [] };
    pairs.push({ label, value });
  }
  return { error: null, pairs };
}

export function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function fail(path: string, message: string): never {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("error", message);
  redirect(`${url.pathname}${url.search}`);
}

export function searchTerm(value: string | undefined) {
  return (value ?? "").replace(/[%_,.()]/g, " ").trim().slice(0, 80);
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "item";
}

export function parseMoney(value: string) {
  if (!value) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return Number.NaN;
  return Number(value);
}

export function formatMoney(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `AED ${amount.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function dayBefore(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function isCurrentRate(validFrom: string, validTo: string | null) {
  const today = todayIso();
  return validFrom <= today && (validTo === null || validTo >= today);
}

export function fileFromForm(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}
