"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { addSupplierRate, updateEquipmentRate, updateSupplierEquipment } from "@/lib/erp/supplier-actions";
import type { RateRow } from "@/lib/erp/suppliers";
import { formatMoney, todayIso } from "@/lib/erp/shared";

const editButtonClass =
  "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-md border border-navy/15 bg-white px-2.5 text-[11px] font-semibold text-navy hover:border-amber hover:bg-amber/10";
const cancelButtonClass =
  "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md border border-slate-300 bg-white px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50";

function moneyValue(value: number | null) {
  return value === null ? "" : String(value);
}

export function SupplierEquipmentEditor({
  item,
  supplierId,
  canWrite,
  canRates,
}: {
  item: {
    id: string;
    leadTime: string;
    notes: string;
    daily: number | null;
    weekly: number | null;
    monthly: number | null;
    rates: RateRow[];
  };
  supplierId: string;
  canWrite: boolean;
  canRates: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!canWrite && !canRates) return null;
  const returnTo = `/dashboard/suppliers/${supplierId}/equipment`;
  const openRate = item.rates.find((rate) => rate.validTo === null) ?? null;
  const summary = [
    item.leadTime ? `Lead time ${item.leadTime}` : "",
    openRate
      ? `Day ${formatMoney(openRate.dailyRate)} · Week ${formatMoney(openRate.weeklyRate)} · Month ${formatMoney(openRate.monthlyRate)}`
      : "",
  ].filter(Boolean).join(" · ") || "No lead time or rate yet";

  return (
    <div className="mt-2 border-t border-navy/10 pt-2">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs text-slate-500">{open ? "Editing lead time and rates" : summary}</p>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={open ? cancelButtonClass : editButtonClass}
        >
          {open ? "Cancel" : (
            <>
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit
            </>
          )}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-4 rounded-lg border border-navy/10 bg-[#f4f7fa] p-3">
          {canWrite && (
            <form action={updateSupplierEquipment} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="supplierId" value={supplierId} />
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <label className="block">
                <span className={labelClass}>Lead time</span>
                <input name="leadTime" defaultValue={item.leadTime} className={`${fieldClass} mt-1`} />
              </label>
              <label className="block">
                <span className={labelClass}>Notes</span>
                <input name="notes" defaultValue={item.notes} className={`${fieldClass} mt-1`} />
              </label>
              <button className={`${buttonClass} w-fit`} type="submit">Save details</button>
            </form>
          )}
          {canRates && (
            <form key={openRate?.id ?? "new-rate"} action={openRate ? updateEquipmentRate : addSupplierRate} className="grid gap-3 border-t border-navy/10 pt-4 sm:grid-cols-3">
              <input type="hidden" name="supplierId" value={supplierId} />
              <input type="hidden" name="supplierEquipmentId" value={item.id} />
              <input type="hidden" name="returnTo" value={returnTo} />
              {openRate && <input type="hidden" name="rateId" value={openRate.id} />}
              {openRate ? (
                <p className="text-xs text-slate-500 sm:col-span-3">Current rate from {openRate.validFrom}</p>
              ) : (
                <label className="block">
                  <span className={labelClass}>Starts</span>
                  <input name="validFrom" type="date" required defaultValue={todayIso()} className={`${fieldClass} mt-1`} />
                </label>
              )}
              <label className="block">
                <span className={labelClass}>Daily AED</span>
                <input name="dailyRate" inputMode="decimal" defaultValue={moneyValue(openRate?.dailyRate ?? null)} className={`${fieldClass} mt-1`} />
              </label>
              <label className="block">
                <span className={labelClass}>Weekly AED</span>
                <input name="weeklyRate" inputMode="decimal" defaultValue={moneyValue(openRate?.weeklyRate ?? null)} className={`${fieldClass} mt-1`} />
              </label>
              <label className="block">
                <span className={labelClass}>Monthly AED</span>
                <input name="monthlyRate" inputMode="decimal" defaultValue={moneyValue(openRate?.monthlyRate ?? null)} className={`${fieldClass} mt-1`} />
              </label>
              <label className="block">
                <span className={labelClass}>Transport AED</span>
                <input name="transportCharge" inputMode="decimal" defaultValue={moneyValue(openRate?.transportCharge ?? null)} className={`${fieldClass} mt-1`} />
              </label>
              <label className="block">
                <span className={labelClass}>Operator / day AED</span>
                <input name="operatorDailyCharge" inputMode="decimal" defaultValue={moneyValue(openRate?.operatorDailyCharge ?? null)} className={`${fieldClass} mt-1`} />
              </label>
              <label className="flex items-center gap-2 text-sm text-navy sm:col-span-3">
                <input name="vatIncluded" type="checkbox" defaultChecked={openRate?.vatIncluded ?? false} /> VAT included
              </label>
              <button className={`${buttonClass} w-fit`} type="submit">{openRate ? "Save rate" : "Save new rate"}</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
