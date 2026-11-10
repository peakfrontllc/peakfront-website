"use client";

import { useActionState } from "react";
import {
  changeStaffRole,
  inviteStaff,
  setStaffStatus,
  type FormState,
} from "@/lib/auth/actions";
import type { StaffMember, StaffRoleOption } from "@/lib/auth/staff-directory";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";

function Notice({ state }: { state: FormState | undefined }) {
  if (!state?.error && !state?.message) return null;
  return state.error ? (
    <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {state.error}
    </p>
  ) : (
    <p className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {state.message}
    </p>
  );
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
  const [inviteState, inviteAction, invitePending] = useActionState<
    FormState | undefined,
    FormData
  >(inviteStaff, undefined);

  const inviteRoles = roles.filter(
    (role) => canAssignRoles || role.key !== "super_admin",
  );

  return (
    <div className="space-y-8">
      {canInvite && (
        <form action={inviteAction} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-navy">Invite staff</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="fullName">
                Name
              </label>
              <input id="fullName" name="fullName" required className={fieldClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" required className={fieldClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="role">
                Role
              </label>
              <select id="role" name="role" required className={fieldClass} defaultValue="viewer">
                {inviteRoles.map((role) => (
                  <option key={role.id} value={role.key}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Notice state={inviteState} />
          <button type="submit" disabled={invitePending} className={`${buttonClass} mt-6`}>
            {invitePending ? "Sending…" : "Send invitation"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {members.map((member) => (
          <StaffRow
            key={member.id}
            member={member}
            roles={roles}
            isSelf={member.id === currentUserId}
            canAssignRoles={canAssignRoles}
            canDisable={canDisable}
          />
        ))}
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
}: {
  member: StaffMember;
  roles: StaffRoleOption[];
  isSelf: boolean;
  canAssignRoles: boolean;
  canDisable: boolean;
}) {
  const [roleState, roleAction, rolePending] = useActionState<
    FormState | undefined,
    FormData
  >(changeStaffRole, undefined);
  const [statusState, statusAction, statusPending] = useActionState<
    FormState | undefined,
    FormData
  >(setStaffStatus, undefined);
  const nextStatus = member.status === "disabled" ? "active" : "disabled";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-navy">{member.fullName}</h2>
          <p className="mt-1 text-sm text-slate-600">{member.email}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">
            {member.roleName} · {member.status}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {canAssignRoles && (
            <form action={roleAction} className="flex items-end gap-2">
              <input type="hidden" name="staffId" value={member.id} />
              <div>
                <label className={labelClass} htmlFor={`role-${member.id}`}>
                  Role
                </label>
                <select
                  id={`role-${member.id}`}
                  name="role"
                  defaultValue={member.roleKey}
                  className={fieldClass}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.key}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={rolePending} className={buttonClass}>
                {rolePending ? "Saving…" : "Save"}
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
                className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-navy hover:border-slate-300 disabled:opacity-60"
              >
                {statusPending
                  ? "Saving…"
                  : nextStatus === "disabled"
                    ? "Disable"
                    : "Enable"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Notice state={roleState} />
      <Notice state={statusState} />
    </article>
  );
}
