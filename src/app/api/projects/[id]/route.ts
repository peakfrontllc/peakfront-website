import { NextResponse } from "next/server";
import { hydrateProjects } from "@/lib/load-projects";
import { filesFromForm, projectInputFromForm } from "@/lib/project-form";
import { deleteProject, updateProject } from "@/lib/save-project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  try {
    const saved = await updateProject(id, {
      ...projectInputFromForm(formData),
      images: await filesFromForm(formData),
    });

    return NextResponse.json({
      ok: true,
      id: saved.id,
      imageCount: saved.imageCount,
      projects: await hydrateProjects(saved.stored),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update the project.";
    const status = message === "Project not found." ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const stored = await deleteProject(id);
    return NextResponse.json({
      ok: true,
      id,
      projects: await hydrateProjects(stored),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not delete the project.";
    const status = message === "Project not found." ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
