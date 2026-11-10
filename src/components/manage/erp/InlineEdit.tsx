"use client";

import { Pencil } from "lucide-react";
import { useState, type ReactNode } from "react";

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
      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        {children}
        <button type="button" onClick={() => setEditing(false)} className="mt-3 text-xs font-semibold text-slate-500">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-start justify-between gap-3 text-sm">
      <div className="min-w-0">{summary}</div>
      <div className="flex shrink-0 items-center gap-3">
        <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue">
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Edit
        </button>
        {actions}
      </div>
    </div>
  );
}
