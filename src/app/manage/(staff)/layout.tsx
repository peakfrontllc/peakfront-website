import { StaffNav } from "@/components/manage/StaffNav";
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
    hasPermission(session.permissions, PERMISSIONS.websiteProjectsRead)
      ? { href: "/manage", label: "Projects" }
      : null,
    hasPermission(session.permissions, PERMISSIONS.staffRead)
      ? { href: "/manage/staff", label: "Staff" }
      : null,
    { href: "/manage/account", label: "Account" },
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <>
      <StaffNav items={items} fullName={session.fullName} roleName={session.roleName} />
      {children}
    </>
  );
}
