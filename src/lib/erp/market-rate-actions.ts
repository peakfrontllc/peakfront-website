"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/auth/activity";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { checked, fail, field, parseMoney } from "@/lib/erp/shared";
import { getServiceClient } from "@/lib/supabase/service";

function returnPath(formData: FormData) {
  const value = field(formData, "returnTo");
  try {
    const url = new URL(value, "http://localhost");
    if (url.pathname === "/dashboard/rates/market") {
      const next = new URLSearchParams();
      for (const key of ["q", "purpose", "status", "view", "page"] as const) {
        const item = url.searchParams.get(key)?.replace(/[\r\n]/g, " ").trim().slice(0, 80);
        if (item) next.set(key, item);
      }
      const text = next.toString();
      return text ? `/dashboard/rates/market?${text}` : "/dashboard/rates/market";
    }
    if (/^\/dashboard\/equipment\/[0-9a-f-]{36}$/i.test(url.pathname)) return url.pathname;
  } catch {
    return "/dashboard/rates/market";
  }
  return "/dashboard/rates/market";
}

export async function saveMarketRate(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.ratesWrite);
  const equipmentId = field(formData, "equipmentId");
  const path = returnPath(formData);
  if (!/^[0-9a-f-]{36}$/i.test(equipmentId)) fail(path, "Choose a machine before saving the general rate.");
  const daily = parseMoney(field(formData, "dailyRate"));
  const weekly = parseMoney(field(formData, "weeklyRate"));
  const monthly = parseMoney(field(formData, "monthlyRate"));
  const notes = field(formData, "notes").slice(0, 500);
  if ([daily, weekly, monthly].some((value) => Number.isNaN(value))) {
    fail(path, "Enter amounts as numbers with up to two decimal places.");
  }

  const service = getServiceClient();
  if (daily === null && weekly === null && monthly === null && !notes) {
    const { error } = await service.from("equipment_market_rates").delete().eq("equipment_id", equipmentId);
    if (error) fail(path, "The general rate could not be cleared.");
  } else {
    const { error } = await service.from("equipment_market_rates").upsert({
      equipment_id: equipmentId,
      daily_rate: daily,
      weekly_rate: weekly,
      monthly_rate: monthly,
      vat_included: checked(formData, "vatIncluded"),
      notes,
      updated_by: session.userId,
      updated_at: new Date().toISOString(),
    });
    if (error) fail(path, "The general rate could not be saved.");
  }

  await logActivity(session, "equipment_market_rate.saved", "equipment", equipmentId);
  refresh();
  redirect(path);
}
