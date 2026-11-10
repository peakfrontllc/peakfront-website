import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { DataCard, Flash, MasterHero } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listSuppliers } from "@/lib/erp/suppliers";
import { EMIRATES } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Suppliers", robots: { index: false, follow: false } };

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; region?: string; archived?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.suppliersRead);
  const params = await searchParams;
  const archived = params.archived === "1";
  const suppliers = await listSuppliers({ q: params.q, archived, partyType: params.type, region: params.region });
  const canWrite = hasPermission(session.permissions, PERMISSIONS.suppliersWrite);

  return (
    <>
      <MasterHero kicker="Sourcing" title="Suppliers" icon={Building2} action={canWrite ? { href: "/manage/suppliers/new", label: "Add supplier" } : undefined} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Add an individual or a company, then open the supplier and link the equipment they can provide.
      </p>
      <div>
          <Flash error={params.error} />
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <form action="/manage/suppliers" className="grid w-full gap-3 sm:flex-1 sm:grid-cols-[1fr_11rem_12rem_auto] sm:items-end">
              {archived && <input type="hidden" name="archived" value="1" />}
              <input name="q" defaultValue={params.q ?? ""} placeholder="Search name, phone, or email" className={fieldClass} />
              <select name="type" defaultValue={params.type ?? ""} className={fieldClass}>
                <option value="">All types</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select>
              <select name="region" defaultValue={params.region ?? ""} className={fieldClass}>
                <option value="">All regions</option>
                {EMIRATES.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
              <button className={buttonClass} type="submit">Search</button>
            </form>
            <Link href={archived ? "/manage/suppliers" : "/manage/suppliers?archived=1"} className="text-sm font-semibold text-blue hover:underline">
              {archived ? "Active" : "Archived"}
            </Link>
          </div>
          <DataCard>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Regions</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Equipment</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr><td className="px-4 py-8 text-slate-500" colSpan={5}>No suppliers match this search.</td></tr>
                  ) : suppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {supplier.partyType === "individual" ? "Individual" : "Company"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/manage/suppliers/${supplier.id}`} className="font-semibold text-navy hover:text-blue">{supplier.companyName}</Link>
                        {supplier.email && <span className="mt-0.5 block text-xs text-slate-500">{supplier.email}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {supplier.emirates.length === 0 ? (
                          <span className="text-slate-500">—</span>
                        ) : (
                          <span className="flex flex-wrap gap-1">
                            {supplier.emirates.map((region) => (
                              <span key={region} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{region}</span>
                            ))}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {supplier.contactName && <span className="block font-medium text-navy">{supplier.contactName}</span>}
                        <span>{supplier.phone || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {supplier.equipmentCount === 0 ? "None" : supplier.equipmentCount === 1 ? "1 linked" : `${supplier.equipmentCount} linked`}
                      </td>
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
