import type { Metadata } from "next";
import Link from "next/link";
import { ColumnChart, DonutChart, MiniRing, RegionChart, type ChartSlice } from "@/components/manage/erp/DashboardCharts";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requireStaff } from "@/lib/auth/session";
import { loadOperationsOverview } from "@/lib/erp/overview";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const session = await requireStaff();
  const overview = await loadOperationsOverview();
  const canEquipment = hasPermission(session.permissions, PERMISSIONS.equipmentRead);
  const canSuppliers = hasPermission(session.permissions, PERMISSIONS.suppliersRead);
  const canRates = hasPermission(session.permissions, PERMISSIONS.ratesRead);
  const canClients = hasPermission(session.permissions, PERMISSIONS.clientsRead);
  const canProjects = hasPermission(session.permissions, PERMISSIONS.websiteProjectsRead);
  const completedProjects = Math.max(overview.projects - overview.ongoingProjects, 0);
  const otherEquipment = Math.max(overview.equipment - overview.availableEquipment, 0);
  const mix: ChartSlice[] = [
    canEquipment ? { label: "Equipment", value: overview.equipment, color: "#f39c12" } : null,
    canSuppliers ? { label: "Suppliers", value: overview.suppliers, color: "#7eb6ff" } : null,
    canClients ? { label: "Clients", value: overview.clients, color: "#8fd3c8" } : null,
    canProjects ? { label: "Projects", value: overview.projects, color: "#f6c56b" } : null,
  ].filter((item): item is ChartSlice => Boolean(item));
  const mixTotal = mix.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-3xl bg-navy text-white shadow-sm">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">Operations</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 max-w-md text-sm text-white/65">
              A picture of the catalogue, the people who supply it, the clients, and the website projects.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {canEquipment && <MiniRing href="/dashboard/categories" label="Categories" value={overview.categories} total={Math.max(overview.categories, 1)} note="Catalogue groups" color="#f39c12" />}
              {canEquipment && <MiniRing href="/dashboard/equipment" label="Equipment" value={overview.equipment} total={mixTotal || overview.equipment} note={`${overview.availableEquipment} available`} color="#7eb6ff" />}
              {canSuppliers && <MiniRing href="/dashboard/suppliers" label="Suppliers" value={overview.suppliers} total={mixTotal || overview.suppliers} note="Active records" color="#8fd3c8" />}
              {canRates && <MiniRing href="/dashboard/rates" label="Open rates" value={overview.openRates} total={Math.max(overview.openRates, overview.equipment, 1)} note="Current prices" color="#f6c56b" />}
              {canClients && <MiniRing href="/dashboard/clients" label="Clients" value={overview.clients} total={mixTotal || overview.clients} note="Active customers" color="#d4760a" />}
              {canProjects && <MiniRing href="/dashboard/projects" label="Projects" value={overview.projects} total={mixTotal || overview.projects} note={`${overview.ongoingProjects} ongoing`} color="#ffffff" />}
            </div>
          </div>
          <div className="flex items-center rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <DonutChart slices={mix} center={String(mixTotal)} caption="Records" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        {canEquipment && (
          <section className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-navy">Equipment by category</h2>
              <Link href="/dashboard/equipment" className="text-xs font-semibold text-navy hover:text-blue">Open equipment</Link>
            </div>
            <ColumnChart items={overview.equipmentByPurpose} empty="No equipment yet." />
          </section>
        )}
        <div className="grid gap-4">
          {canEquipment && (
            <section className="rounded-3xl bg-navy p-5 text-white shadow-sm">
              <h2 className="text-sm font-semibold">Equipment ready to rent</h2>
              <div className="mt-3">
                <DonutChart
                  slices={[
                    { label: "Available", value: overview.availableEquipment, color: "#f39c12" },
                    { label: "Other status", value: otherEquipment, color: "#7eb6ff" },
                  ]}
                  center={String(overview.equipment)}
                  caption="Machines"
                />
              </div>
            </section>
          )}
          {canProjects && (
            <section className="rounded-3xl bg-[#12345c] p-5 text-white shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Website projects</h2>
                <Link href="/dashboard/projects" className="text-xs font-semibold text-amber hover:text-white">View all</Link>
              </div>
              <div className="mt-3">
                <DonutChart
                  slices={[
                    { label: "Ongoing", value: overview.ongoingProjects, color: "#f39c12" },
                    { label: "Completed", value: completedProjects, color: "#8fd3c8" },
                  ]}
                  center={String(overview.projects)}
                  caption="Projects"
                />
              </div>
            </section>
          )}
        </div>
      </div>

      {(canSuppliers || canClients) && (
        <section className="rounded-3xl border border-navy/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-navy">Where suppliers and clients are</h2>
          <RegionChart
            suppliers={canSuppliers ? overview.supplierRegions : []}
            clients={canClients ? overview.clientRegions : []}
          />
        </section>
      )}

      {canProjects && overview.recentProjects.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy">Latest projects</h2>
            <Link href="/dashboard/projects" className="text-xs font-semibold text-navy hover:text-blue">Open projects</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {overview.recentProjects.map((project) => (
              <li key={`${project.name}-${project.client}`} className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
                <div className={`h-1.5 ${project.status === "ongoing" ? "bg-amber" : "bg-navy"}`} />
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{project.status}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-navy">{project.name}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{[project.client, project.location].filter(Boolean).join(" · ") || "No client yet"}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
