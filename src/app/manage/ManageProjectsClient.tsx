"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import Link from "next/link";
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
  blobEnabled,
  onCancel,
  onSaved,
}: {
  project?: Project;
  blobEnabled: boolean;
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

    try {
      if (blobEnabled) {
        const files = formData
          .getAll("images")
          .filter((entry): entry is File => entry instanceof File && entry.size > 0);
        formData.delete("images");

        for (const file of files) {
          const blob = await upload(`projects/images/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/projects/blob",
          });
          formData.append("imageUrls", blob.url);
        }
      }

      const response = await fetch(path, {
        method,
        body: formData,
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
      className="border border-navy/10 bg-white p-6 sm:p-10"
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
                : "You can select multiple photos."}
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
  blobEnabled,
}: {
  projects: Project[];
  blobEnabled: boolean;
}) {
  const [items, setItems] = useState(projects);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

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

  if (mode === "add" || (mode === "edit" && editingProject)) {
    return (
      <ProjectForm
        key={editingProject?.id ?? "new"}
        project={editingProject}
        blobEnabled={blobEnabled}
        onCancel={() => {
          setMode("list");
          setEditingId(null);
        }}
        onSaved={showList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {items.length === 0
            ? "No projects yet."
            : `${items.length} project${items.length === 1 ? "" : "s"}`}
        </p>
        <button
          type="button"
          onClick={() => {
            setError("");
            setEditingId(null);
            setMode("add");
          }}
          className="cursor-pointer bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue"
        >
          Add project
        </button>
      </div>

      {error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {items.map((project) => (
          <article
            key={project.id}
            className="flex flex-col gap-4 border border-navy/10 bg-white p-4 sm:flex-row sm:items-center"
          >
            {project.images[0] ? (
              <div className="relative h-24 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-20 sm:w-28">
                <Image
                  src={project.images[0].src}
                  alt={project.images[0].alt}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-full shrink-0 items-center justify-center bg-slate-100 font-mono text-[10px] uppercase tracking-widest text-slate-400 sm:h-20 sm:w-28">
                No photo
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold text-navy">
                {project.projectName}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{project.client}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                {project.status} · {project.images.length} photo
                {project.images.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setEditingId(project.id);
                  setMode("edit");
                }}
                className="cursor-pointer border border-navy/15 px-4 py-2 text-sm font-bold text-navy hover:border-amber"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={busyId === project.id}
                onClick={() => handleDelete(project)}
                className="cursor-pointer border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {busyId === project.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {items.length > 0 && (
        <p className="text-center text-sm text-slate-500">
          Public list:{" "}
          <Link href="/our-project" className="font-semibold text-blue hover:underline">
            Our Projects
          </Link>
        </p>
      )}
    </div>
  );
}
