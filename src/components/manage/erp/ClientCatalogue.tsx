import Link from "next/link";
import { Handshake, LayoutGrid, List, Table2 } from "lucide-react";
import type { ClientListItem } from "@/lib/erp/clients";

export const CLIENT_VIEWS = ["cards", "list", "table"] as const;
export type ClientView = (typeof CLIENT_VIEWS)[number];

export function clientView(value: string | undefined): ClientView {
  return value === "list" || value === "table" ? value : "cards";
}

function interestLabel(count: number) {
  if (count === 0) return "No equipment yet";
  return count === 1 ? "1 machine" : `${count} machines`;
}

function ClientIcon() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
      <Handshake className="h-4 w-4" aria-hidden />
    </span>
  );
}

function DetailsLink({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/clients/${id}`} className="inline-flex h-7 shrink-0 items-center rounded-md bg-navy px-2.5 text-[11px] font-semibold text-white hover:bg-blue">
      View more details
    </Link>
  );
}

function ContactLine({ client }: { client: ClientListItem }) {
  if (!client.contactName) return null;
  return (
    <p className="text-xs text-navy">
      {client.contactTitle && <span className="text-slate-400">{client.contactTitle} </span>}
      {client.contactName}
    </p>
  );
}

export function ClientViewSwitch({
  view,
  hrefFor,
}: {
  view: ClientView;
  hrefFor: (view: ClientView) => string;
}) {
  const views = [
    { id: "cards" as const, label: "Cards", icon: LayoutGrid },
    { id: "list" as const, label: "List", icon: List },
    { id: "table" as const, label: "Table", icon: Table2 },
  ];
  return (
    <div className="view-switch flex shrink-0 rounded-lg bg-white/10 p-0.5">
      {views.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <Link
            key={item.id}
            href={hrefFor(item.id)}
            aria-label={`${item.label} view`}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold ${active ? "bg-white text-navy" : "text-white/75 hover:text-white"}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function ClientCatalogue({ items, view }: { items: ClientListItem[]; view: ClientView }) {
  if (items.length === 0) {
    return <p className="bg-[#eef2f6] px-4 py-10 text-sm text-slate-500">No clients match this search.</p>;
  }
  if (view === "list") {
    return (
      <ul className="divide-y divide-slate-200 bg-white">
        {items.map((client) => (
          <li key={client.id} className="flex flex-col gap-3 px-4 py-3 transition hover:bg-amber/15 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 gap-3">
              <ClientIcon />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{client.companyName}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{client.industry || "Client"}</p>
                <ContactLine client={client} />
              </div>
            </div>
            <p className="text-xs text-slate-500 lg:w-44">{[client.phone, client.emirate].filter(Boolean).join(" · ") || "No contact yet"}</p>
            <p className="text-xs text-slate-500 lg:w-28">{interestLabel(client.interestCount)}</p>
            <DetailsLink id={client.id} />
          </li>
        ))}
      </ul>
    );
  }
  if (view === "table") {
    return (
      <div className="overflow-x-auto bg-white">
        <table className="stack-table w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((client) => (
              <tr key={client.id} className="border-b border-slate-100 transition last:border-0 hover:bg-amber/15">
                <td className="px-4 py-3" data-label="Client">
                  <div className="flex items-center gap-3">
                    <ClientIcon />
                    <div>
                      <p className="font-semibold text-navy">{client.companyName}</p>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{client.industry || "Client"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-navy" data-label="Contact">{client.contactName || "—"}</td>
                <td className="px-4 py-3 text-slate-600" data-label="Phone">{client.phone || "—"}</td>
                <td className="px-4 py-3 text-slate-600" data-label="Region">{client.emirate || "—"}</td>
                <td className="px-4 py-3 break-all text-slate-600" data-label="Email">{client.email || "—"}</td>
                <td className="px-4 py-3 text-xs text-navy" data-label="Equipment">{interestLabel(client.interestCount)}</td>
                <td className="px-4 py-3 text-right" data-label=""><DetailsLink id={client.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <ul className="grid gap-3 bg-[#eef2f6] p-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((client) => (
        <li key={client.id}>
          <article className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-4 transition hover:border-amber hover:bg-amber/15">
            <div className="flex items-start gap-3">
              <ClientIcon />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{client.companyName}</p>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{client.industry || "Client"}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <ContactLine client={client} />
              <p>{[client.phone, client.emirate].filter(Boolean).join(" · ") || "No contact yet"}</p>
            </div>
            <p className="mt-3 text-[11px] font-medium text-slate-400">{interestLabel(client.interestCount)}</p>
            <div className="mt-3"><DetailsLink id={client.id} /></div>
          </article>
        </li>
      ))}
    </ul>
  );
}
