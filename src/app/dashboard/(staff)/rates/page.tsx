import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, Search } from "lucide-react";
import { RatesCatalogue, RatesViewSwitch } from "@/components/manage/erp/RatesTable";
import { ListPagination } from "@/components/manage/erp/ListPagination";
import { ExportLink, Flash, MasterHero } from "@/components/manage/erp/ui";
import { labelClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { currentPage, pageSlice } from "@/lib/erp/pagination";
import { listCurrentRates } from "@/lib/erp/rates";
import { matchesSearch } from "@/lib/erp/search";
import { EMIRATES } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Supplier rates", robots: { index: false, follow: false } };

const controlClass =
  "mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-navy outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/40";

export default async function RatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; supplier?: string; purpose?: string; region?: string; status?: string; view?: string; page?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.ratesRead);
  const params = await searchParams;
  const rates = await listCurrentRates();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.ratesWrite);
  const view = params.view === "list" || params.view === "table" ? params.view : "cards";
  const purposes = [...new Set(rates.map((rate) => rate.purposeName).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const suppliers = [...new Map(rates.filter((rate) => rate.supplierId).map((rate) => [rate.supplierId, rate.supplierName])).entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const purpose = purposes.includes(params.purpose ?? "") ? params.purpose ?? "" : "";
  const supplierId = suppliers.some((item) => item.id === params.supplier) ? params.supplier ?? "" : "";
  const status = params.status === "rated" || params.status === "missing" ? params.status : "";
  const region = (EMIRATES as readonly string[]).includes(params.region ?? "") ? params.region ?? "" : "";
  const visible = rates.filter((rate) => {
    if (supplierId && rate.supplierId !== supplierId) return false;
    if (purpose && rate.purposeName !== purpose) return false;
    if (region && !rate.regions.includes(region)) return false;
    if (status === "rated" && !rate.hasRate) return false;
    if (status === "missing" && rate.hasRate) return false;
    return matchesSearch(params.q ?? "", [
      rate.purposeName,
      rate.typeName,
      rate.sizeName,
      rate.boomLength,
      rate.bedLength,
      rate.alias,
      rate.equipmentName,
      rate.supplierName,
      rate.place,
    ]);
  });
  const page = currentPage(params.page, visible.length);
  const visibleRates = pageSlice(visible, page);
  const hrefFor = (next: "cards" | "list" | "table", nextPage = 1) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (supplierId) query.set("supplier", supplierId);
    if (purpose) query.set("purpose", purpose);
    if (region) query.set("region", region);
    if (status) query.set("status", status);
    if (next !== "cards") query.set("view", next);
    if (nextPage > 1) query.set("page", String(nextPage));
    const text = query.toString();
    return text ? `/dashboard/rates?${text}` : "/dashboard/rates";
  };
  const viewHrefs = {
    cards: hrefFor("cards", page),
    list: hrefFor("list", page),
    table: hrefFor("table", page),
  };
  const ratesExport = () => {
    const query = new URLSearchParams({ kind: "rates" });
    if (params.q) query.set("q", params.q);
    if (supplierId) query.set("supplier", supplierId);
    if (purpose) query.set("purpose", purpose);
    if (region) query.set("region", region);
    if (status) query.set("status", status);
    return `/api/erp/export?${query}`;
  };
  const filtered = Boolean(params.q || supplierId || purpose || region || status);
  const clearHref = view === "cards" ? "/dashboard/rates" : `/dashboard/rates?view=${view}`;

  return (
    <>
      <MasterHero kicker="Pricing" title="Current supplier rates" icon={Receipt} action={{ href: "/dashboard/rates/compare", label: "Compare" }} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Each size keeps its own rate, including boom length and bed length.
      </p>
      <Flash error={params.error} />
      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-4 py-3">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">{visible.length}</span>{" "}
            {visible.length === 1 ? "rate" : "rates"}
          </p>
          <div className="flex items-center gap-2">
            <RatesViewSwitch view={view} hrefs={viewHrefs} />
            <ExportLink href={ratesExport()} />
          </div>
        </div>
        <form action="/dashboard/rates" className="border-b border-navy/10 bg-[#f4f7fa] px-4 py-3">
          {view !== "cards" && <input type="hidden" name="view" value={view} />}
          <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <label className="block">
              <span className={labelClass}>Equipment</span>
              <span className="relative mt-1 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input name="q" defaultValue={params.q ?? ""} placeholder="Name or size" aria-label="Search equipment or supplier" className={`${controlClass} mt-0 pl-9`} />
              </span>
            </label>
            <label className="block">
              <span className={labelClass}>Supplier</span>
              <select name="supplier" defaultValue={supplierId} aria-label="Supplier" className={controlClass}>
                <option value="">All suppliers</option>
                {suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Category</span>
              <select name="purpose" defaultValue={purpose} aria-label="Category" className={controlClass}>
                <option value="">All categories</option>
                {purposes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Region</span>
              <select name="region" defaultValue={region} aria-label="Region" className={controlClass}>
                <option value="">All regions</option>
                {EMIRATES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Status</span>
              <select name="status" defaultValue={status} aria-label="Rate status" className={controlClass}>
                <option value="">All rates</option>
                <option value="rated">Has a rate</option>
                <option value="missing">Missing a rate</option>
              </select>
            </label>
            <div className="flex gap-2">
              <button className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg bg-navy px-3 text-sm font-semibold text-white hover:bg-navy/90" type="submit">Search</button>
              {filtered && (
                <Link href={clearHref} className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-navy hover:border-amber">
                  Clear
                </Link>
              )}
            </div>
          </div>
        </form>
        <RatesCatalogue
          rates={visibleRates}
          canWrite={canWrite}
          view={view}
          filters={{ q: params.q ?? "", supplier: supplierId, purpose, region, status, view }}
        />
        <ListPagination page={page} total={visible.length} hrefFor={(nextPage) => hrefFor(view, nextPage)} />
      </div>
    </>
  );
}
