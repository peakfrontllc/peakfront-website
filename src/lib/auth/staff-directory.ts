import "server-only";

import type { RoleKey } from "@/lib/auth/permissions";
import type { StaffStatus } from "@/lib/auth/session";
import { getServiceClient } from "@/lib/supabase/service";

export type StaffRoleOption = {
  id: string;
  key: RoleKey;
  name: string;
};

export type StaffMember = {
  id: string;
  fullName: string;
  email: string;
  status: StaffStatus;
  roleKey: RoleKey;
  roleName: string;
  lastLoginAt: string | null;
};

export type ActivityEntry = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  actorName: string;
  actorEmail: string;
};

type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  status: StaffStatus;
  last_login_at: string | null;
  staff_roles: { key: RoleKey; name: string } | { key: RoleKey; name: string }[] | null;
};

function oneRole(value: MemberRow["staff_roles"]) {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function listRoles(): Promise<StaffRoleOption[]> {
  const { data, error } = await getServiceClient()
    .from("staff_roles")
    .select("id, key, name")
    .order("name");
  if (error) throw new Error(error.message || "Could not load roles.");

  return (data ?? []).flatMap((row) => {
    const key = row.key as string;
    if (
      key !== "super_admin" &&
      key !== "admin" &&
      key !== "sales" &&
      key !== "operations" &&
      key !== "procurement" &&
      key !== "finance" &&
      key !== "viewer"
    ) {
      return [];
    }
    return [{ id: row.id as string, key, name: row.name as string }];
  });
}

export async function listStaff(): Promise<StaffMember[]> {
  const { data, error } = await getServiceClient()
    .from("staff_profiles")
    .select("id, full_name, email, status, last_login_at, staff_roles(key, name)")
    .order("full_name");
  if (error) throw new Error(error.message || "Could not load staff.");

  return ((data ?? []) as MemberRow[]).flatMap((row) => {
    const role = oneRole(row.staff_roles);
    if (!role) return [];
    return [
      {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        status: row.status,
        roleKey: role.key,
        roleName: role.name,
        lastLoginAt: row.last_login_at,
      },
    ];
  });
}

export async function listRecentActivity(): Promise<ActivityEntry[]> {
  const { data, error } = await getServiceClient()
    .from("activity_logs")
    .select("id, action, entity_type, entity_id, created_at, staff_profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw new Error(error.message || "Could not load activity.");

  return (data ?? []).map((row) => {
    const actor = row.staff_profiles as
      | { full_name: string; email: string }
      | { full_name: string; email: string }[]
      | null;
    const person = Array.isArray(actor) ? actor[0] : actor;
    return {
      id: row.id as string,
      action: row.action as string,
      entityType: (row.entity_type as string | null) ?? null,
      entityId: (row.entity_id as string | null) ?? null,
      createdAt: row.created_at as string,
      actorName: person?.full_name || "System",
      actorEmail: person?.email || "",
    };
  });
}
