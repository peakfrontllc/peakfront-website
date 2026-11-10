"use server";

import { redirect } from "next/navigation";
import { logActivity } from "@/lib/auth/activity";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { fail, field } from "@/lib/erp/shared";
import { getServiceClient } from "@/lib/supabase/service";

function ownerFromForm(formData: FormData) {
  const rawType = field(formData, "ownerType");
  const ownerId = field(formData, "ownerId");
  if ((rawType !== "supplier" && rawType !== "client") || !ownerId) return null;
  return {
    ownerType: rawType === "client" ? "client" as const : "supplier" as const,
    ownerId,
    path: `/manage/${rawType === "client" ? "clients" : "suppliers"}/${ownerId}`,
  };
}

async function authorize(ownerType: "supplier" | "client") {
  return requirePermission(ownerType === "supplier" ? PERMISSIONS.suppliersWrite : PERMISSIONS.clientsWrite);
}

export async function addCustomField(formData: FormData) {
  const owner = ownerFromForm(formData);
  if (!owner) fail("/manage", "The extra field could not be saved.");
  const session = await authorize(owner.ownerType);
  const label = field(formData, "label");
  const value = field(formData, "value");
  if (!label || !value) fail(owner.path, "Enter a field name and a value.");
  const { error } = await getServiceClient().from("custom_fields").insert({
    owner_type: owner.ownerType,
    owner_id: owner.ownerId,
    label,
    value,
  });
  if (error) fail(owner.path, "The extra field could not be saved.");
  await logActivity(session, "custom_field.created", owner.ownerType, owner.ownerId, { label });
  redirect(owner.path);
}

export async function deleteCustomField(formData: FormData) {
  const owner = ownerFromForm(formData);
  if (!owner) fail("/manage", "The extra field could not be removed.");
  const session = await authorize(owner.ownerType);
  const id = field(formData, "id");
  const { error } = await getServiceClient()
    .from("custom_fields")
    .delete()
    .eq("id", id)
    .eq("owner_type", owner.ownerType)
    .eq("owner_id", owner.ownerId);
  if (error) fail(owner.path, "The extra field could not be removed.");
  await logActivity(session, "custom_field.deleted", owner.ownerType, owner.ownerId);
  redirect(owner.path);
}
