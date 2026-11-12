import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, Search } from "lucide-react";
import { ClientCatalogue, ClientViewSwitch, clientView, type ClientView } from "@/components/manage/erp/ClientCatalogue";
import { ListPagination } from "@/components/manage/erp/ListPagination";
import { ExportLink, Flash, MasterHero } from "@/components/manage/erp/ui";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listClients } from "@/lib/erp/clients";
import { currentPage, pageSlice } from "@/lib/erp/pagination";
import { matchesSearch } from "@/lib/erp/search";
import { EMIRATES } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Clients", robots: { index: false, follow: false } };

const filterClass =
  "h-9 w-full rounded-lg border border-white/70 bg-white px-3 text-sm text-navy outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/40";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string; industry?: string; archived?: string; view?: string; page?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.clientsRead);
  const params = await searchParams;
  const archived = params.archived === "1";
  const view = clientView(params.view);
  const loaded = await listClients({ archived });
  const industries = [...new Set(loaded.map((client) => client.industry).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const region = (EMIRATES as readonly string[]).includes(params.region ?? "") ? params.region ?? "" : "";
  const industry = industries.includes(params.industry ?? "") ? params.industry ?? "" : "";
  const clients = loaded.filter((client) => {
    if (region && client.emirate && client.emirate !== region) return false;
    if (industry && client.industry !== industry) return false;
    return matchesSearch(params.q ?? "", [client.companyName, client.industry, client.phone, client.email, client.website, client.emirate, client.contactName, client.contactTitle]);
  });
  const page = currentPage(params.page, clients.length);
  const visibleClients = pageSlice(clients, page);
  const canWrite = hasPermission(session.permissions, PERMISSIONS.clientsWrite);
  const clientHref = (nextView: ClientView, nextArchived: boolean, nextPage = 1) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (region) query.set("region", region);
    if (industry) query.set("industry", industry);
    if (nextArchived) query.set("archived", "1");
    if (nextView !== "cards") query.set("view", nextView);
    if (nextPage > 1) query.set("page", String(nextPage));
    const text = query.toString();
    return text ? `/dashboard/clients?${text}` : "/dashboard/clients";
  };
  const clientExport = () => {
    const query = new URLSearchParams({ kind: "clients" });
    if (params.q) query.set("q", params.q);
    if (region) query.set("region", region);
    if (industry) query.set("industry", industry);
    if (archived) query.set("archived", "1");
    return `/api/erp/export?${query}`;
  };

  return (
    <>
      <MasterHero kicker="Customers" title="Clients" icon={Handshake} action={canWrite ? { href: "/dashboard/clients/new", label: "Add client" } : undefined} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Companies that hire equipment, with the machines they regularly need.
      </p>
      <Flash error={params.error} />
      <div className="rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-col gap-3 bg-navy px-4 py-3 xl:flex-row xl:items-center">
          <p className="shrink-0 text-sm text-white/80">
            <span className="font-semibold text-white">{clients.length}</span>{" "}
            {clients.length === 1 ? "client" : "clients"}
          </p>
          <ClientViewSwitch view={view} hrefFor={(next) => clientHref(next, archived, page)} />
          <form action="/dashboard/clients" className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(8rem,1fr)_11rem_minmax(8rem,1fr)_auto]">
            {archived && <input type="hidden" name="archived" value="1" />}
            {view !== "cards" && <input type="hidden" name="view" value={view} />}
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input name="q" defaultValue={params.q ?? ""} placeholder="Search" aria-label="Search clients" className={`${filterClass} pl-9`} />
            </div>
            <select name="region" defaultValue={region} aria-label="Region" className={filterClass}>
              <option value="">All regions</option>
              {EMIRATES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select name="industry" defaultValue={industry} aria-label="Industry" className={filterClass}>
              <option value="">All industries</option>
              {industries.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-amber px-3 text-sm font-semibold text-navy hover:bg-amber/90 sm:col-span-2 xl:col-span-1" type="submit">Search</button>
          </form>
          <ExportLink href={clientExport()} />
          <Link href={clientHref(view, !archived)} className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-white/25 px-3 text-sm font-medium text-white hover:bg-white/10">
            {archived ? "Active" : "Archived"}
          </Link>
        </div>
        <ClientCatalogue items={visibleClients} view={view} />
        <ListPagination page={page} total={clients.length} hrefFor={(nextPage) => clientHref(view, archived, nextPage)} />
      </div>
    </>
  );
}
