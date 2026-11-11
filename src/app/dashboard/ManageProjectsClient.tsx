"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Pencil, Search, Table2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";

const fieldClass =
  "mt-2 w-full border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-blue";

const labelClass =
  "font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-navy";

function imageFilename(src: string): string {
  const path = src.split("?")[0] ?? src;
  try {
    return decodeURIComponent(path.split("/").pop() ?? src);
  } catch {
    return path.split("/").pop() ?? src;
  }
}

function fetchErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  if (message === "Failed to fetch") {
    return "Could not reach the server. Check the site is running, then try again.";
  }
  return message;
}

function ProjectForm({
  project,
  onCancel,
  onSaved,
}: {
  project?: Project;
  onCancel: () => void;
  onSaved: (projects?: Project[]) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fileCount, setFileCount] = useState(0);
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const [status, setStatus] = useState(project?.status ?? "completed");
  const completionRequired = status === "completed";
  const defaultCompletion =
    (project?.completionDate ?? "").trim().toLowerCase() === "running"
      ? ""
      : project?.completionDate;

  const existingPhotos = useMemo(
    () =>
      (project?.images ?? []).filter(
        (image) => !removedFiles.includes(imageFilename(image.src)),
      ),
    [project, removedFiles],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    setError("");
    setSubmitting(true);

    const path = project ? `/api/projects/${project.id}` : "/api/projects";
    const method = project ? "PUT" : "POST";
    const formData = new FormData(form);
    const selected = formData.getAll("images").filter(
      (value): value is File => value instanceof File && value.size > 0,
    );
    const oversized = selected.find((file) => file.size > 3.5 * 1024 * 1024);
    if (oversized) {
      setError("Each photo must be 3.5 MB or smaller.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(path, {
        method,
        body: formData,
        credentials: "same-origin",
      });
      const data = (await response.json()) as {
        error?: string;
        id?: string;
        projects?: Project[];
      };

      if (!response.ok || !data.id) {
        throw new Error(data.error ?? "Could not save the project.");
      }

      onSaved(Array.isArray(data.projects) ? data.projects : undefined);
    } catch (err) {
      setError(fetchErrorMessage(err, "Could not save the project."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-navy">
          {project ? "Edit project" : "Add project"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 hover:text-navy"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="projectName" className={labelClass}>
            Project Name
          </label>
          <input
            id="projectName"
            name="projectName"
            required
            defaultValue={project?.projectName}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="client" className={labelClass}>
            Client
          </label>
          <input
            id="client"
            name="client"
            required
            defaultValue={project?.client}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="mainContractor" className={labelClass}>
            Main Contractor
          </label>
          <input
            id="mainContractor"
            name="mainContractor"
            required
            defaultValue={project?.mainContractor}
            className={fieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="scopeOfWork" className={labelClass}>
            Scope of Work
          </label>
          <textarea
            id="scopeOfWork"
            name="scopeOfWork"
            required
            rows={4}
            defaultValue={project?.scopeOfWork}
            className={fieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="equipment" className={labelClass}>
            Equipment Supplied
          </label>
          <textarea
            id="equipment"
            name="equipment"
            rows={3}
            placeholder="One item per line"
            defaultValue={project?.equipment.join("\n")}
            className={fieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            name="location"
            defaultValue={project?.location}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="startDate" className={labelClass}>
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            required
            placeholder="18-Aug-26"
            defaultValue={project?.startDate}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="completionDate" className={labelClass}>
            Completion
          </label>
          <input
            id="completionDate"
            name="completionDate"
            required={completionRequired}
            placeholder={
              completionRequired
                ? "18-Aug-26"
                : "Leave blank if still running"
            }
            defaultValue={defaultCompletion}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value === "ongoing" ? "ongoing" : "completed")
            }
            className={fieldClass}
          >
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
        <div>
          <label htmlFor="images" className={labelClass}>
            {project ? "Add photos" : "Photos"}
          </label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setFileCount(event.target.files?.length ?? 0)}
            className={`${fieldClass} cursor-pointer file:mr-3 file:border-0 file:bg-navy file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:text-white`}
          />
          <p className="mt-2 text-xs text-slate-500">
            {fileCount > 0
              ? `${fileCount} new photo${fileCount === 1 ? "" : "s"} selected`
              : project
                ? "New photos are added to the existing gallery."
                : "You can select multiple photos."}{" "}
            Keep each photo under 3.5 MB.
          </p>
        </div>
      </div>

      {project && (
        <div className="mt-8">
          {existingPhotos.length > 0 && (
            <>
              <p className={labelClass}>Current photos</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {existingPhotos.map((image) => {
                  const filename = imageFilename(image.src);
                  return (
                    <div
                      key={image.src}
                      className="relative h-24 w-32 overflow-hidden border border-navy/10 bg-slate-100"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setRemovedFiles((current) => [...current, filename])
                        }
                        className="absolute right-1 top-1 cursor-pointer bg-navy/80 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white hover:bg-navy"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {removedFiles.map((filename) => (
            <input
              key={filename}
              type="hidden"
              name="removeImages"
              value={filename}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full cursor-pointer bg-navy px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting
          ? "Saving…"
          : project
            ? "Save changes"
            : "Add project"}
      </button>
    </form>
  );
}

export default function ManageProjectsClient({
  projects,
  canWrite = false,
}: {
  projects: Project[];
  canWrite?: boolean;
}) {
  const [items, setItems] = useState(projects);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<"cards" | "list" | "table">("cards");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | Project["status"]>("");
  const visible = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((project) => {
      if (status && project.status !== status) return false;
      if (tokens.length === 0) return true;
      const haystack = [project.projectName, project.client, project.mainContractor, project.location ?? "", project.scopeOfWork, ...project.equipment].join(" ").toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [items, query, status]);

  const editingProject = items.find((project) => project.id === editingId);

  function showList(nextProjects?: Project[]) {
    if (nextProjects !== undefined) setItems(nextProjects);
    setMode("list");
    setEditingId(null);
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete “${project.projectName}” and its photos? This cannot be undone.`,
    );
    if (!confirmed) return;

    setError("");
    setBusyId(project.id);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = (await response.json()) as {
        error?: string;
        projects?: Project[];
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete the project.");
      }
      showList(data.projects);
    } catch (err) {
      setError(fetchErrorMessage(err, "Could not delete the project."));
    } finally {
      setBusyId(null);
    }
  }

  if (canWrite && (mode === "add" || (mode === "edit" && editingProject))) {
    return (
      <ProjectForm
        key={editingProject?.id ?? "new"}
        project={editingProject}
        onCancel={() => {
          setMode("list");
          setEditingId(null);
        }}
        onSaved={showList}
      />
    );
  }

  function editProject(project: Project) {
    setError("");
    setEditingId(project.id);
    setMode("edit");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
      <div className="flex flex-col gap-3 bg-navy px-4 py-3 xl:flex-row xl:items-center">
        <p className="shrink-0 text-sm text-white/80">
          <span className="font-semibold text-white">{visible.length}</span>{" "}
          {visible.length === 1 ? "project" : "projects"}
        </p>
        <div className="flex shrink-0 rounded-lg bg-white/10 p-0.5">
          {([
            ["cards", "Cards", LayoutGrid],
            ["list", "List", List],
            ["table", "Table", Table2],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold ${view === id ? "bg-white text-navy" : "text-white/75 hover:text-white"}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(8rem,1fr)_9rem]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search projects" className="h-9 w-full rounded-lg border border-white/70 bg-white pl-9 pr-3 text-sm text-navy outline-none focus:border-amber" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as "" | Project["status"])} aria-label="Status" className="h-9 rounded-lg border border-white/70 bg-white px-3 text-sm text-navy outline-none focus:border-amber">
            <option value="">All statuses</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={() => {
              setError("");
              setEditingId(null);
              setMode("add");
            }}
            className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber/90"
          >
            Add project
          </button>
        )}
      </div>
      {error && <p className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {visible.length === 0 ? (
        <p className="bg-white px-4 py-8 text-sm text-slate-500">{items.length === 0 ? "No projects yet." : "No projects match this search."}</p>
      ) : view === "table" ? (
        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Photos</th>
                {canWrite && <th className="px-4 py-3"><span className="sr-only">Actions</span></th>}
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr key={project.id} className="border-b border-slate-100 transition last:border-0 hover:bg-amber/15">
                  <td className="px-4 py-3 font-semibold text-navy">{project.projectName}</td>
                  <td className="px-4 py-3 text-slate-600">{project.client || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{project.location || "—"}</td>
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{project.status}</td>
                  <td className="px-4 py-3 text-slate-600">{project.images.length}</td>
                  {canWrite && (
                    <td className="px-4 py-3 text-right">
                      <ProjectActions project={project} busy={busyId === project.id} onEdit={() => editProject(project)} onDelete={() => handleDelete(project)} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : view === "list" ? (
        <ul className="divide-y divide-slate-200 bg-white">
          {visible.map((project) => (
            <li key={project.id} className="flex flex-col gap-3 px-4 py-3 transition hover:bg-amber/15 lg:flex-row lg:items-center">
              <ProjectPhoto project={project} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{project.projectName}</p>
                <p className="text-xs text-slate-500">{[project.client, project.location, project.status].filter(Boolean).join(" · ")}</p>
              </div>
              {canWrite && <ProjectActions project={project} busy={busyId === project.id} onEdit={() => editProject(project)} onDelete={() => handleDelete(project)} />}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid gap-3 bg-[#eef2f6] p-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <li key={project.id}>
              <article className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-3 transition hover:border-amber hover:bg-amber/15">
                <ProjectPhoto project={project} wide />
                <p className="mt-3 truncate text-sm font-semibold text-navy">{project.projectName}</p>
                <p className="mt-1 text-xs text-slate-500">{project.client || "No client"}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">{[project.status, project.location].filter(Boolean).join(" · ")}</p>
                {project.equipment.length > 0 && <p className="mt-2 line-clamp-2 text-xs text-navy">{project.equipment.join(" · ")}</p>}
                {canWrite && (
                  <div className="mt-3">
                    <ProjectActions project={project} busy={busyId === project.id} onEdit={() => editProject(project)} onDelete={() => handleDelete(project)} />
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
      <p className="border-t border-slate-200 bg-white px-4 py-3 text-center text-sm text-slate-500">
        Public list: <Link href="/our-project" className="font-semibold text-navy hover:text-blue">Our Projects</Link>
      </p>
    </div>
  );
}

function ProjectPhoto({ project, wide = false }: { project: Project; wide?: boolean }) {
  if (!project.images[0]) {
    return <div className={`${wide ? "h-28 w-full" : "h-14 w-20"} flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-400`}>No photo</div>;
  }
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-slate-100 ${wide ? "h-28 w-full" : "h-14 w-20"}`}>
      <Image src={project.images[0].src} alt={project.images[0].alt} fill sizes={wide ? "320px" : "80px"} className="object-cover" />
    </div>
  );
}

function ProjectActions({
  busy,
  onEdit,
  onDelete,
}: {
  project: Project;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      <button type="button" onClick={onEdit} className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-navy/15 bg-white px-2.5 text-[11px] font-semibold text-navy hover:border-amber hover:bg-amber/10">
        <Pencil className="h-3.5 w-3.5" aria-hidden />
        Edit
      </button>
      <button type="button" disabled={busy} onClick={onDelete} className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 text-[11px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        {busy ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
