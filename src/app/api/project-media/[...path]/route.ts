import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { readGitHubBinaryFile } from "@/lib/github-projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

function imageResponse(file: Buffer, filename: string) {
  const ext = filename.includes(".")
    ? `.${filename.split(".").pop()?.toLowerCase()}`
    : "";

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  if (!segments || segments.length < 2) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const [projectId, ...rest] = segments;
  const filename = rest.join("/");
  if (
    !/^[a-z0-9-]+$/i.test(projectId) ||
    !/^[a-z0-9._-]+$/i.test(filename) ||
    filename.includes("..")
  ) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const fromDisk = await readFile(
      path.join(process.cwd(), "public", "projects", "images", projectId, filename),
    );
    return imageResponse(fromDisk, filename);
  } catch {
    // Newly saved photos exist on GitHub before the next Vercel deploy.
  }

  const file = await readGitHubBinaryFile(
    `public/projects/images/${projectId}/${filename}`,
  );
  if (!file) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return imageResponse(file, filename);
}
