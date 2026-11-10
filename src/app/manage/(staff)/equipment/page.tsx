import type { Metadata } from "next";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { DataCard, Flash, MasterHero } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listCategories, listEquipment } from "@/lib/erp/equipment";
import { ownershipLabel } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Equipment", robots: { index: false, follow: false } };

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; archived?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.equipmentRead);
  const params = await searchParams;
  const archived = params.archived === "1";
  const [items, categories] = await Promise.all([
    listEquipment({ q: params.q, category: params.category, archived }),
    listCategories(true),
  ]);
  const canWrite = hasPermission(session.permissions, PERMISSIONS.equipmentWrite);

  return (
    <>
      <MasterHero
        kicker="Available"
        title="Equipment"
        icon={Boxes}
        action={canWrite ? { href: "/manage/equipment/new", label: "Add our equipment" } : undefined}
      />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Equipment suppliers can provide, with their details, and equipment Peakfront owns.
      </p>
      <div>
          <Flash error={params.error} />
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <form action="/manage/equipment" className="grid w-full gap-3 sm:flex-1 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
              {archived && <input type="hidden" name="archived" value="1" />}
              <input name="q" defaultValue={params.q ?? ""} placeholder="Search name, code, or capacity" className={fieldClass} />
              <select name="category" defaultValue={params.category ?? ""} className={fieldClass}>
                <option value="">All categories</option>
                {categories.filter((category) => !category.parentId && !category.archivedAt).map((category) => {
                  const types = categories.filter((type) => type.parentId === category.id && !type.archivedAt);
                  return (
                    <optgroup key={category.id} label={category.name}>
                      <option value={category.id}>All {category.name}</option>
                      {types.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              <button className={buttonClass} type="submit">Search</button>
            </form>
            <div className="flex gap-4 text-sm">
              <Link href={archived ? "/manage/equipment" : "/manage/equipment?archived=1"} className="font-semibold text-blue hover:underline">
                {archived ? "Active" : "Archived"}
              </Link>
            </div>
          </div>
          <DataCard>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Main category</th>
                    <th className="px-4 py-3">Equipment</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Suppliers</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td className="px-4 py-8 text-slate-500" colSpan={6}>No equipment matches this search.</td></tr>
                  ) : items.map((item) => {
                    const equipmentName = item.typeName || item.name;
                    const alias = [item.name, item.code]
                      .filter((part, index, all) => Boolean(part) && part.toLowerCase() !== equipmentName.toLowerCase() && part.toLowerCase() !== item.sizeName.toLowerCase() && all.findIndex((entry) => entry.toLowerCase() === part.toLowerCase()) === index)
                      .join(" · ");
                    const capacity = item.sizeName && item.sizeName.toLowerCase() !== equipmentName.toLowerCase()
                      ? item.sizeName
                      : item.capacity && item.capacity.toLowerCase() !== equipmentName.toLowerCase()
                        ? item.capacity
                        : "—";
                    const source = ownershipLabel(item.ownership);
                    return (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-700">{item.purposeName || "—"}</td>
                      <td className="px-4 py-3">
                        <Link href={`/manage/equipment/${item.id}`} className="font-semibold text-navy hover:text-blue">{equipmentName}</Link>
                        {alias && <span className="mt-0.5 block text-xs text-slate-500">{alias}</span>}
                      </td>
                      <td className="px-4 py-3 font-medium text-navy">{capacity}</td>
                      <td className="px-4 py-3 text-slate-600">{source}</td>
                      <td className="px-4 py-3">
                        {item.suppliers.length === 0 ? (
                          <span className="text-slate-500">None</span>
                        ) : item.suppliers.length === 1 ? (
                          <>
                            <Link href={`/manage/suppliers/${item.suppliers[0].id}`} className="font-semibold text-blue hover:underline">
                              {item.suppliers[0].name}
                            </Link>
                            {item.suppliers[0].phone && <span className="mt-0.5 block text-xs text-slate-500">{item.suppliers[0].phone}</span>}
                          </>
                        ) : (
                          <Link href={`/manage/equipment/${item.id}?section=suppliers#suppliers`} className="font-semibold text-blue hover:underline">
                            {item.suppliers.length} suppliers
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">{item.status}</span></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DataCard>
      </div>
    </>
  );
}
