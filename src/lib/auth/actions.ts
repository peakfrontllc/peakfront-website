"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { logActivity } from "@/lib/auth/activity";
import {
  hasPermission,
  isRoleKey,
  PERMISSIONS,
  type RoleKey,
} from "@/lib/auth/permissions";
import { getStaffSession, requireStaff } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";

export type FormState = {
  error?: string;
  message?: string;
  link?: string;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNext(value: string) {
  if (!value.startsWith("/dashboard") || value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/dashboard/login")) return "/dashboard";
  if (value.includes("://") || value.includes("\\")) return "/dashboard";
  return value;
}

async function requestOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return `${proto}://${host}`;
}

async function createStaffLink(email: string, type: "invite" | "recovery", fullName?: string) {
  const origin = await requestOrigin();
  const service = getServiceClient();
  const redirectTo = `${origin}/dashboard/reset-password`;
  const { data, error } = type === "invite"
    ? await service.auth.admin.generateLink({
      type,
      email,
      options: { redirectTo, data: fullName ? { full_name: fullName } : undefined },
    })
    : await service.auth.admin.generateLink({
      type,
      email,
      options: { redirectTo },
    });
  const token = data?.properties?.hashed_token;
  if (error || !token || !data.user) return { link: "", userId: "" };
  const url = new URL("/dashboard/auth/confirm", origin);
  url.searchParams.set("token_hash", token);
  url.searchParams.set("type", data.properties.verification_type || type);
  url.searchParams.set("next", "/dashboard/reset-password");
  return { link: url.toString(), userId: data.user.id };
}

async function sendStaffLink(email: string, link: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Peakfront staff sign-in",
    text: `Open this link on the computer where the Peakfront staff page is running, then choose a password:\n\n${link}\n`,
  });
  return !error;
}

function passwordError(password: string) {
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Use at least one letter and one number.";
  }
  return "";
}

async function requireActionPermission(key: (typeof PERMISSIONS)[keyof typeof PERMISSIONS]) {
  const session = await getStaffSession();
  if (!session) redirect("/dashboard/login");
  if (!hasPermission(session.permissions, key)) {
    return { session: null, error: "You do not have permission to do that." };
  }
  return { session, error: "" };
}

export async function login(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const next = safeNext(text(formData, "next"));

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Email or password is incorrect." };
  }

  const service = getServiceClient();
  const { data: profile } = await service
    .from("staff_profiles")
    .select("id, status")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || (profile.status !== "active" && profile.status !== "invited")) {
    await supabase.auth.signOut();
    return { error: "This account is not an active Peakfront staff profile." };
  }

  if (profile.status === "invited") {
    await service
      .from("staff_profiles")
      .update({ status: "active", last_login_at: new Date().toISOString() })
      .eq("id", data.user.id);
  } else {
    await service
      .from("staff_profiles")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", data.user.id);
  }

  await logActivity(
    { userId: data.user.id },
    "auth.login",
    "staff_profile",
    data.user.id,
  );
  redirect(next);
}

export async function logout() {
  const session = await getStaffSession();
  if (session) {
    await logActivity(session, "auth.logout", "staff_profile", session.userId);
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/dashboard/login");
}

export async function requestPasswordReset(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email").toLowerCase();
  if (!email) return { error: "Enter your email address." };

  const created = await createStaffLink(email, "recovery");
  if (created.link) await sendStaffLink(email, created.link);

  return {
    message: "If that email belongs to a staff account, a sign-in link is on its way. Open it on this computer.",
  };
}

export async function updatePassword(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const password = text(formData, "password");
  const confirm = text(formData, "confirmPassword");
  const issue = passwordError(password);
  if (issue) return { error: issue };
  if (password !== confirm) return { error: "Passwords do not match." };

  const supabase = await createSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) {
    return { error: "Open the reset link from your email, then choose a new password." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "The password could not be updated. Request a new link." };

  await getServiceClient()
    .from("staff_profiles")
    .update({ status: "active", last_login_at: new Date().toISOString() })
    .eq("id", data.user.id)
    .eq("status", "invited");

  await logActivity(
    { userId: data.user.id },
    "auth.password_updated",
    "staff_profile",
    data.user.id,
  );
  redirect("/dashboard");
}

export async function updateAccount(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const session = await requireStaff();
  const fullName = text(formData, "fullName");
  const password = text(formData, "password");
  const confirm = text(formData, "confirmPassword");

  if (fullName.length < 2) return { error: "Enter your name." };

  if (password || confirm) {
    const issue = passwordError(password);
    if (issue) return { error: issue };
    if (password !== confirm) return { error: "Passwords do not match." };
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: "The password could not be updated." };
    await logActivity(session, "auth.password_updated", "staff_profile", session.userId);
  }

  const { error } = await getServiceClient()
    .from("staff_profiles")
    .update({ full_name: fullName })
    .eq("id", session.userId);
  if (error) return { error: "Your profile could not be saved." };

  return { message: "Account saved." };
}

export async function inviteStaff(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const gate = await requireActionPermission(PERMISSIONS.staffInvite);
  if (!gate.session) return { error: gate.error };

  const email = text(formData, "email").toLowerCase();
  const fullName = text(formData, "fullName");
  const roleKey = text(formData, "role");

  if (!email.includes("@")) return { error: "Enter a valid email address." };
  if (fullName.length < 2) return { error: "Enter the person's name." };
  if (!isRoleKey(roleKey)) return { error: "Choose a role." };
  if (roleKey === "super_admin" && gate.session.roleKey !== "super_admin") {
    return { error: "Only a Super Admin can invite another Super Admin." };
  }

  const service = getServiceClient();
  const { data: existing } = await service
    .from("staff_profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  if (existing) return { error: "That person already has a staff profile." };

  const { data: role, error: roleError } = await service
    .from("staff_roles")
    .select("id")
    .eq("key", roleKey)
    .maybeSingle();
  if (roleError || !role) return { error: "That role is not available." };

  const created = await createStaffLink(email, "invite", fullName);
  if (!created.userId || !created.link) {
    return { error: "The invitation could not be created." };
  }

  const { error: profileError } = await service.from("staff_profiles").insert({
    id: created.userId,
    full_name: fullName,
    email,
    role_id: role.id,
    status: "invited",
    invited_by: gate.session.userId,
  });

  if (profileError) {
    return { error: "The user was invited, but the staff profile could not be saved." };
  }

  await sendStaffLink(email, created.link);
  await logActivity(gate.session, "staff.invited", "staff_profile", created.userId, {
    email,
    role: roleKey,
  });

  return {
    message: `Invitation ready for ${email}. Open the link on this computer. The public website cannot sign staff in.`,
    link: created.link,
  };
}

export async function resendStaffAccess(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const gate = await requireActionPermission(PERMISSIONS.staffInvite);
  if (!gate.session) return { error: gate.error };

  const staffId = text(formData, "staffId");
  if (!staffId) return { error: "Choose a staff member." };

  const service = getServiceClient();
  const { data: profile } = await service
    .from("staff_profiles")
    .select("id, email, status")
    .eq("id", staffId)
    .maybeSingle();
  if (!profile) return { error: "Staff member not found." };
  if (profile.status === "disabled") {
    return { error: "Enable this person before sending a sign-in link." };
  }

  const created = await createStaffLink(profile.email as string, "recovery");
  if (!created.link) return { error: "The sign-in link could not be created. Try again shortly." };

  await sendStaffLink(profile.email as string, created.link);
  await logActivity(gate.session, "staff.invite_resent", "staff_profile", profile.id as string);
  return {
    message: `Sign-in link ready for ${profile.email}. Open it on this computer, choose a password, then sign in.`,
    link: created.link,
  };
}

export async function changeStaffRole(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const gate = await requireActionPermission(PERMISSIONS.staffAssignRoles);
  if (!gate.session) return { error: gate.error };

  const staffId = text(formData, "staffId");
  const roleKey = text(formData, "role");
  if (!staffId || !isRoleKey(roleKey)) return { error: "Choose a staff member and a role." };

  const service = getServiceClient();
  const { data: profile } = await service
    .from("staff_profiles")
    .select("id, role_id, staff_roles(key)")
    .eq("id", staffId)
    .maybeSingle();
  if (!profile) return { error: "Staff member not found." };

  const current = profile.staff_roles as { key: RoleKey } | { key: RoleKey }[] | null;
  const currentKey = Array.isArray(current) ? current[0]?.key : current?.key;
  if (currentKey === "super_admin" && roleKey !== "super_admin") {
    const { count } = await service
      .from("staff_profiles")
      .select("id", { count: "exact", head: true })
      .eq("role_id", profile.role_id)
      .neq("status", "disabled");
    if ((count ?? 0) <= 1) {
      return { error: "Keep at least one active Super Admin." };
    }
  }

  const { data: role } = await service
    .from("staff_roles")
    .select("id")
    .eq("key", roleKey)
    .maybeSingle();
  if (!role) return { error: "That role is not available." };

  const { error } = await service
    .from("staff_profiles")
    .update({ role_id: role.id })
    .eq("id", staffId);
  if (error) return { error: "The role could not be changed." };

  await logActivity(gate.session, "staff.role_changed", "staff_profile", staffId, {
    role: roleKey,
  });
  return { message: "Role updated." };
}

export async function setStaffStatus(
  _state: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const gate = await requireActionPermission(PERMISSIONS.staffDisable);
  if (!gate.session) return { error: gate.error };

  const staffId = text(formData, "staffId");
  const status = text(formData, "status");
  if (!staffId || (status !== "active" && status !== "disabled")) {
    return { error: "That status is not available." };
  }
  if (staffId === gate.session.userId) {
    return { error: "You cannot change your own access." };
  }

  const service = getServiceClient();
  const { data: profile } = await service
    .from("staff_profiles")
    .select("id, staff_roles(key)")
    .eq("id", staffId)
    .maybeSingle();
  if (!profile) return { error: "Staff member not found." };

  const role = profile.staff_roles as { key: string } | { key: string }[] | null;
  const roleKey = Array.isArray(role) ? role[0]?.key : role?.key;
  if (roleKey === "super_admin" && gate.session.roleKey !== "super_admin") {
    return { error: "Only a Super Admin can change a Super Admin." };
  }
  if (roleKey === "super_admin" && status === "disabled") {
    const { data: supers } = await service
      .from("staff_profiles")
      .select("id, staff_roles!inner(key)")
      .neq("status", "disabled");
    const activeSupers = (supers ?? []).filter((row) => {
      const roles = row.staff_roles as { key: string } | { key: string }[] | null;
      const key = Array.isArray(roles) ? roles[0]?.key : roles?.key;
      return key === "super_admin";
    });
    if (activeSupers.length <= 1) {
      return { error: "Keep at least one active Super Admin." };
    }
  }

  const { error } = await service
    .from("staff_profiles")
    .update({ status })
    .eq("id", staffId);
  if (error) return { error: "The staff member could not be updated." };

  await logActivity(
    gate.session,
    status === "disabled" ? "staff.disabled" : "staff.enabled",
    "staff_profile",
    staffId,
  );
  return { message: status === "disabled" ? "Staff member disabled." : "Staff member enabled." };
}
