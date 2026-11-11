import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Search } from "lucide-react";
import { EquipmentSupplierCatalogue, EquipmentSupplierViewSwitch, equipmentSupplierView, type EquipmentSupplierView } from "@/components/manage/erp/EquipmentSupplierCards";
import { MasterHero } from "@/components/manage/erp/ui";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { getEquipment, listEquipmentSuppliers } from "@/lib/erp/equipment";
import { capacityLabel } from "@/lib/erp/lengths";
import { matchesSearch } from "@/lib/erp/search";
import { EMIRATES } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Equipment suppliers", robots: { index: false, follow: false } };

const filterClass =
  "h-9 w-full rounded-lg border border-white/70 bg-white px-3 text-sm text-navy outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/40";

export default async function EquipmentSuppliersPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; type?: string; region?: string; view?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.equipmentRead);
  const { id } = await params;
  const query = await searchParams;
  const [equipment, suppliers] = await Promise.all([
    getEquipment(id),
    listEquipmentSuppliers(id),
  ]);
  if (!equipment) notFound();
  const canRates = hasPermission(session.permissions, PERMISSIONS.ratesRead);
  const partyType = query.type === "individual" || query.type === "company" ? query.type : "";
  const region = (EMIRATES as readonly string[]).includes(query.region ?? "") ? query.region ?? "" : "";
  const view = equipmentSupplierView(query.view);
  const visible = suppliers.filter((supplier) => {
    if (partyType && supplier.partyType !== partyType) return false;
    if (region && !supplier.emirate.split(",").map((item) => item.trim()).includes(region)) return false;
    return matchesSearch(query.q ?? "", [
      supplier.supplierName,
      supplier.phone,
      supplier.email,
      supplier.ownerName,
      supplier.contactTitle,
      supplier.emirate,
    ]);
  });
  const capacity = equipment.capacity && equipment.capacity.toLowerCase() !== equipment.name.toLowerCase()
    ? capacityLabel(equipment.capacity)
    : "";
  const hrefFor = (next: EquipmentSupplierView) => {
    const nextQuery = new URLSearchParams();
    if (query.q) nextQuery.set("q", query.q);
    if (partyType) nextQuery.set("type", partyType);
    if (region) nextQuery.set("region", region);
    if (next !== "cards") nextQuery.set("view", next);
    const text = nextQuery.toString();
    return text ? `/dashboard/equipment/${equipment.id}/suppliers?${text}` : `/dashboard/equipment/${equipment.id}/suppliers`;
  };

  return (
    <>
      <MasterHero kicker="Equipment" title="Suppliers" icon={Building2} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        <Link href={`/dashboard/equipment/${equipment.id}`} className="font-semibold text-navy hover:text-blue">{equipment.name}</Link>
        {capacity ? ` · ${capacity}` : ""}
        {equipment.categoryName ? ` · ${equipment.categoryName}` : ""}
      </p>
      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-col gap-3 bg-navy px-4 py-3 xl:flex-row xl:items-center">
          <p className="shrink-0 text-sm text-white/80">
            <span className="font-semibold text-white">{visible.length}</span>{" "}
            {visible.length === 1 ? "supplier" : "suppliers"}
          </p>
          <EquipmentSupplierViewSwitch view={view} hrefFor={hrefFor} />
          <form action={`/dashboard/equipment/${equipment.id}/suppliers`} className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(8rem,1fr)_8rem_9.5rem_auto]">
            {view !== "cards" && <input type="hidden" name="view" value={view} />}
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input name="q" defaultValue={query.q ?? ""} placeholder="Search" aria-label="Search name, phone, or email" className={`${filterClass} pl-9`} />
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
            <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber/90 sm:col-span-2 xl:col-span-1" type="submit">Search</button>
          </form>
          {suppliers.length > 1 && canRates && (
            <Link href={`/dashboard/rates/compare?equipment=${equipment.id}`} className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-amber px-3 text-xs font-semibold text-navy hover:bg-amber/90">
              Compare rates
            </Link>
          )}
        </div>
        {suppliers.length === 0 ? (
          <p className="bg-[#eef2f6] px-4 py-10 text-sm text-slate-500">No supplier is linked yet.</p>
        ) : (
          <EquipmentSupplierCatalogue suppliers={visible} view={view} canRates={canRates} />
        )}
      </div>
    </>
  );
}
