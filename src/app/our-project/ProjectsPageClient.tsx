"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  isProjectOngoing,
  projects,
  type Project,
} from "@/lib/projects";

type Filter = "all" | "ongoing" | "completed";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

function ScopeCell({ project }: { project: Project }) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-slate-600">
        {project.scopeOfWork}
      </p>
      {project.equipment.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue">
            Equipment Supplied
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.equipment.map((item) => (
              <li
                key={item}
                className="border border-navy/10 bg-slate-50 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-navy/75"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const ongoing = isProjectOngoing(project);

  return (
    <article className="border border-navy/10 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug text-navy">
          {project.projectName}
        </h3>
        <span
          className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 ${
            ongoing ? "bg-amber text-navy" : "bg-navy text-white"
          }`}
        >
          {ongoing ? "Ongoing" : "Completed"}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Client
          </dt>
          <dd className="mt-0.5 font-medium text-navy">{project.client}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Main Contractor
          </dt>
          <dd className="mt-0.5 font-medium text-navy">
            {project.mainContractor}
          </dd>
        </div>
        {project.location && (
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Location
            </dt>
            <dd className="mt-0.5 font-medium text-navy">{project.location}</dd>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Start
            </dt>
            <dd className="mt-0.5 font-mono font-medium text-navy">
              {project.startDate}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Completion
            </dt>
            <dd className="mt-0.5 font-mono font-medium text-navy">
              {project.completionDate}
            </dd>
          </div>
        </div>
      </dl>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <ScopeCell project={project} />
      </div>
    </article>
  );
}

export default function ProjectsPageClient() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    if (filter === "ongoing") return projects.filter(isProjectOngoing);
    return projects.filter((p) => !isProjectOngoing(p));
  }, [filter]);

  return (
    <>
      <section className="bg-navy pt-28 pb-14 text-white sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Our Projects
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Projects executed by Peakfront across the UAE
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Equipment rental and mobilisation delivered for contractors,
            developers and government projects — current and completed contracts.
          </p>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              List of Projects
            </h2>
            <div className="flex flex-wrap gap-2">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`touch-target border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                    filter === value
                      ? "border-navy bg-navy text-white"
                      : "border-navy/15 bg-white text-navy hover:border-amber"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop table */}
          <div className="mt-8 hidden overflow-x-auto border border-navy/10 bg-white lg:block">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-navy/10 bg-navy text-white">
                  <th className="px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Project Name
                  </th>
                  <th className="px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Client
                  </th>
                  <th className="px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Main Contractor
                  </th>
                  <th className="min-w-[280px] px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Scope of Work
                  </th>
                  <th className="px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Start Date
                  </th>
                  <th className="px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Completion
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project, index) => (
                  <tr
                    key={project.id}
                    className={`border-b border-navy/10 align-top ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/80"
                    }`}
                  >
                    <td className="px-4 py-5 font-semibold text-navy">
                      {project.projectName}
                      {project.location && (
                        <span className="mt-1 block text-xs font-normal text-slate-500">
                          {project.location}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-5 text-slate-700">
                      {project.client}
                    </td>
                    <td className="px-4 py-5 text-slate-700">
                      {project.mainContractor}
                    </td>
                    <td className="px-4 py-5">
                      <ScopeCell project={project} />
                    </td>
                    <td className="px-4 py-5 font-mono text-navy">
                      {project.startDate}
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`font-mono font-semibold ${
                          isProjectOngoing(project)
                            ? "text-amber"
                            : "text-navy"
                        }`}
                      >
                        {project.completionDate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-8 grid gap-4 lg:hidden">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-slate-500">
              No projects in this category yet.
            </p>
          )}

          <p className="mt-10 text-center text-sm text-slate-500">
            Need equipment for your project?{" "}
            <Link href="/#contact" className="font-semibold text-blue hover:underline">
              Contact our rental desk
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
