import type { Metadata } from "next";
import Link from "next/link";
import { DataCard, Flash, MasterHero } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { formatMoney } from "@/lib/erp/shared";
import { listCurrentRates } from "@/lib/erp/rates";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Supplier rates", robots: { index: false, follow: false } };

export default async function RatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string }>;
}) {
  await requirePermission(PERMISSIONS.ratesRead);
  const params = await searchParams;
  const rates = await listCurrentRates(params.q);

  return (
    <>
      <MasterHero kicker="Pricing" title="Current supplier rates" action={{ href: "/manage/rates/compare", label: "Compare" }} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Each size is listed on its own, so a 45 m, 55 m, and 65 m each show their own rate.
      </p>
      <div>
          <Flash error={params.error} />
          <form action="/manage/rates" className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <input name="q" defaultValue={params.q ?? ""} placeholder="Search equipment, size, or supplier" className={fieldClass} />
            <button className={buttonClass} type="submit">Search</button>
          </form>
          <DataCard>
            <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Daily</th>
                  <th className="px-4 py-3">Weekly</th>
                  <th className="px-4 py-3">Monthly</th>
                  <th className="px-4 py-3">Transport</th>
                  <th className="px-4 py-3">Operator</th>
                  <th className="px-4 py-3">From</th>
                </tr>
              </thead>
              <tbody>
                {rates.length === 0 ? (
                  <tr><td className="px-4 py-4 text-slate-500" colSpan={9}>No linked equipment. Add a rate from a supplier record.</td></tr>
                ) : rates.map((rate) => (
                  <tr key={rate.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/manage/equipment/${rate.equipmentId}`} className="font-semibold text-navy hover:text-blue">{rate.typeName}</Link>
                      {rate.alias && <span className="mt-0.5 block text-xs text-slate-500">{rate.alias}</span>}
                      {rate.purposeName && <span className="mt-0.5 block text-xs text-slate-500">{rate.purposeName}</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{rate.sizeName || "—"}</td>
                    <td className="px-4 py-3">
                      {rate.supplierId ? (
                        <Link className="text-blue hover:underline" href={`/manage/suppliers/${rate.supplierId}`}>{rate.supplierName}</Link>
                      ) : (
                        <span className="text-slate-500">No supplier</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatMoney(rate.dailyRate)}</td>
                    <td className="px-4 py-3">{formatMoney(rate.weeklyRate)}</td>
                    <td className="px-4 py-3">{formatMoney(rate.monthlyRate)}</td>
                    <td className="px-4 py-3">{formatMoney(rate.transportCharge)}</td>
                    <td className="px-4 py-3">{formatMoney(rate.operatorDailyCharge)}</td>
                    <td className="px-4 py-3">{rate.hasRate ? `${rate.validFrom}${rate.vatIncluded ? " · VAT in" : ""}` : "No rate yet"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </DataCard>
      </div>
    </>
  );
}
