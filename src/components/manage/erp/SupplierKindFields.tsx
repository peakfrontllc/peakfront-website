"use client";

import { useState } from "react";
import { fieldClass, labelClass } from "@/components/manage/form-styles";

const TYPES = [
  { value: "individual", title: "Individual", detail: "Owns their own transport" },
  { value: "company", title: "Company", detail: "Belongs to a company" },
] as const;

export function SupplierKindFields({
  defaultType = "company",
  defaultName = "",
}: {
  defaultType?: "individual" | "company";
  defaultName?: string;
}) {
  const [type, setType] = useState<"individual" | "company">(defaultType === "individual" ? "individual" : "company");

  return (
    <>
      <fieldset className="sm:col-span-2">
        <legend className={labelClass}>Supplier type</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {TYPES.map((item) => {
            const selected = type === item.value;
            return (
              <label key={item.value} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${selected ? "border-navy bg-white shadow-sm ring-1 ring-navy" : "border-slate-200 bg-slate-50/70 hover:border-slate-300"}`}>
                <input
                  type="radio"
                  name="partyType"
                  value={item.value}
                  checked={selected}
                  onChange={() => setType(item.value)}
                  className="sr-only"
                />
                <span>
                  <span className="block text-sm font-semibold text-navy">{item.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span>
                </span>
                <span className={`h-4 w-4 shrink-0 rounded-full border ${selected ? "border-navy bg-navy shadow-[inset_0_0_0_3px_white]" : "border-slate-300 bg-white"}`} aria-hidden />
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="companyName">{type === "individual" ? "Name" : "Company"}</label>
        <input id="companyName" name="companyName" required defaultValue={defaultName} className={fieldClass} />
      </div>
    </>
  );
}
