import Link from "next/link";
import { LayoutGrid, List, Table2 } from "lucide-react";
import { CataloguePhoto } from "@/components/manage/erp/CataloguePhoto";
import { SupplierEquipmentEditor } from "@/components/manage/erp/SupplierEquipmentEditor";
import type { RateRow } from "@/lib/erp/suppliers";
import { formatMoney } from "@/lib/erp/shared";

export const SUPPLIER_EQUIPMENT_VIEWS = ["cards", "list", "table"] as const;
export type SupplierEquipmentView = (typeof SUPPLIER_EQUIPMENT_VIEWS)[number];

export function supplierEquipmentView(value: string | undefined): SupplierEquipmentView {
  return value === "list" || value === "table" ? value : "cards";
}

export type SupplierEquipmentItem = {
  id: string;
  equipmentId: string;
  name: string;
  group: string;
  detail: string;
  typeName: string;
  leadTime: string;
  notes: string;
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
  rates: RateRow[];
};

function EquipmentFacts({ item }: { item: { group: string; detail: string } }) {
  if (!item.group && !item.detail) return null;
  return (
    <p className="text-xs text-slate-500">
      {item.group}
      {item.group && item.detail ? " · " : ""}
      {item.detail && <span className="font-medium text-navy">{item.detail}</span>}
    </p>
  );
}

function DetailsLink({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/equipment/${id}`} className="inline-flex h-7 shrink-0 items-center rounded-md bg-navy px-2.5 text-[11px] font-semibold text-white hover:bg-blue">
      View more details
    </Link>
  );
}

export function SupplierEquipmentViewSwitch({
  view,
  hrefFor,
}: {
  view: SupplierEquipmentView;
  hrefFor: (view: SupplierEquipmentView) => string;
}) {
  const views = [
    { id: "cards" as const, label: "Cards", icon: LayoutGrid },
    { id: "list" as const, label: "List", icon: List },
    { id: "table" as const, label: "Table", icon: Table2 },
  ];
  return (
    <div className="flex shrink-0 rounded-lg bg-white/10 p-0.5">
      {views.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <Link
            key={item.id}
            href={hrefFor(item.id)}
            aria-label={`${item.label} view`}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold ${active ? "bg-white text-navy" : "text-white/75 hover:text-white"}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function SupplierEquipmentCatalogue({
  items,
  view,
  supplierId,
  canWrite,
  canRates,
}: {
  items: SupplierEquipmentItem[];
  view: SupplierEquipmentView;
  supplierId: string;
  canWrite: boolean;
  canRates: boolean;
}) {
  if (items.length === 0) {
    return <p className="bg-white px-4 py-8 text-sm text-slate-500">No equipment matches this search.</p>;
  }
  if (view === "table") {
    return (
      <div className="overflow-x-auto bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Equipment</th>
              <th className="px-4 py-3 font-semibold">Lead time</th>
              <th className="px-4 py-3 font-semibold">Day</th>
              <th className="px-4 py-3 font-semibold">Week</th>
              <th className="px-4 py-3 font-semibold">Month</th>
              <th className="px-4 py-3 font-semibold"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 align-top transition last:border-0 hover:bg-amber/15">
                <td className="px-4 py-3">
                  <p className="font-semibold text-navy">{item.name}</p>
                  <EquipmentFacts item={item} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{item.leadTime || "—"}</td>
                <td className="px-4 py-3 text-xs font-semibold text-navy">{formatMoney(item.daily)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-navy">{formatMoney(item.weekly)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-navy">{formatMoney(item.monthly)}</td>
                <td className="px-4 py-3 text-right"><DetailsLink id={item.equipmentId} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (view === "list") {
    return (
      <ul className="divide-y divide-slate-100 bg-white">
        {items.map((item) => (
          <li key={item.id} className="px-3 py-2 transition hover:bg-amber/15">
            <div className="flex items-center gap-2">
              <CataloguePhoto name={item.typeName} small />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{item.name}</p>
                <EquipmentFacts item={item} />
              </div>
              <DetailsLink id={item.equipmentId} />
            </div>
            <SupplierEquipmentEditor item={item} supplierId={supplierId} canWrite={canWrite} canRates={canRates} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-3 bg-[#eef2f6] p-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <article className="rounded-2xl border border-navy/10 bg-white p-3 transition hover:border-amber hover:bg-amber/15">
            <div className="flex items-center gap-2">
              <CataloguePhoto name={item.typeName} small />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{item.name}</p>
                <EquipmentFacts item={item} />
              </div>
              <DetailsLink id={item.equipmentId} />
            </div>
            <SupplierEquipmentEditor item={item} supplierId={supplierId} canWrite={canWrite} canRates={canRates} />
          </article>
        </li>
      ))}
    </ul>
  );
}
