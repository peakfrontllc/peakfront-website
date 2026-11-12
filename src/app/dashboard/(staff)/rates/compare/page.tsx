import type { Metadata } from "next";
import Link from "next/link";
import { DataCard, MasterHero } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { equipmentGroups, listEquipmentOptions } from "@/lib/erp/equipment";
import { compareEquipmentRates } from "@/lib/erp/rates";
import { formatMoney } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Compare rates", robots: { index: false, follow: false } };

export default async function CompareRatesPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  await requirePermission(PERMISSIONS.ratesRead);
  const params = await searchParams;
  const equipment = await listEquipmentOptions();
  const rates = params.equipment ? await compareEquipmentRates(params.equipment) : [];
  const selected = equipment.find((item) => item.id === params.equipment);
  const selectedLabel = selected ? [selected.label, selected.detail].filter(Boolean).join(" · ") : "";

  return (
    <>
      <MasterHero kicker="Pricing" title="Compare supplier rates" />
      <div>
          <Link href="/dashboard/rates" className="mb-4 inline-block text-sm font-semibold text-blue hover:underline">All current rates</Link>
          <form method="get" action="/dashboard/rates/compare" className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <select name="equipment" defaultValue={params.equipment ?? ""} required className={fieldClass}>
              <option value="" disabled>Choose equipment</option>
              {equipmentGroups(equipment).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((item) => <option key={item.id} value={item.id}>{[item.label, item.detail].filter(Boolean).join(" · ")}</option>)}
                </optgroup>
              ))}
            </select>
            <button className={buttonClass} type="submit">Compare</button>
          </form>
          {selected && (
            <DataCard>
            <p className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-navy">
              {selectedLabel}
              <span className="ml-2 font-medium text-slate-500">{rates.length === 1 ? "1 supplier" : `${rates.length} suppliers`}</span>
            </p>
            <div className="overflow-x-auto">
              <table className="stack-table min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Daily</th>
                    <th className="px-4 py-3">Weekly</th>
                    <th className="px-4 py-3">Monthly</th>
                    <th className="px-4 py-3">Transport</th>
                    <th className="px-4 py-3">Operator</th>
                    <th className="px-4 py-3">VAT</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.length === 0 ? (
                    <tr><td className="px-4 py-4 text-slate-500" colSpan={7} data-label="">No current supplier rates for {selectedLabel}.</td></tr>
                  ) : rates.map((rate) => (
                    <tr key={rate.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3" data-label="Supplier"><Link className="font-semibold text-blue hover:underline" href={`/dashboard/suppliers/${rate.supplierId}`}>{rate.supplierName}</Link></td>
                      <td className="px-4 py-3" data-label="Daily">{formatMoney(rate.dailyRate)}</td>
                      <td className="px-4 py-3" data-label="Weekly">{formatMoney(rate.weeklyRate)}</td>
                      <td className="px-4 py-3" data-label="Monthly">{formatMoney(rate.monthlyRate)}</td>
                      <td className="px-4 py-3" data-label="Transport">{formatMoney(rate.transportCharge)}</td>
                      <td className="px-4 py-3" data-label="Operator">{formatMoney(rate.operatorDailyCharge)}</td>
                      <td className="px-4 py-3" data-label="VAT">{rate.vatIncluded ? "Included" : "Extra"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </DataCard>
          )}
      </div>
    </>
  );
}
