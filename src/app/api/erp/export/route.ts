import { NextResponse } from "next/server";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { authorize } from "@/lib/auth/session";
import { listClients } from "@/lib/erp/clients";
import { csvFile, moneyCell, yesNo } from "@/lib/erp/csv";
import { listEquipment } from "@/lib/erp/equipment";
import { listCurrentRates } from "@/lib/erp/rates";
import { matchesClientSearch, matchesSearch } from "@/lib/erp/search";
import { EMIRATES, coversRegion, ownershipLabel, regionLabel } from "@/lib/erp/shared";
import { listSuppliers } from "@/lib/erp/suppliers";
import { getServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

function text(url: URL, key: string) {
  return url.searchParams.get(key)?.trim() ?? "";
}

function regionOf(url: URL) {
  const region = text(url, "region");
  return (EMIRATES as readonly string[]).includes(region) ? region : "";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = text(url, "kind");
  if (kind === "equipment") return exportEquipment(url);
  if (kind === "suppliers") return exportSuppliers(url);
  if (kind === "clients") return exportClients(url);
  if (kind === "rates") return exportRates(url);
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

async function supplierProfiles(ids: string[]) {
  const profiles = new Map<string, { tradeLicence: string; website: string; address: string; notes: string }>();
  if (ids.length === 0) return profiles;
  const { data, error } = await getServiceClient()
    .from("suppliers")
    .select("id, trade_licence, website, address, notes")
    .in("id", ids);
  if (error) throw new Error(error.message);
  for (const row of data ?? []) {
    profiles.set(row.id as string, {
      tradeLicence: (row.trade_licence as string) ?? "",
      website: (row.website as string) ?? "",
      address: (row.address as string) ?? "",
      notes: (row.notes as string) ?? "",
    });
  }
  return profiles;
}

async function exportEquipment(url: URL) {
  const gate = await authorize(PERMISSIONS.equipmentRead);
  if (!gate.session) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const canRates = hasPermission(gate.session.permissions, PERMISSIONS.ratesRead);
  const items = await listEquipment({
    q: text(url, "q"),
    category: text(url, "category"),
    region: regionOf(url),
    archived: text(url, "archived") === "1",
  });
  const profiles = await supplierProfiles([...new Set(items.flatMap((item) => item.suppliers.map((supplier) => supplier.id)))]);
  const rates = canRates ? await listCurrentRates() : [];
  const rateByPair = new Map(rates.map((rate) => [`${rate.equipmentId}:${rate.supplierId}`, rate]));
  const headers = [
    "Category", "Type", "Size", "Name", "Code", "Capacity", "Boom length", "Bed length", "Ownership", "Status", "Archived",
    "Supplier", "Supplier type", "Phone", "Email", "Website", "Trade licence", "Address", "Contact", "Job title", "Regions", "Lead time", "Notes",
  ];
  if (canRates) headers.push("Daily AED", "Weekly AED", "Monthly AED", "Transport AED", "Per km AED", "Operator AED", "VAT included", "Rate from");
  const rows = items.flatMap((item) => {
    const machine = [
      item.purposeName,
      item.typeName,
      item.sizeName,
      item.name,
      item.code,
      item.capacity,
      item.boomLength,
      item.bedLength,
      ownershipLabel(item.ownership),
      item.status,
      yesNo(Boolean(item.archivedAt)),
    ];
    const suppliers = item.suppliers.length > 0 ? item.suppliers : [null];
    return suppliers.map((supplier) => {
      const profile = supplier ? profiles.get(supplier.id) : undefined;
      const rate = supplier ? rateByPair.get(`${item.id}:${supplier.id}`) : undefined;
      const row: (string | number)[] = [
        ...machine,
        supplier?.name ?? "",
        supplier ? (supplier.partyType === "individual" ? "Individual" : "Company") : "",
        supplier?.phone ?? "",
        supplier?.email ?? "",
        profile?.website ?? "",
        profile?.tradeLicence ?? "",
        profile?.address ?? "",
        supplier?.ownerName ?? "",
        supplier?.contactTitle ?? "",
        supplier?.emirates.join("; ") ?? "",
        supplier?.leadTime ?? "",
        profile?.notes ?? "",
      ];
      if (canRates) {
        row.push(
          moneyCell(rate?.dailyRate ?? null),
          moneyCell(rate?.weeklyRate ?? null),
          moneyCell(rate?.monthlyRate ?? null),
          moneyCell(rate?.transportCharge ?? null),
          moneyCell(rate?.perKmRate ?? null),
          moneyCell(rate?.operatorDailyCharge ?? null),
          rate?.hasRate ? yesNo(rate.vatIncluded) : "",
          rate?.validFrom ?? "",
        );
      }
      return row;
    });
  });
  return csvFile("peakfront-equipment.csv", headers, rows);
}

async function exportSuppliers(url: URL) {
  const gate = await authorize(PERMISSIONS.suppliersRead);
  if (!gate.session) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const partyType = text(url, "type");
  const items = await listSuppliers({
    q: text(url, "q"),
    archived: text(url, "archived") === "1",
    partyType: partyType === "individual" || partyType === "company" ? partyType : "",
    region: regionOf(url),
    equipmentId: text(url, "equipment"),
    catalogueId: text(url, "catalogue"),
  });
  return csvFile(
    "peakfront-suppliers.csv",
    ["Name", "Type", "Phone", "Email", "Regions", "Contact", "Job title", "Contact email", "Equipment", "Equipment names", "Provides", "Social links", "Archived"],
    items.map((item) => [
      item.companyName,
      item.partyType === "individual" ? "Individual" : "Company",
      item.phone,
      item.email,
      item.emirates.join("; "),
      item.contactName,
      item.contactTitle,
      item.contactEmail,
      item.equipmentCount,
      item.equipmentNames.join("; "),
      item.providedNames.join("; "),
      item.socialLinks.join("; "),
      yesNo(Boolean(item.archivedAt)),
    ]),
  );
}

async function exportClients(url: URL) {
  const gate = await authorize(PERMISSIONS.clientsRead);
  if (!gate.session) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const region = regionOf(url);
  const industry = text(url, "industry");
  const loaded = await listClients({ archived: text(url, "archived") === "1" });
  const items = loaded.filter((client) => {
    if (!coversRegion(client.emirate, client.locationEmirates, region)) return false;
    if (industry && client.industry !== industry) return false;
    return matchesClientSearch(text(url, "q"), client.searchParts);
  });
  return csvFile(
    "peakfront-clients.csv",
    ["Company", "Industry", "Phone", "Email", "Website", "Region", "Contact", "Job title", "Contact email", "Equipment they need", "Archived"],
    items.map((item) => [
      item.companyName,
      item.industry,
      item.phone,
      item.email,
      item.website,
      regionLabel(item.emirate) || "No region",
      item.contactName,
      item.contactTitle,
      item.contactEmail,
      item.interestCount,
      yesNo(Boolean(item.archivedAt)),
    ]),
  );
}

async function exportRates(url: URL) {
  const gate = await authorize(PERMISSIONS.ratesRead);
  if (!gate.session) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const supplierId = text(url, "supplier");
  const purpose = text(url, "purpose");
  const region = regionOf(url);
  const status = text(url, "status");
  const items = (await listCurrentRates()).filter((rate) => {
    if (supplierId && rate.supplierId !== supplierId) return false;
    if (purpose && rate.purposeName !== purpose) return false;
    if (region && !rate.regions.includes(region)) return false;
    if (status === "rated" && !rate.hasRate) return false;
    if (status === "missing" && rate.hasRate) return false;
    return matchesSearch(text(url, "q"), [
      rate.purposeName,
      rate.typeName,
      rate.sizeName,
      rate.boomLength,
      rate.bedLength,
      rate.alias,
      rate.equipmentName,
      rate.supplierName,
      rate.place,
    ]);
  });
  return csvFile(
    "peakfront-rates.csv",
    ["Category", "Type", "Size", "Equipment", "Boom length", "Bed length", "Supplier", "Region", "Daily AED", "Weekly AED", "Monthly AED", "Transport AED", "Per km AED", "Operator AED", "VAT included", "Valid from", "Valid to", "Has a rate"],
    items.map((item) => [
      item.purposeName,
      item.typeName,
      item.sizeName,
      item.equipmentName,
      item.boomLength,
      item.bedLength,
      item.supplierName,
      item.place,
      moneyCell(item.dailyRate),
      moneyCell(item.weeklyRate),
      moneyCell(item.monthlyRate),
      moneyCell(item.transportCharge),
      moneyCell(item.perKmRate),
      moneyCell(item.operatorDailyCharge),
      item.hasRate ? yesNo(item.vatIncluded) : "",
      item.validFrom,
      item.validTo ?? "",
      yesNo(item.hasRate),
    ]),
  );
}
