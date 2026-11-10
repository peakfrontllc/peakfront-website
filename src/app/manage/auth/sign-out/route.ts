import { NextResponse } from "next/server";
import { logActivity } from "@/lib/auth/activity";
import { getStaffSession } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getStaffSession();
  if (session) {
    await logActivity(session, "auth.logout", "staff_profile", session.userId);
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/manage/login", request.url));
}
