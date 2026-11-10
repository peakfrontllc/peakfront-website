export const PERMISSIONS = {
  websiteProjectsRead: "website_projects.read",
  websiteProjectsWrite: "website_projects.write",
  staffRead: "staff.read",
  staffInvite: "staff.invite",
  staffAssignRoles: "staff.assign_roles",
  staffDisable: "staff.disable",
  activityRead: "activity.read",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_KEYS = [
  "super_admin",
  "admin",
  "sales",
  "operations",
  "procurement",
  "finance",
  "viewer",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export function isRoleKey(value: string): value is RoleKey {
  return ROLE_KEYS.some((key) => key === value);
}

export function hasPermission(
  permissions: readonly string[],
  key: PermissionKey,
) {
  return permissions.includes(key);
}
