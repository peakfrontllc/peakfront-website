import { NextResponse } from "next/server";
import { logActivity } from "@/lib/auth/activity";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { authorize } from "@/lib/auth/session";
import { hydrateProjects } from "@/lib/load-projects";
import { filesFromForm, projectInputFromForm } from "@/lib/project-form";
import { deleteProject, updateProject } from "@/lib/save-project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const gate = await authorize(PERMISSIONS.websiteProjectsWrite);
  if (!gate.session) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

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

    await logActivity(gate.session, "website_project.updated", "website_project", saved.id);

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
  const gate = await authorize(PERMISSIONS.websiteProjectsWrite);
  if (!gate.session) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  try {
    const stored = await deleteProject(id);
    await logActivity(gate.session, "website_project.deleted", "website_project", id);
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
