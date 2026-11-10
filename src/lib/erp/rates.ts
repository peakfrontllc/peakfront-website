import "server-only";

import { getServiceClient } from "@/lib/supabase/service";
import { listEquipment, type EquipmentListItem } from "@/lib/erp/equipment";
import { isCurrentRate, searchTerm } from "@/lib/erp/shared";

export type CurrentRate = {
  id: string;
  supplierId: string;
  supplierName: string;
  equipmentId: string;
  equipmentName: string;
  purposeName: string;
  typeName: string;
  sizeName: string;
  alias: string;
  dailyRate: number | null;
  weeklyRate: number | null;
  monthlyRate: number | null;
  transportCharge: number | null;
  operatorDailyCharge: number | null;
  vatIncluded: boolean;
  validFrom: string;
  validTo: string | null;
  hasRate: boolean;
};

type RawMoneyRate = {
  id: string;
  daily_rate: number | string | null;
  weekly_rate: number | string | null;
  monthly_rate: number | string | null;
  transport_charge: number | string | null;
  operator_daily_charge: number | string | null;
  vat_included: boolean;
  valid_from: string;
  valid_to: string | null;
};

type LinkedEquipment = {
  id: string;
  equipment_id: string;
  suppliers: { id: string; company_name: string; archived_at: string | null } | { id: string; company_name: string; archived_at: string | null }[] | null;
  supplier_rates: RawMoneyRate[] | null;
};

function amount(value: number | string | null) {
  if (value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function one<T>(value: T | T[] | null | undefined) {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function sizeRank(value: string) {
  const number = Number(value.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0]);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
}

function equipmentLabels(item: EquipmentListItem) {
  const typeName = item.typeName || item.name;
  const sizeName = item.sizeName && item.sizeName.toLowerCase() !== typeName.toLowerCase()
    ? item.sizeName
    : item.capacity && item.capacity.toLowerCase() !== typeName.toLowerCase()
      ? item.capacity
      : "";
  const alias = [item.name, item.code]
    .filter((part, index, all) => Boolean(part) && part.toLowerCase() !== typeName.toLowerCase() && part.toLowerCase() !== sizeName.toLowerCase() && all.findIndex((entry) => entry.toLowerCase() === part.toLowerCase()) === index)
    .join(" · ");
  return { typeName, sizeName, alias };
}

function rateRow(
  item: EquipmentListItem,
  link: { id: string; supplierId: string; supplierName: string; rates: RawMoneyRate[] } | null,
): CurrentRate {
  const labels = equipmentLabels(item);
  const current = link?.rates
    .filter((rate) => isCurrentRate(rate.valid_from, rate.valid_to))
    .sort((a, b) => b.valid_from.localeCompare(a.valid_from))[0];
  return {
    id: current?.id ?? link?.id ?? item.id,
    supplierId: link?.supplierId ?? "",
    supplierName: link?.supplierName ?? "",
    equipmentId: item.id,
    equipmentName: item.name,
    purposeName: item.purposeName,
    typeName: labels.typeName,
    sizeName: labels.sizeName,
    alias: labels.alias,
    dailyRate: current ? amount(current.daily_rate) : null,
    weeklyRate: current ? amount(current.weekly_rate) : null,
    monthlyRate: current ? amount(current.monthly_rate) : null,
    transportCharge: current ? amount(current.transport_charge) : null,
    operatorDailyCharge: current ? amount(current.operator_daily_charge) : null,
    vatIncluded: current?.vat_included ?? false,
    validFrom: current?.valid_from ?? "",
    validTo: current?.valid_to ?? null,
    hasRate: Boolean(current),
  };
}

async function loadRates(): Promise<CurrentRate[]> {
  const [equipment, { data, error }] = await Promise.all([
    listEquipment({}),
    getServiceClient()
      .from("supplier_equipment")
      .select(`
        id, equipment_id,
        suppliers(id, company_name, archived_at),
        supplier_rates(id, daily_rate, weekly_rate, monthly_rate, transport_charge, operator_daily_charge, vat_included, valid_from, valid_to)
      `),
  ]);
  if (error) throw new Error(error.message);

  const links = new Map<string, { id: string; supplierId: string; supplierName: string; rates: RawMoneyRate[] }[]>();
  for (const row of (data ?? []) as unknown as LinkedEquipment[]) {
    const supplier = one(row.suppliers);
    if (!supplier || supplier.archived_at) continue;
    const current = links.get(row.equipment_id) ?? [];
    current.push({
      id: row.id,
      supplierId: supplier.id,
      supplierName: supplier.company_name,
      rates: row.supplier_rates ?? [],
    });
    links.set(row.equipment_id, current);
  }

  return equipment.flatMap((item) => {
    const itemLinks = links.get(item.id) ?? [];
    if (itemLinks.length === 0) return [rateRow(item, null)];
    return itemLinks.map((link) => rateRow(item, link));
  }).sort((a, b) =>
    a.purposeName.localeCompare(b.purposeName)
    || a.typeName.localeCompare(b.typeName)
    || sizeRank(a.sizeName) - sizeRank(b.sizeName)
    || a.supplierName.localeCompare(b.supplierName),
  );
}

export async function listCurrentRates(q?: string) {
  const term = searchTerm(q).toLowerCase();
  const rates = await loadRates();
  if (!term) return rates;
  return rates.filter((rate) =>
    `${rate.purposeName} ${rate.typeName} ${rate.sizeName} ${rate.alias} ${rate.equipmentName} ${rate.supplierName}`.toLowerCase().includes(term),
  );
}

export async function compareEquipmentRates(equipmentId: string) {
  return (await loadRates())
    .filter((rate) => rate.equipmentId === equipmentId && rate.hasRate)
    .sort((a, b) => (a.dailyRate ?? Number.POSITIVE_INFINITY) - (b.dailyRate ?? Number.POSITIVE_INFINITY));
}
