"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProjectPhotos from "@/components/ProjectPhotos";
import {
  isProjectOngoing,
  projectStatusLabels,
  type Project,
} from "@/lib/projects";

type Filter = "all" | "ongoing" | "completed";

const PAGE_SIZE = 30;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

function StatusBadge({ project }: { project: Project }) {
  const ongoing = isProjectOngoing(project);

  return (
    <span
      className={`inline-block whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 ${
        ongoing ? "bg-amber text-navy" : "bg-navy text-white"
      }`}
    >
      {ongoing ? projectStatusLabels.ongoing : projectStatusLabels.completed}
    </span>
  );
}

function completionLabel(project: Project) {
  const value = (project.completionDate ?? "").trim();
  if (!value || value.toLowerCase() === "running") return "—";
  return value;
}

function ScopeCell({ project }: { project: Project }) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed break-words text-slate-600">
        {project.scopeOfWork}
      </p>
      {project.equipment.length > 0 && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue">
            Equipment Supplied
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.equipment.map((item, index) => (
              <li
                key={`${item}-${index}`}
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
  return (
    <article className="overflow-hidden border border-navy/10 bg-white">
      {project.images.length > 0 && (
        <ProjectPhotos
          images={project.images}
          projectName={project.projectName}
          variant="card"
        />
      )}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <h3 className="min-w-0 text-[15px] font-bold leading-snug break-words text-navy sm:flex-1 sm:text-base">
            {project.projectName}
          </h3>
          <div className="shrink-0">
            <StatusBadge project={project} />
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Client
            </dt>
            <dd className="mt-0.5 font-medium break-words text-navy">
              {project.client}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Main Contractor
            </dt>
            <dd className="mt-0.5 font-medium break-words text-navy">
              {project.mainContractor}
            </dd>
          </div>
          {project.location && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Location
              </dt>
              <dd className="mt-0.5 font-medium break-words text-navy">
                {project.location}
              </dd>
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
                {completionLabel(project)}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <ScopeCell project={project} />
        </div>
      </div>
    </article>
  );
}

function pageItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const unique = new Set<number>([1, total, current]);
  if (current - 1 > 1) unique.add(current - 1);
  if (current + 1 < total) unique.add(current + 1);

  const sorted = [...unique].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const value = sorted[index];
    const previous = sorted[index - 1];
    if (index > 0 && previous !== undefined && value - previous > 1) {
      items.push("ellipsis");
    }
    items.push(value);
  }

  return items;
}

function Pagination({
  page,
  pageCount,
  total,
  onChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex w-full items-center justify-center gap-1.5 sm:w-auto">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-navy/15 bg-white text-navy transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[7.5rem] text-center font-mono text-[10px] font-bold uppercase tracking-widest text-navy sm:hidden">
          Page {page} of {pageCount}
        </span>
        <div className="hidden items-center gap-1.5 sm:flex">
          {pageItems(page, pageCount).map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 font-mono text-xs text-slate-400"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                className={`min-h-11 min-w-11 cursor-pointer border font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  item === page
                    ? "border-navy bg-navy text-white"
                    : "border-navy/15 bg-white text-navy hover:border-amber"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === pageCount}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-navy/15 bg-white text-navy transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsPageClient({
  projects,
}: {
  projects: Project[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    if (filter === "ongoing") return projects.filter(isProjectOngoing);
    return projects.filter((project) => !isProjectOngoing(project));
  }, [filter, projects]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  function changeFilter(value: Filter) {
    setFilter(value);
    setPage(1);
  }

  function changePage(next: number) {
    const clamped = Math.min(pageCount, Math.max(1, next));
    if (clamped === page) return;
    setPage(clamped);
    document.getElementById("project-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <section className="bg-navy px-4 pt-24 pb-10 text-white sm:px-5 sm:pt-32 sm:pb-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue sm:text-xs">
              Our Projects
            </span>
          </div>
          <h1 className="max-w-3xl text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Projects executed by Peakfront across the UAE
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-5 sm:text-base">
            Equipment rental and mobilisation delivered for contractors,
            developers and government projects — current and completed contracts.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-10 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2
              id="project-list"
              className="text-xl font-bold text-navy sm:text-2xl"
            >
              List of Projects
            </h2>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeFilter(value)}
                  className={`min-h-11 flex-1 border px-2 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors sm:flex-none sm:px-4 sm:text-[10px] sm:tracking-[0.14em] ${
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

          {filtered.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="mt-8 hidden overflow-x-auto border border-navy/10 bg-white lg:block">
            <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-navy/10 bg-navy text-white">
                  <th className="w-40 px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Photos
                  </th>
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
                  <th className="px-4 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((project, index) => (
                  <tr
                    key={project.id}
                    className={`border-b border-navy/10 align-top ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/80"
                    }`}
                  >
                    <td className="px-4 py-5">
                      <ProjectPhotos
                        images={project.images}
                        projectName={project.projectName}
                        variant="table"
                      />
                    </td>
                    <td className="px-4 py-5 font-semibold break-words text-navy">
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
                    <td className="px-4 py-5 font-mono text-navy">
                      {completionLabel(project)}
                    </td>
                    <td className="px-4 py-5">
                      <StatusBadge project={project} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 grid gap-4 lg:hidden">
            {paged.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
            </>
          )}

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-slate-500">
              No projects in this category yet.
            </p>
          )}

          <Pagination
            page={currentPage}
            pageCount={pageCount}
            total={filtered.length}
            onChange={changePage}
          />

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
