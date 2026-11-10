import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import type { StaffSession } from "@/lib/auth/session";

export async function logActivity(
  actor: Pick<StaffSession, "userId"> | null,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata: Record<string, unknown> = {},
) {
  try {
    const { error } = await getServiceClient().from("activity_logs").insert({
      actor_id: actor?.userId ?? null,
      action,
      entity_type: entityType ?? null,
      entity_id: entityId ?? null,
      metadata,
    });
    if (error) console.error("Activity log failed:", error.message);
  } catch (error) {
    console.error("Activity log failed:", error);
  }
}
