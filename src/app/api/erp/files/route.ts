import { NextResponse } from "next/server";
import { PERMISSIONS, type PermissionKey } from "@/lib/auth/permissions";
import { authorize } from "@/lib/auth/session";
import { DOCUMENT_BUCKET, IMAGE_BUCKET } from "@/lib/erp/files";
import { getServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bucket = url.searchParams.get("bucket") ?? "";
  const path = url.searchParams.get("path") ?? "";
  if (
    (bucket !== IMAGE_BUCKET && bucket !== DOCUMENT_BUCKET) ||
    !/^[a-z0-9/_-]+\.[a-z0-9]+$/i.test(path) ||
    path.includes("..")
  ) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const permission: PermissionKey = bucket === IMAGE_BUCKET ? PERMISSIONS.equipmentRead : PERMISSIONS.documentsRead;
  const gate = await authorize(permission);
  if (!gate.session) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const { data, error } = await getServiceClient().storage.from(bucket).download(path);
  if (error || !data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const ext = path.includes(".") ? path.slice(path.lastIndexOf(".")).toLowerCase() : "";
  return new NextResponse(data, {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
    },
  });
}
