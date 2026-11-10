"use client";

import { Trash2 } from "lucide-react";
import { iconButtonDangerClass } from "@/components/manage/form-styles";

export function PermanentDeleteButton({
  action,
  id,
  message,
  label = "Delete",
  hidden = [],
  compact = false,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  message: string;
  label?: string;
  hidden?: { name: string; value: string }[];
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      {hidden.map((entry) => (
        <input key={entry.name} type="hidden" name={entry.name} value={entry.value} />
      ))}
      <button
        type="submit"
        aria-label={label}
        title={label}
        className={compact
          ? iconButtonDangerClass
          : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-50"}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        {compact ? <span className="sr-only">{label}</span> : label}
      </button>
    </form>
  );
}
