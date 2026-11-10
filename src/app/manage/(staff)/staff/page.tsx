import type { Metadata } from "next";
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
      <MasterHero kicker="Access" title="Staff" />
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
            <div>
              <h2 className="text-sm font-semibold text-navy">Recent activity</h2>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-bold">When</th>
                      <th className="px-4 py-3 font-bold">Who</th>
                      <th className="px-4 py-3 font-bold">Action</th>
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
                        <tr key={entry.id} className="border-b border-navy/5 last:border-0">
                          <td className="px-4 py-3 text-slate-600">
                            {new Date(entry.createdAt).toLocaleString("en-AE")}
                          </td>
                          <td className="px-4 py-3 text-navy">{entry.actorName}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">
                            {entry.action}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
