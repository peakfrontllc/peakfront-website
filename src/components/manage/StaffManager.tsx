"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Search, UserRound } from "lucide-react";
import {
  changeStaffRole,
  inviteStaff,
  resendStaffAccess,
  setStaffStatus,
  type FormState,
} from "@/lib/auth/actions";
import type { StaffMember, StaffRoleOption } from "@/lib/auth/staff-directory";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";

function Notice({ state }: { state: FormState | undefined }) {
  if (!state?.error && !state?.message) return null;
  return state.error ? (
    <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {state.error}
    </p>
  ) : (
    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
      <p>{state.message}</p>
      {state.link && (
        <a href={state.link} className="mt-2 inline-flex font-semibold text-navy underline">
          Open sign-in link
        </a>
      )}
    </div>
  );
}

function statusLabel(status: StaffMember["status"]) {
  if (status === "invited") return "Invited";
  if (status === "disabled") return "Disabled";
  return "Active";
}

function statusClass(status: StaffMember["status"]) {
  if (status === "invited") return "bg-amber/15 text-amber-800";
  if (status === "disabled") return "bg-slate-100 text-slate-500";
  return "bg-emerald-50 text-emerald-700";
}

export function StaffManager({
  members,
  roles,
  currentUserId,
  canInvite,
  canAssignRoles,
  canDisable,
}: {
  members: StaffMember[];
  roles: StaffRoleOption[];
  currentUserId: string;
  canInvite: boolean;
  canAssignRoles: boolean;
  canDisable: boolean;
}) {
  const [inviteState, inviteAction, invitePending] = useActionState<FormState | undefined, FormData>(inviteStaff, undefined);
  const [query, setQuery] = useState("");
  const inviteRoles = roles.filter((role) => canAssignRoles || role.key !== "super_admin");
  const term = query.trim().toLowerCase();
  const shown = members.filter((member) => {
    if (!term) return true;
    return `${member.fullName} ${member.email} ${member.roleName} ${statusLabel(member.status)}`.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {canInvite && (
        <section className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
          <h2 className="flex items-center gap-2.5 bg-navy px-5 py-3 text-sm font-semibold text-white">
            <span className="h-4 w-1 rounded-full bg-amber" aria-hidden />
            Invite staff
          </h2>
          <form action={inviteAction} className="p-5">
            <p className="max-w-2xl text-sm text-slate-500">
              After you send the invitation, open the sign-in link on this computer. The email from Supabase opens the public website and cannot sign anyone in.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="fullName">Name</label>
                <input id="fullName" name="fullName" required className={fieldClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required className={fieldClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="role">Role</label>
                <select id="role" name="role" required className={fieldClass} defaultValue="admin">
                  {inviteRoles.map((role) => (
                    <option key={role.id} value={role.key}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <Notice state={inviteState} />
            <button type="submit" disabled={invitePending} className={`${buttonClass} mt-5`}>
              {invitePending ? "Sending…" : "Send invitation"}
            </button>
          </form>
        </section>
      )}

      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-sm">
        <div className="flex flex-col gap-3 bg-navy px-4 py-3 sm:flex-row sm:items-center">
          <p className="shrink-0 text-sm text-white/80">
            <span className="font-semibold text-white">{shown.length}</span> {shown.length === 1 ? "person" : "people"}
          </p>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, or role"
              aria-label="Search staff"
              className="h-9 w-full rounded-lg border border-white/70 bg-white pl-9 pr-3 text-sm text-navy outline-none focus:border-amber focus:ring-2 focus:ring-amber/40"
            />
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="bg-[#eef2f6] px-4 py-10 text-sm text-slate-500">No staff match this search.</p>
        ) : (
          <ul className="divide-y divide-slate-200 bg-white">
            {shown.map((member) => (
              <StaffRow
                key={member.id}
                member={member}
                roles={roles}
                isSelf={member.id === currentUserId}
                canAssignRoles={canAssignRoles}
                canDisable={canDisable}
                canInvite={canInvite}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StaffRow({
  member,
  roles,
  isSelf,
  canAssignRoles,
  canDisable,
  canInvite,
}: {
  member: StaffMember;
  roles: StaffRoleOption[];
  isSelf: boolean;
  canAssignRoles: boolean;
  canDisable: boolean;
  canInvite: boolean;
}) {
  const [roleState, roleAction, rolePending] = useActionState<FormState | undefined, FormData>(changeStaffRole, undefined);
  const [statusState, statusAction, statusPending] = useActionState<FormState | undefined, FormData>(setStaffStatus, undefined);
  const [linkState, linkAction, linkPending] = useActionState<FormState | undefined, FormData>(resendStaffAccess, undefined);
  const nextStatus = member.status === "disabled" ? "active" : "disabled";
  const initial = member.fullName.trim().charAt(0).toUpperCase() || "?";

  return (
    <li className="px-4 py-4 transition hover:bg-amber/15">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-semibold text-white">
            {initial === "?" ? <UserRound className="h-4 w-4" aria-hidden /> : initial}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-navy">{member.fullName}</h2>
              {isSelf && <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy">You</span>}
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClass(member.status)}`}>{statusLabel(member.status)}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{member.roleName}</span>
            </div>
            <p className="mt-1 truncate text-sm text-slate-600">{member.email}</p>
            <p className="mt-1 text-xs text-slate-400">
              {member.lastLoginAt
                ? `Last sign-in ${new Date(member.lastLoginAt).toLocaleString("en-AE")}`
                : "Has not signed in"}
            </p>
            {member.status === "invited" && (
              <p className="mt-2 max-w-xl text-xs text-amber-800">
                The public website link is expired. Send a sign-in link and open it on this computer, then choose a password for {member.email}.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          {canAssignRoles && (
            <form action={roleAction} className="flex items-end gap-2">
              <input type="hidden" name="staffId" value={member.id} />
              <div>
                <label className={labelClass} htmlFor={`role-${member.id}`}>Role</label>
                <select
                  id={`role-${member.id}`}
                  name="role"
                  defaultValue={member.roleKey}
                  className="mt-1.5 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-navy outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.key}>{role.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={rolePending} className={buttonClass}>
                {rolePending ? "Saving…" : "Save role"}
              </button>
            </form>
          )}
          {canInvite && member.status === "invited" && (
            <form action={linkAction}>
              <input type="hidden" name="staffId" value={member.id} />
              <button type="submit" disabled={linkPending} className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-semibold text-navy hover:border-navy disabled:opacity-60">
                {linkPending ? "Sending…" : "Send sign-in link"}
              </button>
            </form>
          )}
          {canDisable && !isSelf && (
            <form action={statusAction}>
              <input type="hidden" name="staffId" value={member.id} />
              <input type="hidden" name="status" value={nextStatus} />
              <button
                type="submit"
                disabled={statusPending}
                className={`inline-flex h-9 cursor-pointer items-center rounded-lg border px-3 text-sm font-semibold disabled:opacity-60 ${nextStatus === "disabled" ? "border-red-200 bg-white text-red-700 hover:bg-red-50" : "border-navy/15 bg-white text-navy hover:border-navy"}`}
              >
                {statusPending ? "Saving…" : nextStatus === "disabled" ? "Disable" : "Enable"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Notice state={roleState} />
      <Notice state={statusState} />
      <Notice state={linkState} />
    </li>
  );
}
