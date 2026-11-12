import Link from "next/link";
import type { OverviewSlice } from "@/lib/erp/overview";

const COLORS = ["#f39c12", "#7eb6ff", "#1d4e89", "#f6c56b", "#8fd3c8", "#d4760a"];

export type ChartSlice = { label: string; value: number; color: string };

export function DonutChart({
  slices,
  center,
  caption,
}: {
  slices: ChartSlice[];
  center: string;
  caption: string;
}) {
  const drawn = slices.filter((slice) => slice.value > 0);
  const total = drawn.reduce((sum, slice) => sum + slice.value, 0);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0" role="img" aria-label={caption}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" className="text-white/10" strokeWidth="16" />
        {total > 0 && drawn.map((slice) => {
          const length = (slice.value / total) * circumference;
          const node = (
            <circle
              key={slice.label}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth="16"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-cursor}
              transform="rotate(-90 70 70)"
            />
          );
          cursor += length;
          return node;
        })}
        <text x="70" y="68" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="650">{center}</text>
        <text x="70" y="86" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="9" letterSpacing="0.08em">{caption.toUpperCase()}</text>
      </svg>
      <ul className="min-w-0 space-y-2">
        {drawn.length === 0 ? <li className="text-sm text-white/60">Nothing to chart yet.</li> : drawn.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2 text-sm text-white/85">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: slice.color }} />
            <span className="truncate">{slice.label}</span>
            <span className="ml-auto pl-3 font-semibold text-white">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ColumnChart({
  items,
  empty,
}: {
  items: OverviewSlice[];
  empty: string;
}) {
  const largest = Math.max(...items.map((item) => item.count), 1);
  if (items.length === 0) return <p className="py-10 text-sm text-slate-500">{empty}</p>;
  return (
    <div className="overflow-x-auto">
    <div className="flex h-56 items-end gap-3">
      {items.map((item, index) => (
        <div key={item.name} className="flex h-full w-16 shrink-0 flex-col justify-end sm:w-auto sm:min-w-0 sm:flex-1">
          <p className="mb-1 text-center text-xs font-semibold text-navy">{item.count}</p>
          <div
            className="w-full rounded-t-xl"
            style={{
              height: `${Math.max(12, (item.count / largest) * 100)}%`,
              background: COLORS[index % COLORS.length],
            }}
          />
          <p className="mt-2 line-clamp-2 h-8 text-center text-[11px] leading-4 text-slate-500">{item.name}</p>
        </div>
      ))}
    </div>
    </div>
  );
}

export function RegionChart({
  suppliers,
  clients,
}: {
  suppliers: OverviewSlice[];
  clients: OverviewSlice[];
}) {
  const names = [...new Set([...suppliers.map((item) => item.name), ...clients.map((item) => item.name)])].slice(0, 6);
  const supplierCount = new Map(suppliers.map((item) => [item.name, item.count]));
  const clientCount = new Map(clients.map((item) => [item.name, item.count]));
  const largest = Math.max(
    ...names.flatMap((name) => [supplierCount.get(name) ?? 0, clientCount.get(name) ?? 0]),
    1,
  );
  if (names.length === 0) return <p className="py-8 text-sm text-slate-500">No regions yet.</p>;
  return (
    <div>
      <div className="mb-4 flex gap-4 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-navy" /> Suppliers</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber" /> Clients</span>
      </div>
      <ul className="space-y-3">
        {names.map((name) => {
          const supplierValue = supplierCount.get(name) ?? 0;
          const clientValue = clientCount.get(name) ?? 0;
          return (
            <li key={name}>
              <p className="mb-1 text-xs font-semibold text-navy">{name}</p>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-navy" style={{ width: `${(supplierValue / largest) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-xs font-semibold text-navy">{supplierValue}</span>
              </div>
              <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-2">
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber" style={{ width: `${(clientValue / largest) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-xs font-semibold text-navy">{clientValue}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function MiniRing({
  href,
  label,
  value,
  total,
  note,
  color,
}: {
  href: string;
  label: string;
  value: number;
  total: number;
  note: string;
  color: string;
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const share = total > 0 ? Math.min(value / total, 1) : 0;
  const length = share * circumference;
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10 transition hover:bg-white/15">
      <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0" aria-hidden>
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${length} ${circumference - length}`}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
      </svg>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-white/55">{label}</span>
        <span className="block text-xl font-semibold leading-tight text-white">{value}</span>
        <span className="block truncate text-[11px] text-white/55">{note}</span>
      </span>
    </Link>
  );
}
