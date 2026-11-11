import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { MasterHero } from "@/components/manage/erp/ui";
import { needsLiveStoreSetup } from "@/lib/project-store";
import { getProjects } from "@/lib/load-projects";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import ManageProjectsClient from "../../ManageProjectsClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: false } };

export default async function ProjectsPage() {
  const session = await requirePermission(PERMISSIONS.websiteProjectsRead);
  const projects = await getProjects();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.websiteProjectsWrite);

  return (
    <>
      <MasterHero kicker="Website" title="Projects" icon={FolderKanban} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Completed and ongoing work shown on Our Projects.
      </p>
      {needsLiveStoreSetup() && (
        <p className="mb-6 border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">
          Saving is not set up on the live server yet. In Vercel, add SUPABASE_URL and SUPABASE_SECRET_KEY, then redeploy.
        </p>
      )}
      <ManageProjectsClient projects={projects} canWrite={canWrite} />
    </>
  );
}
