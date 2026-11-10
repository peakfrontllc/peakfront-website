"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { fieldClass, labelClass } from "@/components/manage/form-styles";

export function ExtraFields() {
  const [rows, setRows] = useState<string[]>([]);

  return (
    <div className="sm:col-span-2 rounded-lg border border-dashed border-slate-300 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy">Extra fields</p>
          <p className="mt-0.5 text-xs text-slate-500">Add any detail this form does not already ask for.</p>
        </div>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm hover:bg-slate-50"
          onClick={() => setRows((current) => [...current, crypto.randomUUID()])}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add field
        </button>
      </div>
      {rows.map((id) => (
        <div key={id} className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label className={labelClass} htmlFor={`${id}-label`}>Field name</label>
            <input id={`${id}-label`} name="fieldLabel" className={fieldClass} placeholder="Platform height" />
          </div>
          <div>
            <label className={labelClass} htmlFor={`${id}-value`}>Value</label>
            <input id={`${id}-value`} name="fieldValue" className={fieldClass} placeholder="45 m" />
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            onClick={() => setRows((current) => current.filter((row) => row !== id))}
          >
            <X className="h-4 w-4" aria-hidden />
            <span className="sr-only">Remove field</span>
          </button>
        </div>
      ))}
    </div>
  );
}
