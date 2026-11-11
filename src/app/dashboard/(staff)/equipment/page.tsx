import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, Search } from "lucide-react";
import { EquipmentCatalogue, EquipmentViewSwitch, equipmentView, type EquipmentView } from "@/components/manage/erp/EquipmentCatalogue";
import { Flash, MasterHero } from "@/components/manage/erp/ui";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listCategories, listEquipment } from "@/lib/erp/equipment";
import { EMIRATES } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Equipment", robots: { index: false, follow: false } };

const filterClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-navy outline-none transition focus:border-navy/30 focus:ring-2 focus:ring-navy/10";

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; region?: string; archived?: string; view?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.equipmentRead);
  const params = await searchParams;
  const archived = params.archived === "1";
  const region = (EMIRATES as readonly string[]).includes(params.region ?? "") ? params.region ?? "" : "";
  const view = equipmentView(params.view);
  const hrefFor = (next: EquipmentView) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (region) query.set("region", region);
    if (archived) query.set("archived", "1");
    if (next !== "cards") query.set("view", next);
    const text = query.toString();
    return text ? `/dashboard/equipment?${text}` : "/dashboard/equipment";
  };
  const [items, categories] = await Promise.all([
    listEquipment({ q: params.q, category: params.category, region, archived }),
    listCategories(true),
  ]);
  const canWrite = hasPermission(session.permissions, PERMISSIONS.equipmentWrite);
  const archiveQuery = new URLSearchParams();
  if (!archived) archiveQuery.set("archived", "1");
  if (params.q) archiveQuery.set("q", params.q);
  if (params.category) archiveQuery.set("category", params.category);
  if (region) archiveQuery.set("region", region);
  if (view !== "cards") archiveQuery.set("view", view);
  const archiveHref = archiveQuery.size ? `/dashboard/equipment?${archiveQuery}` : "/dashboard/equipment";

  return (
    <>
      <MasterHero
        kicker="Catalogue"
        title="Equipment"
        icon={Boxes}
        action={canWrite ? { href: "/dashboard/equipment/new", label: "Add our equipment" } : undefined}
      />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Machines suppliers can provide, and equipment Peakfront owns.
      </p>
      <Flash error={params.error} />
      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-col gap-3 bg-navy px-4 py-3 lg:flex-row lg:items-center">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">{items.length}</span>{" "}
            {items.length === 1 ? "machine" : "machines"}
          </p>
          <EquipmentViewSwitch view={view} hrefFor={hrefFor} />
          <form action="/dashboard/equipment" className="grid flex-1 gap-2 sm:grid-cols-2 xl:ml-auto xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]">
            {archived && <input type="hidden" name="archived" value="1" />}
            {view !== "cards" && <input type="hidden" name="view" value={view} />}
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input name="q" defaultValue={params.q ?? ""} placeholder="Search, such as 65m manlift" aria-label="Search equipment" className={`${filterClass} pl-9`} />
            </div>
            <select name="region" defaultValue={region} aria-label="Supplier location" className={filterClass}>
              <option value="">All locations</option>
              {EMIRATES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select name="category" defaultValue={params.category ?? ""} aria-label="Category" className={filterClass}>
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
            <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber/90" type="submit">Search</button>
          </form>
          <Link href={archiveHref} className="inline-flex h-9 items-center justify-center rounded-lg border border-white/25 px-3 text-sm font-medium text-white hover:bg-white/10">
            {archived ? "Active" : "Archived"}
          </Link>
        </div>
        <EquipmentCatalogue items={items} view={view} />
      </div>
    </>
  );
}
