import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, Search } from "lucide-react";
import { ListPagination } from "@/components/manage/erp/ListPagination";
import { MarketRateCatalogue } from "@/components/manage/erp/MarketRates";
import { RatesViewSwitch } from "@/components/manage/erp/RatesTable";
import { Flash, MasterHero } from "@/components/manage/erp/ui";
import { labelClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listMarketRates } from "@/lib/erp/market-rates";
import { currentPage, pageSlice } from "@/lib/erp/pagination";
import { matchesSearch } from "@/lib/erp/search";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "General rates", robots: { index: false, follow: false } };

const controlClass =
  "mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-navy outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/40";

export default async function MarketRatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; purpose?: string; status?: string; view?: string; page?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.ratesRead);
  const params = await searchParams;
  const rates = await listMarketRates();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.ratesWrite);
  const view = params.view === "list" || params.view === "table" ? params.view : "cards";
  const purposes = [...new Set(rates.map((rate) => rate.purposeName).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const purpose = purposes.includes(params.purpose ?? "") ? params.purpose ?? "" : "";
  const status = params.status === "noted" || params.status === "empty" ? params.status : "";
  const visible = rates.filter((rate) => {
    if (purpose && rate.purposeName !== purpose) return false;
    if (status === "noted" && !rate.hasRate) return false;
    if (status === "empty" && rate.hasRate) return false;
    return matchesSearch(params.q ?? "", [rate.purposeName, rate.typeName, rate.sizeName, rate.boomLength, rate.bedLength, rate.notes]);
  });
  const page = currentPage(params.page, visible.length);
  const visibleRates = pageSlice(visible, page);
  const hrefFor = (next: "cards" | "list" | "table", nextPage = 1) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (purpose) query.set("purpose", purpose);
    if (status) query.set("status", status);
    if (next !== "cards") query.set("view", next);
    if (nextPage > 1) query.set("page", String(nextPage));
    const text = query.toString();
    return text ? `/dashboard/rates/market?${text}` : "/dashboard/rates/market";
  };
  const noted = rates.filter((rate) => rate.hasRate).length;
  const filtered = Boolean(params.q || purpose || status);
  const clearHref = view === "cards" ? "/dashboard/rates/market" : `/dashboard/rates/market?view=${view}`;

  return (
    <>
      <MasterHero kicker="Pricing" title="General rates" icon={Receipt} action={{ href: "/dashboard/rates", label: "Supplier rates" }} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        A market note for each machine: day, week, and month. These figures stay separate from the prices a supplier charges.
        {" "}
        <span className="font-semibold text-navy">{noted}</span> of {rates.length} machines have a note.
      </p>
      <Flash error={params.error} />
      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-4 py-3">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-white">{visible.length}</span>{" "}
            {visible.length === 1 ? "machine" : "machines"}
          </p>
          <RatesViewSwitch
            view={view}
            hrefs={{ cards: hrefFor("cards", page), list: hrefFor("list", page), table: hrefFor("table", page) }}
          />
        </div>
        <form action="/dashboard/rates/market" className="border-b border-navy/10 bg-[#f4f7fa] px-4 py-3">
          {view !== "cards" && <input type="hidden" name="view" value={view} />}
          <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className={labelClass}>Equipment</span>
              <span className="relative mt-1 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input name="q" defaultValue={params.q ?? ""} placeholder="Name, size, or note" aria-label="Search equipment" className={`${controlClass} mt-0 pl-9`} />
              </span>
            </label>
            <label className="block">
              <span className={labelClass}>Category</span>
              <select name="purpose" defaultValue={purpose} aria-label="Category" className={controlClass}>
                <option value="">All categories</option>
                {purposes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Status</span>
              <select name="status" defaultValue={status} aria-label="General rate status" className={controlClass}>
                <option value="">All machines</option>
                <option value="noted">Has a general rate</option>
                <option value="empty">No general rate</option>
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
        <MarketRateCatalogue rates={visibleRates} canWrite={canWrite} view={view} returnTo={hrefFor(view, page)} />
        <ListPagination page={page} total={visible.length} hrefFor={(nextPage) => hrefFor(view, nextPage)} />
      </div>
    </>
  );
}
