import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/projects";

export default function ProjectsTeaser() {
  const ongoingCount = projects.filter(
    (p) => p.status === "ongoing" || p.completionDate.toLowerCase() === "running",
  ).length;

  return (
    <section className="border-t border-navy/10 bg-white py-16 sm:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-10">
        <div className="max-w-xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Our Projects
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {projects.length}+ contracts delivered across the UAE
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            View the full list of completed and ongoing mobilisations — clients,
            contractors, equipment supplied and contract dates.
            {ongoingCount > 0 && (
              <span className="mt-1 block font-medium text-navy">
                {ongoingCount} project{ongoingCount === 1 ? "" : "s"} currently
                running.
              </span>
            )}
          </p>
        </div>
        <Link
          href="/our-project"
          className="group inline-flex w-full items-center justify-center gap-2 bg-navy px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-blue sm:w-auto"
        >
          View All Projects
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
