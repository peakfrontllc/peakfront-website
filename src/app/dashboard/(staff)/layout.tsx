import { DashboardShell } from "@/components/manage/DashboardShell";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requireStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaff();
  const items = [
    { href: "/dashboard", label: "Dashboard", group: "Overview" },
    hasPermission(session.permissions, PERMISSIONS.equipmentRead)
      ? { href: "/dashboard/categories", label: "Categories", group: "Catalogue" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.equipmentRead)
      ? { href: "/dashboard/equipment", label: "Equipment", group: "Catalogue" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.suppliersRead)
      ? { href: "/dashboard/suppliers", label: "Suppliers", group: "Catalogue" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.ratesRead)
      ? { href: "/dashboard/rates", label: "Rates", group: "Catalogue" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.clientsRead)
      ? { href: "/dashboard/clients", label: "Clients", group: "Customers" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.websiteProjectsRead)
      ? { href: "/dashboard/projects", label: "Projects", group: "Website" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.staffRead)
      ? { href: "/dashboard/staff", label: "Staff", group: "Workspace" }
      : null,
    { href: "/dashboard/account", label: "Account", group: "Workspace" },
  ].filter((item): item is { href: string; label: string; group: string } => Boolean(item));

  return (
    <DashboardShell items={items} fullName={session.fullName} roleName={session.roleName}>
      {children}
    </DashboardShell>
  );
}
