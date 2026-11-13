import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import { listEquipment, type EquipmentListItem } from "@/lib/erp/equipment";

export type MarketRate = {
  equipmentId: string;
  purposeName: string;
  typeName: string;
  sizeName: string;
  boomLength: string;
  bedLength: string;
  dailyRate: number | null;
  weeklyRate: number | null;
  monthlyRate: number | null;
  vatIncluded: boolean;
  notes: string;
  hasRate: boolean;
};

type MarketRow = {
  equipment_id: string;
  daily_rate: number | string | null;
  weekly_rate: number | string | null;
  monthly_rate: number | string | null;
  vat_included: boolean;
  notes: string;
};

function amount(value: number | string | null | undefined) {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sizeRank(value: string) {
  const number = Number(value.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0]);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
}

function labels(item: EquipmentListItem) {
  const typeName = item.typeName || item.name;
  const sizeName = item.sizeName && item.sizeName.toLowerCase() !== typeName.toLowerCase()
    ? item.sizeName
    : item.capacity && item.capacity.toLowerCase() !== typeName.toLowerCase()
      ? item.capacity
      : "";
  return { typeName, sizeName };
}

function toMarketRate(item: EquipmentListItem, row: MarketRow | undefined): MarketRate {
  const named = labels(item);
  const dailyRate = amount(row?.daily_rate);
  const weeklyRate = amount(row?.weekly_rate);
  const monthlyRate = amount(row?.monthly_rate);
  const notes = row?.notes ?? "";
  return {
    equipmentId: item.id,
    purposeName: item.purposeName,
    typeName: named.typeName,
    sizeName: named.sizeName,
    boomLength: item.boomLength,
    bedLength: item.bedLength,
    dailyRate,
    weeklyRate,
    monthlyRate,
    vatIncluded: row?.vat_included ?? false,
    notes,
    hasRate: dailyRate !== null || weeklyRate !== null || monthlyRate !== null || notes.trim().length > 0,
  };
}

export async function listMarketRates(): Promise<MarketRate[]> {
  const [equipment, stored] = await Promise.all([
    listEquipment({}),
    getServiceClient()
      .from("equipment_market_rates")
      .select("equipment_id, daily_rate, weekly_rate, monthly_rate, vat_included, notes"),
  ]);
  if (stored.error) throw new Error(stored.error.message);
  const byEquipment = new Map(((stored.data ?? []) as MarketRow[]).map((row) => [row.equipment_id, row]));
  return equipment
    .map((item) => toMarketRate(item, byEquipment.get(item.id)))
    .sort((a, b) =>
      a.purposeName.localeCompare(b.purposeName)
      || a.typeName.localeCompare(b.typeName)
      || sizeRank(a.sizeName) - sizeRank(b.sizeName),
    );
}

export async function getMarketRate(equipmentId: string) {
  const { data, error } = await getServiceClient()
    .from("equipment_market_rates")
    .select("daily_rate, weekly_rate, monthly_rate, vat_included, notes")
    .eq("equipment_id", equipmentId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const row = data as Omit<MarketRow, "equipment_id"> | null;
  const dailyRate = amount(row?.daily_rate);
  const weeklyRate = amount(row?.weekly_rate);
  const monthlyRate = amount(row?.monthly_rate);
  const notes = row?.notes ?? "";
  return {
    dailyRate,
    weeklyRate,
    monthlyRate,
    vatIncluded: row?.vat_included ?? false,
    notes,
    hasRate: dailyRate !== null || weeklyRate !== null || monthlyRate !== null || notes.trim().length > 0,
  };
}
