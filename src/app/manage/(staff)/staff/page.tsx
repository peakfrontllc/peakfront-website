import type { Metadata } from "next";
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
      <section className="bg-navy py-14 text-white sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Access
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Staff and permissions
          </h1>
        </div>
      </section>
      <section className="section-padding bg-slate-50">
        <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-5 lg:px-10">
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
              <h2 className="text-xl font-extrabold text-navy">Recent activity</h2>
              <div className="mt-4 overflow-x-auto border border-navy/10 bg-white">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-navy/10 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
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
      </section>
    </>
  );
}
