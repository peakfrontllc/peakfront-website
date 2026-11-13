"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { fieldClass, labelClass } from "@/components/manage/form-styles";

export function ExtraFields({
  heading = true,
  initial = [],
}: {
  heading?: boolean;
  initial?: { label: string; value: string }[];
}) {
  const [rows, setRows] = useState<{ id: string; label: string; value: string }[]>(() =>
    initial.map((row) => ({ id: crypto.randomUUID(), label: row.label, value: row.value })),
  );

  return (
    <div className="sm:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {heading && <p className="text-sm font-semibold text-navy">Extra fields</p>}
          <p className={`text-xs text-slate-500 ${heading ? "mt-0.5" : ""}`}>Add any detail this form does not already ask for.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onClick={() => setRows((current) => [...current, { id: crypto.randomUUID(), label: "", value: "" }])}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add field
        </button>
      </div>
      {rows.map((row) => (
        <div key={row.id} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label className={labelClass} htmlFor={`${row.id}-label`}>Field name</label>
            <input id={`${row.id}-label`} name="fieldLabel" defaultValue={row.label} className={fieldClass} placeholder="Platform height" />
          </div>
          <div>
            <label className={labelClass} htmlFor={`${row.id}-value`}>Value</label>
            <input id={`${row.id}-value`} name="fieldValue" defaultValue={row.value} className={fieldClass} placeholder="45 m" />
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
            onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
          >
            <X className="h-4 w-4" aria-hidden />
            <span className="sr-only">Remove field</span>
          </button>
        </div>
      ))}
    </div>
  );
}
