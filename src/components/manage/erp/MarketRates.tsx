"use client";

import { useState } from "react";
import { saveMarketRate } from "@/lib/erp/market-rate-actions";
import type { MarketRate } from "@/lib/erp/market-rates";
import { chargesPerKm, measureNote } from "@/lib/erp/lengths";
import { formatMoney, formatPerKm } from "@/lib/erp/shared";
import { fieldClass, labelClass } from "@/components/manage/form-styles";

function moneyValue(value: number | null) {
  return value === null ? "" : String(value);
}

function facts(rate: MarketRate) {
  return [rate.sizeName, measureNote(rate.boomLength, rate.bedLength, rate.sizeName)].filter(Boolean).join(" · ");
}

export function MarketRateFields({ rate, returnTo }: { rate: MarketRate; returnTo: string }) {
  return (
    <form action={saveMarketRate} className="grid gap-3">
      <input type="hidden" name="equipmentId" value={rate.equipmentId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <div className={chargesPerKm(rate.typeName) ? "grid grid-cols-2 items-end gap-3 sm:grid-cols-4" : "grid grid-cols-3 items-end gap-3"}>
        <div className="text-center">
          <label className={`${labelClass} block`} htmlFor={`daily-${rate.equipmentId}`}>Daily AED</label>
          <input id={`daily-${rate.equipmentId}`} name="dailyRate" inputMode="decimal" defaultValue={moneyValue(rate.dailyRate)} placeholder="0.00" className={`${fieldClass} text-center`} />
        </div>
        <div className="text-center">
          <label className={`${labelClass} block`} htmlFor={`weekly-${rate.equipmentId}`}>Weekly AED</label>
          <input id={`weekly-${rate.equipmentId}`} name="weeklyRate" inputMode="decimal" defaultValue={moneyValue(rate.weeklyRate)} placeholder="0.00" className={`${fieldClass} text-center`} />
        </div>
        <div className="text-center">
          <label className={`${labelClass} block`} htmlFor={`monthly-${rate.equipmentId}`}>Monthly AED</label>
          <input id={`monthly-${rate.equipmentId}`} name="monthlyRate" inputMode="decimal" defaultValue={moneyValue(rate.monthlyRate)} placeholder="0.00" className={`${fieldClass} text-center`} />
        </div>
        {chargesPerKm(rate.typeName) && (
          <div className="text-center">
            <label className={`${labelClass} block`} htmlFor={`km-${rate.equipmentId}`}>Per km AED</label>
            <input id={`km-${rate.equipmentId}`} name="perKmRate" inputMode="decimal" defaultValue={moneyValue(rate.perKmRate)} placeholder="0.00" className={`${fieldClass} text-center`} />
          </div>
        )}
      </div>
      <div>
        <label className={labelClass} htmlFor={`notes-${rate.equipmentId}`}>Note</label>
        <textarea id={`notes-${rate.equipmentId}`} name="notes" rows={2} maxLength={500} defaultValue={rate.notes} placeholder="Where this market figure came from" className={fieldClass} />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="vatIncluded" defaultChecked={rate.vatIncluded} className="h-4 w-4 accent-navy" />
        VAT included
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="inline-flex h-9 items-center rounded-md bg-navy px-3 text-sm font-semibold text-white hover:bg-navy/90">Save general rate</button>
        <span className="text-xs text-slate-500">Clear every field to remove the note.</span>
      </div>
    </form>
  );
}

function Amounts({ rate }: { rate: MarketRate }) {
  return (
    <dl className="grid grid-cols-3 gap-2 text-sm">
      {([["Day", rate.dailyRate], ["Week", rate.weeklyRate], ["Month", rate.monthlyRate]] as const).map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-slate-500">{label}</dt>
          <dd className="font-semibold text-navy">{formatMoney(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function TripLine({ typeName, rate }: { typeName: string; rate: number | null }) {
  if (!chargesPerKm(typeName)) return null;
  const text = formatPerKm(rate);
  if (!text) return null;
  return <p className="text-center text-sm font-semibold text-navy">{text}</p>;
}

export function MarketRatePanel({ rate, canWrite, returnTo }: { rate: MarketRate; canWrite: boolean; returnTo: string }) {
  return (
    <div className="grid gap-3">
      <Amounts rate={rate} />
      <TripLine typeName={rate.typeName} rate={rate.perKmRate} />
      {rate.notes ? <p className="text-sm text-slate-600">{rate.notes}</p> : null}
      {rate.vatIncluded ? <p className="text-xs text-slate-500">VAT included</p> : null}
      {!rate.hasRate && !canWrite ? <p className="text-sm text-slate-500">No general rate noted yet.</p> : null}
      {canWrite ? <MarketRateFields rate={rate} returnTo={returnTo} /> : null}
    </div>
  );
}

function RateCard({ rate, returnTo, canWrite }: { rate: MarketRate; returnTo: string; canWrite: boolean }) {
  const [open, setOpen] = useState(false);
  const detail = facts(rate);
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-navy/10 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">{rate.purposeName}</p>
          <h3 className="text-base font-semibold text-navy">{rate.typeName}</h3>
          {detail ? <p className="text-[13px] text-slate-600">{detail}</p> : null}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${rate.hasRate ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
          {rate.hasRate ? "Noted" : "Empty"}
        </span>
      </div>
      <Amounts rate={rate} />
      <TripLine typeName={rate.typeName} rate={rate.perKmRate} />
      {rate.notes ? <p className="text-[13px] text-slate-600">{rate.notes}</p> : null}
      {canWrite ? (
        <>
          <button type="button" onClick={() => setOpen((value) => !value)} className="self-start text-sm font-semibold text-navy underline-offset-2 hover:underline">
            {open ? "Close" : "Edit general rate"}
          </button>
          {open ? <MarketRateFields key={`${rate.equipmentId}-${rate.dailyRate}-${rate.weeklyRate}-${rate.monthlyRate}-${rate.perKmRate}-${rate.notes}`} rate={rate} returnTo={returnTo} /> : null}
        </>
      ) : null}
    </article>
  );
}

export function MarketRateCatalogue({ rates, returnTo, view, canWrite }: { rates: MarketRate[]; returnTo: string; view: string; canWrite: boolean }) {
  if (rates.length === 0) {
    return <p className="rounded-lg border border-dashed border-navy/15 px-4 py-8 text-center text-sm text-slate-500">No machines match these filters.</p>;
  }
  if (view === "table") {
    return (
      <div className="overflow-x-auto rounded-lg border border-navy/10">
        <table className="stack-table w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-[#f4f7fa] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">Machine</th>
              <th className="px-3 py-2 font-semibold">Day</th>
              <th className="px-3 py-2 font-semibold">Week</th>
              <th className="px-3 py-2 font-semibold">Month</th>
              <th className="px-3 py-2 font-semibold">Per km</th>
              <th className="px-3 py-2 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate.equipmentId} className="border-t border-navy/10">
                <td className="px-3 py-2" data-label="Machine">
                  <div className="font-semibold text-navy">{rate.typeName}</div>
                  <div className="text-[13px] text-slate-500">{[rate.purposeName, facts(rate)].filter(Boolean).join(" · ")}</div>
                </td>
                <td className="px-3 py-2" data-label="Day">{formatMoney(rate.dailyRate)}</td>
                <td className="px-3 py-2" data-label="Week">{formatMoney(rate.weeklyRate)}</td>
                <td className="px-3 py-2" data-label="Month">{formatMoney(rate.monthlyRate)}</td>
                <td className="px-3 py-2" data-label="Per km">{chargesPerKm(rate.typeName) ? (formatPerKm(rate.perKmRate) || "—") : ""}</td>
                <td className="px-3 py-2 text-[13px] text-slate-600" data-label="Note">
                  <p>{rate.notes || "—"}</p>
                  {canWrite ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-semibold text-navy">Edit general rate</summary>
                      <div className="mt-3 max-w-xl">
                        <MarketRateFields rate={rate} returnTo={returnTo} />
                      </div>
                    </details>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (view === "list") {
    return (
      <ul className="divide-y divide-navy/10 overflow-hidden rounded-lg border border-navy/10 bg-white">
        {rates.map((rate) => (
          <li key={rate.equipmentId}>
            <RateCard rate={rate} returnTo={returnTo} canWrite={canWrite} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {rates.map((rate) => <RateCard key={rate.equipmentId} rate={rate} returnTo={returnTo} canWrite={canWrite} />)}
    </div>
  );
}
