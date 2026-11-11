"use client";

import { Trash2 } from "lucide-react";

export function PermanentDeleteButton({
  action,
  id,
  message,
  label = "Delete",
  hidden = [],
  compact = false,
  className = "",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  message: string;
  label?: string;
  hidden?: { name: string; value: string }[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <form
      className="inline-flex"
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
          ? `inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 ${className}`
          : `inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 ${className}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        {compact ? <span className="sr-only">{label}</span> : label}
      </button>
    </form>
  );
}
