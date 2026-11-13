"use client";

import Link from "next/link";
import { LayoutGrid, List, MapPin, Pencil, Table2 } from "lucide-react";
import { useState } from "react";
import { CataloguePhoto } from "@/components/manage/erp/CataloguePhoto";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { updateEquipmentRate } from "@/lib/erp/supplier-actions";
import { capacityLabel, chargesPerKm, measureNote } from "@/lib/erp/lengths";
import { formatMoney, formatPerKm } from "@/lib/erp/shared";

type RateView = "cards" | "list" | "table";

type RateLine = {
  id: string;
  supplierId: string;
  supplierName: string;
  place: string;
  supplierEquipmentId: string;
  equipmentId: string;
  purposeName: string;
  typeName: string;
  sizeName: string;
  boomLength: string;
  bedLength: string;
  alias: string;
  dailyRate: number | null;
  weeklyRate: number | null;
  monthlyRate: number | null;
  transportCharge: number | null;
  operatorDailyCharge: number | null;
  perKmRate: number | null;
  vatIncluded: boolean;
  validFrom: string;
  hasRate: boolean;
  rateId: string;
};

type RateFilters = {
  q: string;
  supplier: string;
  purpose: string;
  region: string;
  status: string;
  view: RateView;
};

const editButtonClass =
  "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-md border border-navy/15 bg-white px-2.5 text-[11px] font-semibold text-navy hover:border-amber hover:bg-amber/10";
const cancelButtonClass =
  "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md border border-slate-300 bg-white px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50";

function moneyValue(value: number | null) {
  return value === null ? "" : String(value);
}

function sizeLabel(rate: RateLine) {
  return [capacityLabel(rate.sizeName), measureNote(rate.boomLength, rate.bedLength, rate.sizeName)].filter(Boolean).join(" · ");
}

export function RatesViewSwitch({
  view,
  hrefs,
}: {
  view: RateView;
  hrefs: Record<RateView, string>;
}) {
  const views = [
    { id: "cards" as const, label: "Cards", icon: LayoutGrid },
    { id: "list" as const, label: "List", icon: List },
    { id: "table" as const, label: "Table", icon: Table2 },
  ];
  return (
    <div className="view-switch flex shrink-0 rounded-lg bg-white/10 p-0.5">
      {views.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <Link
            key={item.id}
            href={hrefs[item.id]}
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

function EditButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-expanded={open} onClick={onClick} className={open ? cancelButtonClass : editButtonClass}>
      {open ? "Cancel" : (
        <>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Edit
        </>
      )}
    </button>
  );
}

function RateForm({ rate, filters }: { rate: RateLine; filters: RateFilters }) {
  return (
    <form action={updateEquipmentRate} className="grid gap-3">
      <input type="hidden" name="supplierEquipmentId" value={rate.supplierEquipmentId} />
      <input type="hidden" name="rateId" value={rate.rateId} />
      <input type="hidden" name="q" value={filters.q} />
      <input type="hidden" name="supplier" value={filters.supplier} />
      <input type="hidden" name="purpose" value={filters.purpose} />
      <input type="hidden" name="region" value={filters.region} />
      <input type="hidden" name="status" value={filters.status} />
      {filters.view !== "cards" && <input type="hidden" name="view" value={filters.view} />}
      <div className="flex flex-wrap items-end justify-center gap-3">
        <label className="block w-[calc(50%-0.375rem)] text-center sm:w-36">
          <span className={`${labelClass} block`}>Daily AED</span>
          <input name="dailyRate" inputMode="decimal" defaultValue={moneyValue(rate.dailyRate)} className={`${fieldClass} text-center`} />
        </label>
        <label className="block w-[calc(50%-0.375rem)] text-center sm:w-36">
          <span className={`${labelClass} block`}>Weekly AED</span>
          <input name="weeklyRate" inputMode="decimal" defaultValue={moneyValue(rate.weeklyRate)} className={`${fieldClass} text-center`} />
        </label>
        <label className="block w-[calc(50%-0.375rem)] text-center sm:w-36">
          <span className={`${labelClass} block`}>Monthly AED</span>
          <input name="monthlyRate" inputMode="decimal" defaultValue={moneyValue(rate.monthlyRate)} className={`${fieldClass} text-center`} />
        </label>
        <label className="block w-[calc(50%-0.375rem)] text-center sm:w-36">
          <span className={`${labelClass} block`}>Transport AED</span>
          <input name="transportCharge" inputMode="decimal" defaultValue={moneyValue(rate.transportCharge)} className={`${fieldClass} text-center`} />
        </label>
        <label className="block w-[calc(50%-0.375rem)] text-center sm:w-36">
          <span className={`${labelClass} block`}>Operator / day AED</span>
          <input name="operatorDailyCharge" inputMode="decimal" defaultValue={moneyValue(rate.operatorDailyCharge)} className={`${fieldClass} text-center`} />
        </label>
        {chargesPerKm(rate.typeName) && (
          <label className="block w-[calc(50%-0.375rem)] text-center sm:w-36">
            <span className={`${labelClass} block`}>Per km AED</span>
            <input name="perKmRate" inputMode="decimal" defaultValue={moneyValue(rate.perKmRate)} className={`${fieldClass} text-center`} />
          </label>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-navy">
        <input name="vatIncluded" type="checkbox" defaultChecked={rate.vatIncluded} /> VAT included
      </label>
      <div>
        <button className={buttonClass} type="submit">{rate.hasRate ? "Save rate" : "Add rate"}</button>
      </div>
    </form>
  );
}

function RateTiles({ rate }: { rate: RateLine }) {
  return (
    <dl className="grid grid-cols-3 gap-2">
      {([["Day", rate.dailyRate], ["Week", rate.weeklyRate], ["Month", rate.monthlyRate]] as const).map(([label, amount]) => (
        <div key={label} className="min-w-0 rounded-lg bg-[#f4f7fa] px-1.5 py-1.5 text-center">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
          <dd className="break-all text-xs font-semibold text-navy">{formatMoney(amount)}</dd>
        </div>
      ))}
    </dl>
  );
}

function TripNote({ rate }: { rate: RateLine }) {
  if (!chargesPerKm(rate.typeName)) return null;
  const text = formatPerKm(rate.perKmRate);
  if (!text) return null;
  return <p className="mt-2 text-[11px] font-semibold text-navy">{text}</p>;
}

function SupplierName({ rate }: { rate: RateLine }) {
  if (!rate.supplierId) return <span className="text-slate-500">No supplier</span>;
  return <Link className="font-medium text-navy hover:text-blue" href={`/dashboard/suppliers/${rate.supplierId}`}>{rate.supplierName}</Link>;
}

function PlaceLine({ place }: { place: string }) {
  if (!place) return null;
  return (
    <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[11px] text-slate-500">
      <MapPin className="h-3 w-3 shrink-0" aria-hidden />
      <span className="truncate">{place}</span>
    </p>
  );
}

function RateCard({
  rate,
  canWrite,
  filters,
}: {
  rate: RateLine;
  canWrite: boolean;
  filters: RateFilters;
}) {
  const [open, setOpen] = useState(false);
  const canEdit = canWrite && Boolean(rate.supplierEquipmentId);
  const size = sizeLabel(rate);
  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-3 transition hover:border-amber hover:bg-amber/15">
      <div className="flex items-start gap-2">
        <CataloguePhoto name={rate.typeName} small />
        <div className="min-w-0 flex-1">
          <Link href={`/dashboard/equipment/${rate.equipmentId}`} className="block truncate text-sm font-semibold text-navy hover:text-blue">{rate.typeName}</Link>
          {size && <p className="truncate text-xs font-medium text-navy">{size}</p>}
          <p className="truncate text-xs text-slate-500">{[rate.purposeName, rate.alias].filter(Boolean).join(" · ")}</p>
        </div>
        {canEdit && <EditButton open={open} onClick={() => setOpen((value) => !value)} />}
      </div>
      <div className="mt-2 min-w-0 text-xs">
        <SupplierName rate={rate} />
        <PlaceLine place={rate.place} />
      </div>
      <div className="mt-2"><RateTiles rate={rate} /><TripNote rate={rate} /></div>
      <p className="mt-2 text-[11px] text-slate-400">{rate.hasRate ? `From ${rate.validFrom}${rate.vatIncluded ? " · VAT included" : ""}` : "No rate yet"}</p>
      {open && canEdit && <div className="mt-3 border-t border-navy/10 pt-3"><RateForm rate={rate} filters={filters} /></div>}
    </article>
  );
}

export function RatesCatalogue({
  rates,
  canWrite,
  view,
  filters,
}: {
  rates: RateLine[];
  canWrite: boolean;
  view: RateView;
  filters: RateFilters;
}) {
  if (rates.length === 0) {
    return <p className="bg-white px-4 py-8 text-sm text-slate-500">No rates match this search.</p>;
  }
  if (view === "list") {
    return (
      <ul className="divide-y divide-slate-100 bg-white">
        {rates.map((rate) => (
          <RateListItem key={`${rate.equipmentId}-${rate.supplierEquipmentId || rate.id}`} rate={rate} canWrite={canWrite} filters={filters} />
        ))}
      </ul>
    );
  }
  if (view === "table") {
    return <RatesTable rates={rates} canWrite={canWrite} filters={filters} />;
  }
  return (
    <ul className="grid gap-3 bg-[#eef2f6] p-3 sm:grid-cols-2 xl:grid-cols-3">
      {rates.map((rate) => (
        <li key={`${rate.equipmentId}-${rate.supplierEquipmentId || rate.id}`}>
          <RateCard rate={rate} canWrite={canWrite} filters={filters} />
        </li>
      ))}
    </ul>
  );
}

function RateListItem({
  rate,
  canWrite,
  filters,
}: {
  rate: RateLine;
  canWrite: boolean;
  filters: RateFilters;
}) {
  const [open, setOpen] = useState(false);
  const canEdit = canWrite && Boolean(rate.supplierEquipmentId);
  const size = sizeLabel(rate);
  return (
    <li className="px-3 py-2 transition hover:bg-amber/15">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <CataloguePhoto name={rate.typeName} small />
          <div className="min-w-0">
            <Link href={`/dashboard/equipment/${rate.equipmentId}`} className="block truncate text-sm font-semibold text-navy hover:text-blue">{rate.typeName}</Link>
            <p className="truncate text-xs text-slate-500">{[size, rate.purposeName].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
        <div className="min-w-0 text-xs lg:w-52">
          <SupplierName rate={rate} />
          <PlaceLine place={rate.place} />
        </div>
        <div className="lg:w-64"><RateTiles rate={rate} /><TripNote rate={rate} /></div>
        {canEdit && <EditButton open={open} onClick={() => setOpen((value) => !value)} />}
      </div>
      {open && canEdit && <div className="mt-3"><RateForm rate={rate} filters={filters} /></div>}
    </li>
  );
}

function RatesTable({
  rates,
  canWrite,
  filters,
}: {
  rates: RateLine[];
  canWrite: boolean;
  filters: RateFilters;
}) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="stack-table min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Equipment</th>
            <th className="px-4 py-3">Capacity</th>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Daily</th>
            <th className="px-4 py-3">Weekly</th>
            <th className="px-4 py-3">Monthly</th>
            <th className="px-4 py-3">Per km</th>
            <th className="px-4 py-3">From</th>
            {canWrite && <th className="px-4 py-3"><span className="sr-only">Edit</span></th>}
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <RateTableRow key={`${rate.equipmentId}-${rate.supplierEquipmentId || rate.id}`} rate={rate} canWrite={canWrite} filters={filters} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RateTableRow({
  rate,
  canWrite,
  filters,
}: {
  rate: RateLine;
  canWrite: boolean;
  filters: RateFilters;
}) {
  const [open, setOpen] = useState(false);
  const canEdit = canWrite && Boolean(rate.supplierEquipmentId);
  const size = sizeLabel(rate);
  return (
    <>
      <tr className="border-b border-slate-100 transition last:border-0 hover:bg-amber/15">
        <td className="px-4 py-3" data-label="Equipment">
          <Link href={`/dashboard/equipment/${rate.equipmentId}`} className="font-semibold text-navy hover:text-blue">{rate.typeName}</Link>
          {rate.alias && <span className="mt-0.5 block text-xs text-slate-500">{rate.alias}</span>}
          {rate.purposeName && <span className="mt-0.5 block text-xs text-slate-500">{rate.purposeName}</span>}
        </td>
        <td className="px-4 py-3 font-medium text-navy" data-label="Capacity">{size || "—"}</td>
        <td className="px-4 py-3" data-label="Supplier">
          <SupplierName rate={rate} />
          <PlaceLine place={rate.place} />
        </td>
        <td className="px-4 py-3" data-label="Daily">{formatMoney(rate.dailyRate)}</td>
        <td className="px-4 py-3" data-label="Weekly">{formatMoney(rate.weeklyRate)}</td>
        <td className="px-4 py-3" data-label="Monthly">{formatMoney(rate.monthlyRate)}</td>
        <td className="px-4 py-3" data-label="Per km">{chargesPerKm(rate.typeName) ? (formatPerKm(rate.perKmRate) || "—") : ""}</td>
        <td className="px-4 py-3" data-label="From">{rate.hasRate ? `${rate.validFrom}${rate.vatIncluded ? " · VAT in" : ""}` : "No rate yet"}</td>
        {canWrite && (
          <td className="px-4 py-3 text-right" data-label="">
            {canEdit && <EditButton open={open} onClick={() => setOpen((value) => !value)} />}
          </td>
        )}
      </tr>
      {open && canEdit && (
        <tr className="border-b border-slate-100 bg-[#f4f7fa]">
          <td colSpan={canWrite ? 9 : 8} className="px-4 py-3" data-label="">
            <RateForm rate={rate} filters={filters} />
          </td>
        </tr>
      )}
    </>
  );
}
