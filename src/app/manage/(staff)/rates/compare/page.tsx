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

  return (
    <>
      <MasterHero kicker="Pricing" title="Compare supplier rates" />
      <div>
          <Link href="/manage/rates" className="mb-4 inline-block text-sm font-semibold text-blue hover:underline">All current rates</Link>
          <form action="/manage/rates/compare" className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <select name="equipment" defaultValue={params.equipment ?? ""} required className={fieldClass}>
              <option value="" disabled>Choose equipment</option>
              {equipmentGroups(equipment).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </optgroup>
              ))}
            </select>
            <button className={buttonClass} type="submit">Compare</button>
          </form>
          {selected && (
            <DataCard>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
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
                    <tr><td className="px-4 py-4 text-slate-500" colSpan={7}>No current supplier rates for {selected.name}.</td></tr>
                  ) : rates.map((rate) => (
                    <tr key={rate.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3"><Link className="font-semibold text-blue hover:underline" href={`/manage/suppliers/${rate.supplierId}`}>{rate.supplierName}</Link></td>
                      <td className="px-4 py-3">{formatMoney(rate.dailyRate)}</td>
                      <td className="px-4 py-3">{formatMoney(rate.weeklyRate)}</td>
                      <td className="px-4 py-3">{formatMoney(rate.monthlyRate)}</td>
                      <td className="px-4 py-3">{formatMoney(rate.transportCharge)}</td>
                      <td className="px-4 py-3">{formatMoney(rate.operatorDailyCharge)}</td>
                      <td className="px-4 py-3">{rate.vatIncluded ? "Included" : "Extra"}</td>
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
