import type { Metadata } from "next";
import { needsLiveStoreSetup } from "@/lib/project-store";
import { getProjects } from "@/lib/load-projects";
import ManageProjectsClient from "./ManageProjectsClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Manage Projects",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ManageProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="bg-navy pt-28 pb-14 text-white sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Project manager
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Add, edit and delete projects
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Changes are saved to GitHub and then appear on Our Projects.
          </p>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-5 lg:px-10">
          {needsLiveStoreSetup() && (
            <p className="mb-6 border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">
              Saving is not set up on the live server yet. In Vercel, add
              PROJECTS_GITHUB_TOKEN (a GitHub token with Contents read/write
              on this repo), then redeploy.
            </p>
          )}
          <ManageProjectsClient projects={projects} />
        </div>
      </section>
    </>
  );
}
