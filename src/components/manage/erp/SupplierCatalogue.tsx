import Link from "next/link";
import { Building2, LayoutGrid, List, Table2, UserRound } from "lucide-react";
import type { SupplierListItem } from "@/lib/erp/suppliers";

export const SUPPLIER_VIEWS = ["cards", "list", "table"] as const;
export type SupplierView = (typeof SUPPLIER_VIEWS)[number];

export function supplierView(value: string | undefined): SupplierView {
  return value === "list" || value === "table" ? value : "cards";
}

function partyLabel(type: SupplierListItem["partyType"]) {
  return type === "individual" ? "Individual" : "Company";
}

function machineLabel(count: number) {
  if (count === 0) return "No equipment";
  return count === 1 ? "1 machine" : `${count} machines`;
}

function showContact(supplier: SupplierListItem) {
  return Boolean(supplier.contactName) && supplier.contactName.toLowerCase() !== supplier.companyName.toLowerCase();
}

function PartyIcon({ type }: { type: SupplierListItem["partyType"] }) {
  const Icon = type === "individual" ? UserRound : Building2;
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}

function DetailsLink({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/suppliers/${id}`} className="text-xs font-semibold text-navy hover:text-blue">
      View more details
    </Link>
  );
}

function ContactLine({ supplier }: { supplier: SupplierListItem }) {
  if (!showContact(supplier)) return null;
  return (
    <p className="text-xs text-navy">
      {supplier.contactTitle && <span className="text-slate-400">{supplier.contactTitle} </span>}
      {supplier.contactName}
    </p>
  );
}

export function SupplierViewSwitch({
  view,
  hrefFor,
}: {
  view: SupplierView;
  hrefFor: (view: SupplierView) => string;
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

export function SupplierCatalogue({ items, view }: { items: SupplierListItem[]; view: SupplierView }) {
  if (items.length === 0) {
    return <p className="bg-[#eef2f6] px-4 py-10 text-sm text-slate-500">No suppliers match this search.</p>;
  }
  if (view === "list") {
    return (
      <ul className="divide-y divide-slate-200 bg-white">
        {items.map((supplier) => {
          const place = [supplier.phone, supplier.emirates.join(", ")].filter(Boolean).join(" · ");
          return (
            <li key={supplier.id} className="flex flex-col gap-3 px-4 py-3 transition hover:bg-amber/15 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 gap-3">
                <PartyIcon type={supplier.partyType} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{supplier.companyName}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{partyLabel(supplier.partyType)}</p>
                  <ContactLine supplier={supplier} />
                </div>
              </div>
              <p className="text-xs text-slate-500 lg:w-56 lg:shrink-0">{place || supplier.email || "No contact yet"}</p>
              <p className="text-xs text-slate-500 lg:w-28 lg:shrink-0">{machineLabel(supplier.equipmentCount)}</p>
              <DetailsLink id={supplier.id} />
            </li>
          );
        })}
      </ul>
    );
  }
  if (view === "table") {
    return (
      <div className="overflow-x-auto bg-white">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Emirates</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Equipment</th>
              <th className="px-4 py-3 font-semibold"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((supplier) => (
              <tr key={supplier.id} className="border-b border-slate-100 align-top transition last:border-0 hover:bg-amber/15">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <PartyIcon type={supplier.partyType} />
                    <div className="min-w-0">
                      <p className="font-semibold text-navy">{supplier.companyName}</p>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{partyLabel(supplier.partyType)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {showContact(supplier) ? (
                    <p className="text-navy">
                      {supplier.contactTitle && <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">{supplier.contactTitle}</span>}
                      {supplier.contactName}
                    </p>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{supplier.phone || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{supplier.emirates.join(", ") || "—"}</td>
                <td className="px-4 py-3 break-all text-slate-600">{supplier.email || "—"}</td>
                <td className="px-4 py-3">
                  <p className="text-xs font-medium text-navy">{machineLabel(supplier.equipmentCount)}</p>
                </td>
                <td className="px-4 py-3 text-right"><DetailsLink id={supplier.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <ul className="grid gap-3 bg-[#eef2f6] p-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((supplier) => (
          <li key={supplier.id}>
            <article className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-4 transition hover:border-amber hover:bg-amber/15 hover:shadow-sm">
              <div className="flex items-start gap-3">
                <PartyIcon type={supplier.partyType} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{supplier.companyName}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{partyLabel(supplier.partyType)}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <ContactLine supplier={supplier} />
                <p>{supplier.phone || "No phone"}</p>
              </div>
              <p className="mt-3 text-[11px] font-medium text-slate-400">{machineLabel(supplier.equipmentCount)}</p>
              <div className="mt-3">
                <DetailsLink id={supplier.id} />
              </div>
            </article>
          </li>
      ))}
    </ul>
  );
}
