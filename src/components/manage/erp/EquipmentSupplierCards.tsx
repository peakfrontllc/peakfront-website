import Link from "next/link";
import { Building2, LayoutGrid, List, Table2, UserRound } from "lucide-react";
import type { EquipmentSupplier } from "@/lib/erp/equipment";
import { formatMoney } from "@/lib/erp/shared";

export const EQUIPMENT_SUPPLIER_VIEWS = ["cards", "list", "table"] as const;
export type EquipmentSupplierView = (typeof EQUIPMENT_SUPPLIER_VIEWS)[number];

export function equipmentSupplierView(value: string | undefined): EquipmentSupplierView {
  return value === "list" || value === "table" ? value : "cards";
}

function partyLabel(type: EquipmentSupplier["partyType"]) {
  return type === "individual" ? "Individual" : "Company";
}

function showContact(supplier: EquipmentSupplier) {
  return Boolean(supplier.ownerName) && supplier.ownerName.toLowerCase() !== supplier.supplierName.toLowerCase();
}

function PartyIcon({ type, compact = false }: { type: EquipmentSupplier["partyType"]; compact?: boolean }) {
  const Icon = type === "individual" ? UserRound : Building2;
  return (
    <span className={`flex shrink-0 items-center justify-center bg-navy text-white ${compact ? "h-7 w-7 rounded-lg" : "h-10 w-10 rounded-xl"}`}>
      <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
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

function ContactLine({ supplier }: { supplier: EquipmentSupplier }) {
  if (!showContact(supplier)) return null;
  return (
    <p className="text-xs text-navy">
      {supplier.contactTitle && <span className="text-slate-400">{supplier.contactTitle} </span>}
      {supplier.ownerName}
    </p>
  );
}

function RateTiles({ supplier }: { supplier: EquipmentSupplier }) {
  return (
    <dl className="grid grid-cols-3 gap-2">
      {[
        ["Day", supplier.dailyRate],
        ["Week", supplier.weeklyRate],
        ["Month", supplier.monthlyRate],
      ].map(([rateLabel, amount]) => (
        <div key={String(rateLabel)} className="rounded-xl bg-white px-2 py-2 text-center ring-1 ring-slate-200">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{rateLabel}</dt>
          <dd className="mt-0.5 text-xs font-semibold text-navy">{typeof amount === "number" ? formatMoney(amount) : "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function supplierHasRates(supplier: EquipmentSupplier, canRates: boolean) {
  return canRates && (supplier.dailyRate !== null || supplier.weeklyRate !== null || supplier.monthlyRate !== null);
}

export function EquipmentSupplierViewSwitch({
  view,
  hrefFor,
}: {
  view: EquipmentSupplierView;
  hrefFor: (view: EquipmentSupplierView) => string;
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

export function EquipmentSupplierCards({
  suppliers,
  canRates,
  compact = false,
}: {
  suppliers: EquipmentSupplier[];
  canRates: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <ul className="divide-y divide-navy/10 overflow-hidden rounded-xl border border-navy/10 bg-white">
        {suppliers.map((supplier) => (
          <li key={supplier.supplierId} className="flex items-center gap-2 px-2.5 py-1.5 transition hover:bg-amber/15">
            <PartyIcon type={supplier.partyType} compact />
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-navy">{supplier.supplierName}</p>
            <Link href={`/dashboard/suppliers/${supplier.supplierId}`} className="inline-flex h-7 shrink-0 items-center rounded-md bg-navy px-2.5 text-[11px] font-semibold text-white hover:bg-blue">
              View more details
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {suppliers.map((supplier) => {
        const place = [supplier.phone, supplier.emirate].filter(Boolean).join(" · ");
        return (
          <li key={supplier.supplierId} className="flex flex-col rounded-2xl border border-navy/10 bg-[#f4f7fa] p-4 transition hover:border-amber hover:bg-amber/15">
            <div className="flex items-start gap-3">
              <PartyIcon type={supplier.partyType} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">{supplier.supplierName}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{partyLabel(supplier.partyType)}</p>
                <ContactLine supplier={supplier} />
                {place && <p className="mt-1 text-xs text-slate-500">{place}</p>}
                {supplier.email && <p className="break-all text-xs text-slate-500">{supplier.email}</p>}
                {supplier.leadTime && <p className="mt-1 text-xs text-slate-500">Lead time {supplier.leadTime}</p>}
              </div>
            </div>
            {supplierHasRates(supplier, canRates) && <div className="mt-3"><RateTiles supplier={supplier} /></div>}
            <div className="mt-3">
              <DetailsLink id={supplier.supplierId} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function EquipmentSupplierCatalogue({
  suppliers,
  view,
  canRates,
}: {
  suppliers: EquipmentSupplier[];
  view: EquipmentSupplierView;
  canRates: boolean;
}) {
  if (suppliers.length === 0) {
    return <p className="bg-[#eef2f6] px-4 py-10 text-sm text-slate-500">No suppliers match this search.</p>;
  }
  if (view === "list") {
    return (
      <ul className="divide-y divide-slate-200 bg-white">
        {suppliers.map((supplier) => {
          const place = [supplier.phone, supplier.emirate].filter(Boolean).join(" · ");
          return (
            <li key={supplier.supplierId} className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 gap-3">
                <PartyIcon type={supplier.partyType} />
                <div className="min-w-0">
                  <Link href={`/dashboard/suppliers/${supplier.supplierId}`} className="block text-sm font-semibold text-navy hover:text-blue">{supplier.supplierName}</Link>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{partyLabel(supplier.partyType)}</p>
                  <ContactLine supplier={supplier} />
                </div>
              </div>
              <div className="min-w-0 text-xs text-slate-500 lg:w-64 lg:shrink-0">
                <p>{place || "No contact yet"}</p>
                {supplier.email && <p className="break-all">{supplier.email}</p>}
                {supplier.leadTime && <p>Lead time {supplier.leadTime}</p>}
              </div>
              {supplierHasRates(supplier, canRates) && (
                <div className="w-full lg:w-64 lg:shrink-0">
                  <RateTiles supplier={supplier} />
                </div>
              )}
              <DetailsLink id={supplier.supplierId} />
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
              <th className="px-4 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Emirates</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              {canRates && <th className="px-4 py-3 font-semibold">Day</th>}
              {canRates && <th className="px-4 py-3 font-semibold">Week</th>}
              {canRates && <th className="px-4 py-3 font-semibold">Month</th>}
              <th className="px-4 py-3 font-semibold"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.supplierId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <PartyIcon type={supplier.partyType} />
                    <div className="min-w-0">
                      <Link href={`/dashboard/suppliers/${supplier.supplierId}`} className="block font-semibold text-navy hover:text-blue">{supplier.supplierName}</Link>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{partyLabel(supplier.partyType)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {showContact(supplier) ? (
                    <p className="text-navy">
                      {supplier.contactTitle && <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-400">{supplier.contactTitle}</span>}
                      {supplier.ownerName}
                    </p>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{supplier.phone || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{supplier.emirate || "—"}</td>
                <td className="px-4 py-3 break-all text-slate-600">{supplier.email || "—"}</td>
                {canRates && <td className="px-4 py-3 font-medium text-navy">{supplier.dailyRate === null ? "—" : formatMoney(supplier.dailyRate)}</td>}
                {canRates && <td className="px-4 py-3 font-medium text-navy">{supplier.weeklyRate === null ? "—" : formatMoney(supplier.weeklyRate)}</td>}
                {canRates && <td className="px-4 py-3 font-medium text-navy">{supplier.monthlyRate === null ? "—" : formatMoney(supplier.monthlyRate)}</td>}
                <td className="px-4 py-3 text-right"><DetailsLink id={supplier.supplierId} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="bg-[#eef2f6] p-3">
      <EquipmentSupplierCards suppliers={suppliers} canRates={canRates} />
    </div>
  );
}
