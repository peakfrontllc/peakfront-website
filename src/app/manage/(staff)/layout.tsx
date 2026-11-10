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
    hasPermission(session.permissions, PERMISSIONS.equipmentRead)
      ? { href: "/manage/categories", label: "Categories", group: "Catalogue" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.equipmentRead)
      ? { href: "/manage/equipment", label: "Equipment", group: "Catalogue" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.suppliersRead)
      ? { href: "/manage/suppliers", label: "Suppliers", group: "Sourcing" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.ratesRead)
      ? { href: "/manage/rates", label: "Rates", group: "Sourcing" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.clientsRead)
      ? { href: "/manage/clients", label: "Clients", group: "Customers" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.websiteProjectsRead)
      ? { href: "/manage", label: "Projects", group: "Workspace" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.staffRead)
      ? { href: "/manage/staff", label: "Staff", group: "Workspace" }
      : null,
    { href: "/manage/account", label: "Account", group: "Workspace" },
  ].filter((item): item is { href: string; label: string; group: string } => Boolean(item));

  return (
    <DashboardShell items={items} fullName={session.fullName} roleName={session.roleName}>
      {children}
    </DashboardShell>
  );
}
