import type { Metadata } from "next";
import { Users } from "lucide-react";
import { MasterHero } from "@/components/manage/erp/ui";
import { StaffManager } from "@/components/manage/StaffManager";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listRecentActivity, listRoles, listStaff } from "@/lib/auth/staff-directory";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false, follow: false },
};

export default async function StaffPage() {
  const session = await requirePermission(PERMISSIONS.staffRead);
  const [members, roles, activity] = await Promise.all([
    listStaff(),
    listRoles(),
    hasPermission(session.permissions, PERMISSIONS.activityRead)
      ? listRecentActivity()
      : Promise.resolve([]),
  ]);

  return (
    <>
      <MasterHero kicker="Workspace" title="Staff" icon={Users} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        People who can sign in. Open a new person’s sign-in link on this computer. The public website cannot accept it.
      </p>
      <div>
        <div className="space-y-8">
          <StaffManager
            members={members}
            roles={roles}
            currentUserId={session.userId}
            canInvite={hasPermission(session.permissions, PERMISSIONS.staffInvite)}
            canAssignRoles={hasPermission(session.permissions, PERMISSIONS.staffAssignRoles)}
            canDisable={hasPermission(session.permissions, PERMISSIONS.staffDisable)}
          />
          {hasPermission(session.permissions, PERMISSIONS.activityRead) && (
            <section className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
              <h2 className="flex items-center gap-2.5 bg-navy px-5 py-3 text-sm font-semibold text-white">
                <span className="h-4 w-1 rounded-full bg-amber" aria-hidden />
                Recent activity
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">When</th>
                      <th className="px-4 py-3 font-semibold">Who</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.length === 0 ? (
                      <tr>
                        <td className="px-4 py-4 text-slate-500" colSpan={3}>
                          No activity yet.
                        </td>
                      </tr>
                    ) : (
                      activity.map((entry) => (
                        <tr key={entry.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 text-slate-600">
                            {new Date(entry.createdAt).toLocaleString("en-AE")}
                          </td>
                          <td className="px-4 py-3 font-medium text-navy">{entry.actorName}</td>
                          <td className="px-4 py-3 text-slate-600">{activityLabel(entry.action)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function activityLabel(action: string) {
  const labels: Record<string, string> = {
    "auth.login": "Signed in",
    "auth.logout": "Signed out",
    "auth.password_updated": "Chose a password",
    "staff.invited": "Invited a staff member",
    "staff.invite_resent": "Sent a sign-in link",
    "staff.role_changed": "Changed a role",
    "staff.disabled": "Disabled a staff member",
    "staff.enabled": "Enabled a staff member",
  };
  return labels[action] ?? action.replaceAll(".", " ").replaceAll("_", " ");
}
