import type { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Current and completed equipment rental projects across the UAE — clients, contractors, scope and mobilisation details from Peakfront Equipment Rental LLC.",
  alternates: {
    canonical: "/our-project",
  },
};

export default function OurProjectPage() {
  return <ProjectsPageClient />;
}
