import { NextResponse } from "next/server";
import { filesFromForm, projectInputFromForm } from "@/lib/project-form";
import { saveUploadedProject } from "@/lib/save-project";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  try {
    const saved = await saveUploadedProject({
      ...projectInputFromForm(formData),
      images: await filesFromForm(formData),
    });

    return NextResponse.json({
      ok: true,
      id: saved.id,
      imageCount: saved.imageCount,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save the project.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
