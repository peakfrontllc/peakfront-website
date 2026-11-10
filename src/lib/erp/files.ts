import "server-only";

import { randomUUID } from "node:crypto";
import { getServiceClient } from "@/lib/supabase/service";

export const IMAGE_BUCKET = "equipment-images";
export const DOCUMENT_BUCKET = "master-documents";

const IMAGE_TYPES = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const DOCUMENT_TYPES = new Set([".pdf", ".jpg", ".jpeg", ".png", ".webp"]);

function extension(filename: string, allowed: Set<string>, kind: "image" | "document") {
  const ext = filename.includes(".")
    ? filename.slice(filename.lastIndexOf(".")).toLowerCase()
    : "";
  if (!allowed.has(ext)) {
    throw new Error(
      kind === "image" ? "Use a JPG, PNG, WEBP, or GIF image." : "Use a PDF or image file.",
    );
  }
  return ext === ".jpeg" ? ".jpg" : ext;
}

export async function storeFile(
  bucket: string,
  folder: string,
  file: File,
  kind: "image" | "document",
) {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Each file must be 5 MB or smaller.");
  }
  const ext = extension(file.name, kind === "image" ? IMAGE_TYPES : DOCUMENT_TYPES, kind);
  const path = `${folder}/${randomUUID()}${ext}`;
  const { error } = await getServiceClient().storage.from(bucket).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(error.message || "Could not upload the file.");
  return path;
}

export async function removeStoredFile(bucket: string, path: string) {
  await getServiceClient().storage.from(bucket).remove([path]);
}
