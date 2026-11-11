import Link from "next/link";
import { LayoutGrid, List, Table2 } from "lucide-react";
import { CataloguePhoto } from "@/components/manage/erp/CataloguePhoto";
import type { EquipmentListItem } from "@/lib/erp/equipment";
import { capacityLabel, measureNote } from "@/lib/erp/lengths";
import { ownershipLabel } from "@/lib/erp/shared";

export const EQUIPMENT_VIEWS = ["cards", "list", "table"] as const;
export type EquipmentView = (typeof EQUIPMENT_VIEWS)[number];

export function equipmentView(value: string | undefined): EquipmentView {
  return value === "list" || value === "table" ? value : "cards";
}

function machineFacts(item: EquipmentListItem) {
  const equipmentName = item.typeName || item.name;
  const alias = [item.name, item.code]
    .filter((part, index, all) => Boolean(part) && part.toLowerCase() !== equipmentName.toLowerCase() && part.toLowerCase() !== item.sizeName.toLowerCase() && all.findIndex((entry) => entry.toLowerCase() === part.toLowerCase()) === index)
    .join(" · ");
  const raw = item.sizeName && item.sizeName.toLowerCase() !== equipmentName.toLowerCase()
    ? item.sizeName
    : item.capacity && item.capacity.toLowerCase() !== equipmentName.toLowerCase()
      ? item.capacity
      : "";
  const capacity = capacityLabel(raw);
  const lengthNote = measureNote(item.boomLength, item.bedLength, raw);
  return { equipmentName, alias, capacity, lengthNote };
}

function statusClass(status: string) {
  if (status === "available") return "bg-emerald-50 text-emerald-700";
  if (status === "maintenance") return "bg-amber/15 text-amber-800";
  return "bg-sky-50 text-sky-700";
}

function SupplierLine({ item }: { item: EquipmentListItem }) {
  const [first, ...rest] = item.suppliers;
  if (!first) return <span className="text-slate-500">No supplier linked</span>;
  return (
    <>
      <Link href={`/dashboard/suppliers/${first.id}`} className="font-semibold text-blue hover:underline">{first.name}</Link>
      {rest.length > 0 && (
        <>
          {" · "}
          <Link href={`/dashboard/equipment/${item.id}/suppliers`} className="font-semibold text-navy hover:text-blue">View more suppliers</Link>
        </>
      )}
    </>
  );
}

function SupplierPreview({ item }: { item: EquipmentListItem }) {
  const [first, ...rest] = item.suppliers;
  if (!first) return <p className="mt-1 text-sm text-slate-500">None linked</p>;
  return (
    <div className="mt-1">
      <SupplierFacts supplier={first} />
      {rest.length > 0 && (
        <Link href={`/dashboard/equipment/${item.id}/suppliers`} className="mt-2 inline-block text-xs font-semibold text-navy hover:text-blue">
          View more suppliers
        </Link>
      )}
    </div>
  );
}

function SupplierFacts({ supplier }: { supplier: EquipmentListItem["suppliers"][number] }) {
  const showOwner = supplier.ownerName && supplier.ownerName.toLowerCase() !== supplier.name.toLowerCase();
  const place = [supplier.phone, supplier.emirate].filter(Boolean).join(" · ");
  return (
    <div>
      <Link href={`/dashboard/suppliers/${supplier.id}`} className="text-sm font-semibold text-blue hover:underline">{supplier.name}</Link>
      <p className="text-[11px] text-slate-400">{supplier.partyType === "individual" ? "Individual" : "Company"}</p>
      {showOwner && <p className="text-xs text-navy">{supplier.contactTitle && <span className="text-slate-400">{supplier.contactTitle} </span>}{supplier.ownerName}</p>}
      {place && <p className="text-xs text-slate-500">{place}</p>}
      {supplier.email && <p className="break-all text-xs text-slate-500">{supplier.email}</p>}
      {supplier.leadTime && <p className="text-xs text-slate-500">Lead time {supplier.leadTime}</p>}
    </div>
  );
}

function Pills({ item, capacity, lengthNote }: { item: EquipmentListItem; capacity: string; lengthNote: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {capacity && <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-medium text-navy">{capacity}</span>}
      {lengthNote && <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800">{lengthNote}</span>}
      <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-medium text-amber-800">{ownershipLabel(item.ownership)}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusClass(item.status)}`}>{item.status}</span>
    </div>
  );
}

export function EquipmentViewSwitch({
  view,
  hrefFor,
}: {
  view: EquipmentView;
  hrefFor: (view: EquipmentView) => string;
}) {
  const views = [
    { id: "cards" as const, label: "Cards", icon: LayoutGrid },
    { id: "list" as const, label: "List", icon: List },
    { id: "table" as const, label: "Table", icon: Table2 },
  ];
  return (
    <div className="flex rounded-lg bg-white/10 p-0.5">
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

export function EquipmentCatalogue({ items, view }: { items: EquipmentListItem[]; view: EquipmentView }) {
  if (items.length === 0) {
    return <p className="bg-[#eef2f6] px-4 py-10 text-sm text-slate-500">No equipment matches this search.</p>;
  }
  if (view === "list") {
    return (
      <ul className="divide-y divide-slate-200 bg-white">
        {items.map((item) => {
          const facts = machineFacts(item);
          return (
            <li key={item.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start">
              <div className="flex min-w-0 flex-1 gap-3">
                <Link href={`/dashboard/equipment/${item.id}`} className="shrink-0" aria-label={facts.equipmentName}>
                  <CataloguePhoto name={facts.equipmentName} />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">{item.purposeName || "Equipment"}</p>
                  <Link href={`/dashboard/equipment/${item.id}`} className="block truncate text-sm font-semibold text-navy hover:text-blue">{facts.equipmentName}</Link>
                  {facts.alias && <p className="truncate text-xs text-slate-500">{facts.alias}</p>}
                  <div className="mt-2">
                    <Pills item={item} capacity={facts.capacity} lengthNote={facts.lengthNote} />
                  </div>
                </div>
              </div>
              <div className="min-w-0 sm:w-96 sm:shrink-0 sm:border-l sm:border-slate-100 sm:pl-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.suppliers.length === 1 ? "Supplier" : "Suppliers"}</p>
                <SupplierPreview item={item} />
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
  if (view === "table") {
    return (
      <div className="overflow-x-auto bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Equipment</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Capacity</th>
              <th className="px-4 py-3 font-semibold">Length</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const facts = machineFacts(item);
              return (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CataloguePhoto name={facts.equipmentName} />
                      <div className="min-w-0">
                        <Link href={`/dashboard/equipment/${item.id}`} className="block truncate font-semibold text-navy hover:text-blue">{facts.equipmentName}</Link>
                        {facts.alias && <p className="truncate text-xs text-slate-500">{facts.alias}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.purposeName || "—"}</td>
                  <td className="px-4 py-3 font-medium text-navy">{facts.capacity || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{facts.lengthNote || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{ownershipLabel(item.ownership)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${statusClass(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <SupplierPreview item={item} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <ul className="grid gap-3 bg-[#eef2f6] p-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const facts = machineFacts(item);
        return (
          <li key={item.id}>
            <article className="flex h-full gap-3 rounded-xl border border-navy/10 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <Link href={`/dashboard/equipment/${item.id}`} className="shrink-0" aria-label={facts.equipmentName}>
                <CataloguePhoto name={facts.equipmentName} />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">{item.purposeName || "Equipment"}</p>
                <Link href={`/dashboard/equipment/${item.id}`} className="mt-0.5 block truncate text-sm font-semibold text-navy hover:text-blue">{facts.equipmentName}</Link>
                {facts.alias && <p className="truncate text-xs text-slate-500">{facts.alias}</p>}
                <div className="mt-2">
                  <Pills item={item} capacity={facts.capacity} lengthNote={facts.lengthNote} />
                </div>
                <p className="mt-2 truncate text-xs text-slate-500">
                  <SupplierLine item={item} />
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
