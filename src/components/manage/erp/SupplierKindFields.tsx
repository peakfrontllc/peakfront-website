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
          {TYPES.map((item) => (
            <label key={item.value} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 ${type === item.value ? "border-navy bg-slate-50" : "border-slate-200 bg-white"}`}>
              <input
                type="radio"
                name="partyType"
                value={item.value}
                checked={type === item.value}
                onChange={() => setType(item.value)}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-semibold text-navy">{item.title}</span>
                <span className="block text-xs text-slate-500">{item.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="companyName">{type === "individual" ? "Name" : "Company"}</label>
        <input id="companyName" name="companyName" required defaultValue={defaultName} className={fieldClass} />
      </div>
    </>
  );
}
