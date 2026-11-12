"use client";

import { useState } from "react";
import { labelClass } from "@/components/manage/form-styles";
import { EMIRATES } from "@/lib/erp/shared";

export function EmiratesField({ defaultValue = [] }: { defaultValue?: string[] }) {
  const [picked, setPicked] = useState(() => new Set(defaultValue));
  const allSelected = EMIRATES.every((emirate) => picked.has(emirate));

  function toggleAll() {
    setPicked(allSelected ? new Set() : new Set(EMIRATES));
  }

  function toggle(emirate: string) {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(emirate)) next.delete(emirate);
      else next.add(emirate);
      return next;
    });
  }

  return (
    <fieldset className="sm:col-span-2">
      <legend className={labelClass}>Regions</legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="col-span-2 flex items-center gap-2 rounded-lg border border-navy/20 bg-navy/5 px-3 py-2 text-sm font-semibold text-navy sm:col-span-4">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          All regions
        </label>
        {EMIRATES.map((emirate) => (
          <label key={emirate} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-navy">
            <input
              type="checkbox"
              name="emirates"
              value={emirate}
              checked={picked.has(emirate)}
              onChange={() => toggle(emirate)}
            />
            {emirate}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
