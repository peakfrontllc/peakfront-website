import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search, Truck } from "lucide-react";
import {
  SupplierEquipmentCatalogue,
  SupplierEquipmentViewSwitch,
  supplierEquipmentView,
  type SupplierEquipmentView,
} from "@/components/manage/erp/SupplierEquipmentCatalogue";
import { Flash, MasterHero } from "@/components/manage/erp/ui";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listEquipmentOptions } from "@/lib/erp/equipment";
import { matchesSearch } from "@/lib/erp/search";
import { getSupplier } from "@/lib/erp/suppliers";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Supplier equipment", robots: { index: false, follow: false } };

const filterClass =
  "h-9 w-full rounded-lg border border-white/70 bg-white px-3 text-sm text-navy outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/40";

export default async function SupplierEquipmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; view?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.suppliersRead);
  const { id } = await params;
  const query = await searchParams;
  const [supplier, options] = await Promise.all([getSupplier(id), listEquipmentOptions()]);
  if (!supplier) notFound();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.suppliersWrite);
  const canRates = hasPermission(session.permissions, PERMISSIONS.ratesWrite);
  const view = supplierEquipmentView(query.view);
  const optionById = new Map(options.map((item) => [item.id, item]));
  const items = supplier.equipment
    .map((item) => {
      const option = optionById.get(item.equipmentId);
      const current = item.rates.find((rate) => rate.current) ?? item.rates[0];
      return {
        id: item.id,
        equipmentId: item.equipmentId,
        name: option?.label ?? item.equipmentName,
        group: option?.group ?? "",
        detail: option?.detail ?? "",
        typeName: option?.typeName ?? item.equipmentName,
        leadTime: item.leadTime,
        notes: item.notes,
        daily: current?.dailyRate ?? null,
        weekly: current?.weeklyRate ?? null,
        monthly: current?.monthlyRate ?? null,
        rates: item.rates,
      };
    })
    .filter((item) => matchesSearch(query.q ?? "", [item.name, item.group, item.detail, item.typeName, item.leadTime, item.notes]));
  const hrefFor = (next: SupplierEquipmentView) => {
    const nextQuery = new URLSearchParams();
    if (query.q) nextQuery.set("q", query.q);
    if (next !== "cards") nextQuery.set("view", next);
    const text = nextQuery.toString();
    return text ? `/dashboard/suppliers/${supplier.id}/equipment?${text}` : `/dashboard/suppliers/${supplier.id}/equipment`;
  };

  return (
    <>
      <MasterHero kicker="Supplier" title="Available equipment" icon={Truck} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        <Link href={`/dashboard/suppliers/${supplier.id}`} className="font-semibold text-navy hover:text-blue">{supplier.companyName}</Link>
        {" · "}
        {canWrite || canRates ? "View and edit lead time and rates. " : ""}
        {supplier.equipment.length} {supplier.equipment.length === 1 ? "machine" : "machines"}
      </p>
      <Flash error={query.error} />
      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-col gap-3 bg-navy px-4 py-3 xl:flex-row xl:items-center">
          <p className="shrink-0 text-sm text-white/80">
            <span className="font-semibold text-white">{items.length}</span>{" "}
            {items.length === 1 ? "machine" : "machines"}
          </p>
          <SupplierEquipmentViewSwitch view={view} hrefFor={hrefFor} />
          <form action={`/dashboard/suppliers/${supplier.id}/equipment`} className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(8rem,1fr)_auto]">
            {view !== "cards" && <input type="hidden" name="view" value={view} />}
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                name="q"
                defaultValue={query.q ?? ""}
                placeholder="Search"
                aria-label="Search equipment"
                className={`${filterClass} pl-9`}
              />
            </label>
            <button type="submit" className="h-9 rounded-lg bg-amber px-4 text-sm font-semibold text-navy">Search</button>
          </form>
        </div>
        {supplier.equipment.length === 0 ? (
          <p className="bg-white px-4 py-8 text-sm text-slate-500">No equipment is linked yet.</p>
        ) : (
          <SupplierEquipmentCatalogue
            items={items}
            view={view}
            supplierId={supplier.id}
            canWrite={canWrite}
            canRates={canRates}
          />
        )}
      </div>
    </>
  );
}
