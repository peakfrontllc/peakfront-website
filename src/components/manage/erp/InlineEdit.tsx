"use client";

import { Pencil } from "lucide-react";
import { useState, type ReactNode } from "react";

const editButtonClass =
  "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-md border border-navy/15 bg-white px-2.5 text-[11px] font-semibold text-navy hover:border-amber hover:bg-amber/10";
const cancelButtonClass =
  "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md border border-slate-300 bg-white px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50";

export function InlineEdit({
  summary,
  children,
  actions,
}: {
  summary: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="mb-4 rounded-lg border border-navy/10 bg-[#f4f7fa] p-3">
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={() => setEditing(false)} className={cancelButtonClass}>
            Cancel
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-start justify-between gap-3 text-sm">
      <div className="min-w-0">{summary}</div>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={() => setEditing(true)} className={editButtonClass}>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Edit
        </button>
        {actions}
      </div>
    </div>
  );
}
