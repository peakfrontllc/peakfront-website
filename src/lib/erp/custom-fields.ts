import "server-only";

import { getServiceClient } from "@/lib/supabase/service";

export type CustomFieldOwner = "supplier" | "client";

export async function listCustomFields(ownerType: CustomFieldOwner, ownerId: string) {
  const { data, error } = await getServiceClient()
    .from("custom_fields")
    .select("id, label, value")
    .eq("owner_type", ownerType)
    .eq("owner_id", ownerId)
    .order("created_at");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    label: row.label as string,
    value: row.value as string,
  }));
}

export async function insertCustomFields(
  ownerType: CustomFieldOwner,
  ownerId: string,
  pairs: { label: string; value: string }[],
) {
  if (pairs.length === 0) return null;
  const { error } = await getServiceClient().from("custom_fields").insert(
    pairs.map((pair) => ({
      owner_type: ownerType,
      owner_id: ownerId,
      label: pair.label,
      value: pair.value,
    })),
  );
  return error?.message ?? null;
}
