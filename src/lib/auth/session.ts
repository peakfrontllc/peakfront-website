import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { usesPublicSupabaseAuth } from "@/lib/supabase/public-env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceClient, usesServiceRole } from "@/lib/supabase/service";
import {
  hasPermission,
  isRoleKey,
  type PermissionKey,
  type RoleKey,
} from "@/lib/auth/permissions";

export type StaffStatus = "invited" | "active" | "disabled";

export type StaffSession = {
  userId: string;
  email: string;
  fullName: string;
  roleId: string;
  roleKey: RoleKey;
  roleName: string;
  status: Exclude<StaffStatus, "disabled">;
  permissions: string[];
};

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  role_id: string;
  status: string;
  staff_roles:
    | { key: string; name: string }
    | { key: string; name: string }[]
    | null;
};

function roleFromRow(row: ProfileRow): { key: RoleKey; name: string } | null {
  const role = Array.isArray(row.staff_roles)
    ? row.staff_roles[0]
    : row.staff_roles;
  if (!role || !isRoleKey(role.key)) return null;
  return { key: role.key, name: role.name };
}

export const getStaffSession = cache(async (): Promise<StaffSession | null> => {
  if (!usesPublicSupabaseAuth() || !usesServiceRole()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const service = getServiceClient();
  const { data: profile, error: profileError } = await service
    .from("staff_profiles")
    .select("id, full_name, email, role_id, status, staff_roles(key, name)")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) return null;

  const row = profile as ProfileRow;
  const role = roleFromRow(row);
  if (!role) return null;
  if (row.status !== "active" && row.status !== "invited") return null;

  const { data: grants, error: grantsError } = await service
    .from("staff_role_permissions")
    .select("staff_permissions(key)")
    .eq("role_id", row.role_id);

  if (grantsError) return null;

  const permissions = (grants ?? []).flatMap((grant) => {
    const permission = grant.staff_permissions as
      | { key: string }
      | { key: string }[]
      | null;
    if (!permission) return [];
    return Array.isArray(permission) ? permission.map((item) => item.key) : [permission.key];
  });

  return {
    userId: row.id,
    email: row.email,
    fullName: row.full_name,
    roleId: row.role_id,
    roleKey: role.key,
    roleName: role.name,
    status: row.status === "invited" ? "invited" : "active",
    permissions,
  };
});

export async function requireStaff() {
  const session = await getStaffSession();
  if (session) return session;
  if (!usesPublicSupabaseAuth()) redirect("/dashboard/login");

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/dashboard/auth/sign-out");
  redirect("/dashboard/login");
}

export async function requirePermission(key: PermissionKey) {
  const session = await requireStaff();
  if (!hasPermission(session.permissions, key)) {
    redirect(`/dashboard/forbidden?need=${encodeURIComponent(key)}`);
  }
  return session;
}

export async function authorize(key: PermissionKey) {
  const session = await getStaffSession();
  if (!session) {
    return {
      session: null,
      status: 401 as const,
      error: "Authentication required.",
    };
  }
  if (!hasPermission(session.permissions, key)) {
    return {
      session: null,
      status: 403 as const,
      error: "You do not have permission to do that.",
    };
  }
  return { session, status: 200 as const, error: null };
}
