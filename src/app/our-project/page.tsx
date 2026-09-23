import type { Metadata } from "next";
import { getProjects } from "@/lib/load-projects";
import ProjectsPageClient from "./ProjectsPageClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Current and completed equipment rental projects across the UAE — clients, contractors, scope and mobilisation details from Peakfront Equipment Rental LLC.",
  alternates: {
    canonical: "/our-project",
  },
};

export default async function OurProjectPage() {
  const projects = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}
