"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { labelClass } from "@/components/manage/form-styles";
import type { SocialLink } from "@/lib/erp/shared";

const NETWORKS = [
  "Facebook",
  "Instagram",
  "YouTube",
  "TikTok",
  "LinkedIn",
  "X",
  "Snapchat",
  "WhatsApp",
  "Telegram",
] as const;

const controlClass =
  "h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-navy outline-none focus:border-navy focus:bg-white";

function startingNetwork(label: string) {
  const match = NETWORKS.find((item) => item.toLowerCase() === label.trim().toLowerCase());
  if (match) return { network: match, custom: "" };
  if (label.trim()) return { network: "Other", custom: label.trim() };
  return { network: "", custom: "" };
}

export function SocialLinksField({ links = [] }: { links?: SocialLink[] }) {
  const [rows, setRows] = useState(() =>
    (links.length > 0 ? links : [{ label: "", url: "" }]).map((link) => ({
      id: crypto.randomUUID(),
      ...startingNetwork(link.label),
      url: link.url,
    })),
  );

  return (
    <div className="sm:col-span-2">
      <p className={labelClass}>Social</p>
      <div className="mt-1.5 space-y-2">
        {rows.map((row) => {
          const label = row.network === "Other" ? row.custom : row.network;
          return (
            <div key={row.id} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="socialLabel" value={label} />
              <select
                aria-label="Network"
                value={row.network}
                onChange={(event) => {
                  const network = event.target.value;
                  setRows((current) => current.map((item) => item.id === row.id ? { ...item, network, custom: network === "Other" ? item.custom : "" } : item));
                }}
                className={`${controlClass} w-full sm:w-36 sm:shrink-0`}
              >
                <option value="">Network</option>
                {NETWORKS.map((network) => (
                  <option key={network} value={network}>{network}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              {row.network === "Other" && (
                <input
                  aria-label="Network name"
                  value={row.custom}
                  onChange={(event) => {
                    const custom = event.target.value;
                    setRows((current) => current.map((item) => item.id === row.id ? { ...item, custom } : item));
                  }}
                  placeholder="Name"
                  className={`${controlClass} w-full sm:w-28 sm:shrink-0`}
                />
              )}
              <input
                name="socialUrl"
                defaultValue={row.url}
                aria-label="Profile link"
                placeholder="Profile link"
                className={`${controlClass} min-w-0 w-full flex-1 sm:w-auto`}
              />
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
              >
                <X className="h-4 w-4" aria-hidden />
                <span className="sr-only">Remove link</span>
              </button>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-navy hover:text-blue"
        onClick={() => setRows((current) => [...current, { id: crypto.randomUUID(), network: "", custom: "", url: "" }])}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Add link
      </button>
    </div>
  );
}
