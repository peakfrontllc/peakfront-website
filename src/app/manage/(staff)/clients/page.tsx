import type { Metadata } from "next";
import Link from "next/link";
import { Handshake } from "lucide-react";
import { DataCard, Flash, MasterHero } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listClients } from "@/lib/erp/clients";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Clients", robots: { index: false, follow: false } };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; archived?: string; error?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.clientsRead);
  const params = await searchParams;
  const archived = params.archived === "1";
  const clients = await listClients({ q: params.q, archived });
  const canWrite = hasPermission(session.permissions, PERMISSIONS.clientsWrite);

  return (
    <>
      <MasterHero kicker="CRM" title="Clients" icon={Handshake} action={canWrite ? { href: "/manage/clients/new", label: "Add client" } : undefined} />
      <div>
          <Flash error={params.error} />
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <form action="/manage/clients" className="grid w-full gap-3 sm:flex-1 sm:grid-cols-[1fr_auto] sm:items-end">
              {archived && <input type="hidden" name="archived" value="1" />}
              <input name="q" defaultValue={params.q ?? ""} placeholder="Search company, industry, phone, or emirate" className={fieldClass} />
              <button className={buttonClass} type="submit">Search</button>
            </form>
            <Link href={archived ? "/manage/clients" : "/manage/clients?archived=1"} className="text-sm font-semibold text-blue hover:underline">
              {archived ? "Active" : "Archived"}
            </Link>
          </div>
          <DataCard>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Industry</th>
                    <th className="px-4 py-3">Emirate</th>
                    <th className="px-4 py-3">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr><td className="px-4 py-8 text-slate-500" colSpan={4}>No clients match this search.</td></tr>
                  ) : clients.map((client) => (
                    <tr key={client.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3"><Link href={`/manage/clients/${client.id}`} className="font-semibold text-navy hover:text-blue">{client.companyName}</Link></td>
                      <td className="px-4 py-3 text-slate-600">{client.industry || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{client.emirate || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{client.phone || "—"}</td>
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
