"use client";

import type { ReactNode } from "react";

export function EquipmentFilterSelect({
  name,
  label,
  value,
  className,
  children,
}: {
  name: string;
  label: string;
  value: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={value}
      aria-label={label}
      className={className}
      onChange={(event) => {
        const query = event.currentTarget.form?.elements.namedItem("q");
        if (event.target.value && query instanceof HTMLInputElement) query.value = "";
      }}
    >
      {children}
    </select>
  );
}
