import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Search } from "lucide-react";
import { SupplierCatalogue, SupplierViewSwitch, supplierView, type SupplierView } from "@/components/manage/erp/SupplierCatalogue";
import { ExportLink, Flash, MasterHero } from "@/components/manage/erp/ui";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { equipmentGroups, listEquipmentOptions } from "@/lib/erp/equipment";
import { listSuppliers } from "@/lib/erp/suppliers";
import { EMIRATES } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Suppliers", robots: { index: false, follow: false } };

const filterClass =
  "h-9 w-full rounded-lg border border-white/70 bg-white px-3 text-sm text-navy outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/40";

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; region?: string; equipment?: string; archived?: string; view?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.suppliersRead);
  const params = await searchParams;
  const archived = params.archived === "1";
  const partyType = params.type === "individual" || params.type === "company" ? params.type : "";
  const region = (EMIRATES as readonly string[]).includes(params.region ?? "") ? params.region ?? "" : "";
  const view = supplierView(params.view);
  const equipment = await listEquipmentOptions();
  const equipmentId = equipment.some((item) => item.id === params.equipment) ? params.equipment ?? "" : "";
  const suppliers = await listSuppliers({ q: params.q, archived, partyType, region, equipmentId });
  const canWrite = hasPermission(session.permissions, PERMISSIONS.suppliersWrite);
  const supplierHref = (nextView: SupplierView, nextArchived: boolean) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (partyType) query.set("type", partyType);
    if (region) query.set("region", region);
    if (equipmentId) query.set("equipment", equipmentId);
    if (nextArchived) query.set("archived", "1");
    if (nextView !== "cards") query.set("view", nextView);
    const text = query.toString();
    return text ? `/dashboard/suppliers?${text}` : "/dashboard/suppliers";
  };
  const hrefFor = (next: SupplierView) => supplierHref(next, archived);
  const archiveHref = supplierHref(view, !archived);
  const supplierExport = () => {
    const query = new URLSearchParams({ kind: "suppliers" });
    if (params.q) query.set("q", params.q);
    if (partyType) query.set("type", partyType);
    if (region) query.set("region", region);
    if (equipmentId) query.set("equipment", equipmentId);
    if (archived) query.set("archived", "1");
    return `/api/erp/export?${query}`;
  };

  return (
    <>
      <MasterHero kicker="Catalogue" title="Suppliers" icon={Building2} action={canWrite ? { href: "/dashboard/suppliers/new", label: "Add supplier" } : undefined} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Individuals and companies, with the equipment they can provide.
      </p>
      <Flash error={params.error} />
      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-col gap-3 bg-navy px-4 py-3 xl:flex-row xl:items-center">
          <p className="shrink-0 text-sm text-white/80">
            <span className="font-semibold text-white">{suppliers.length}</span>{" "}
            {suppliers.length === 1 ? "supplier" : "suppliers"}
          </p>
          <SupplierViewSwitch view={view} hrefFor={hrefFor} />
          <form action="/dashboard/suppliers" className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(8rem,1fr)_8rem_9.5rem_minmax(9rem,1.15fr)_auto]">
            {archived && <input type="hidden" name="archived" value="1" />}
            {view !== "cards" && <input type="hidden" name="view" value={view} />}
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input name="q" defaultValue={params.q ?? ""} placeholder="Search" aria-label="Search name, phone, or email" className={`${filterClass} pl-9`} />
            </div>
            <select name="type" defaultValue={partyType} aria-label="Type" className={filterClass}>
              <option value="">All types</option>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
            <select name="region" defaultValue={region} aria-label="Region" className={filterClass}>
              <option value="">All regions</option>
              {EMIRATES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select name="equipment" defaultValue={equipmentId} aria-label="Equipment" className={filterClass}>
              <option value="">All equipment</option>
              {equipmentGroups(equipment).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </optgroup>
              ))}
            </select>
            <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber/90 sm:col-span-2 xl:col-span-1" type="submit">Search</button>
          </form>
          <ExportLink href={supplierExport()} />
          <Link href={archiveHref} className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-white/25 px-3 text-sm font-medium text-white hover:bg-white/10">
            {archived ? "Active" : "Archived"}
          </Link>
        </div>
        <SupplierCatalogue items={suppliers} view={view} />
      </div>
    </>
  );
}
