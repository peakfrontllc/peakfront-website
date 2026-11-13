import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CataloguePhoto } from "@/components/manage/erp/CataloguePhoto";
import { MarketRatePanel } from "@/components/manage/erp/MarketRates";
import { EquipmentSupplierCards } from "@/components/manage/erp/EquipmentSupplierCards";
import { EquipmentCategoryFields } from "@/components/manage/erp/EquipmentCategoryFields";
import { InlineEdit } from "@/components/manage/erp/InlineEdit";
import { PermanentDeleteButton } from "@/components/manage/erp/PermanentDeleteButton";
import { SectionNav } from "@/components/manage/erp/SectionNav";
import { ArchiveButton, ExtraFieldPanel, Flash, Panel, SectionStack, fileHref } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { getEquipment, listCategories, listEquipmentSuppliers } from "@/lib/erp/equipment";
import { getMarketRate } from "@/lib/erp/market-rates";
import { linkSupplierEquipment } from "@/lib/erp/supplier-actions";
import { listSuppliers } from "@/lib/erp/suppliers";
import {
  addAsset,
  addEquipmentDocument,
  addEquipmentImage,
  addMaintenance,
  addSpecification,
  deleteEquipmentImage,
  deleteSpecification,
  deleteEquipment,
  setEquipmentArchived,
  updateAsset,
  updateEquipment,
} from "@/lib/erp/equipment-actions";
import { DOCUMENT_BUCKET, IMAGE_BUCKET } from "@/lib/erp/files";
import { capacityLabel, measureNote } from "@/lib/erp/lengths";
import { ASSET_STATUSES, EQUIPMENT_STATUSES, OWNERSHIP, ownershipLabel } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Equipment", robots: { index: false, follow: false } };

export default async function EquipmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; section?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.equipmentRead);
  const { id } = await params;
  const query = await searchParams;
  const [equipment, categories, suppliers, allSuppliers, storedRate] = await Promise.all([
    getEquipment(id),
    listCategories(true),
    listEquipmentSuppliers(id),
    listSuppliers({}),
    getMarketRate(id),
  ]);
  if (!equipment) notFound();
  const canWrite = hasPermission(session.permissions, PERMISSIONS.equipmentWrite);
  const canLinkSupplier = canWrite || hasPermission(session.permissions, PERMISSIONS.suppliersWrite);
  const canDocuments = hasPermission(session.permissions, PERMISSIONS.documentsWrite);
  const canRates = hasPermission(session.permissions, PERMISSIONS.ratesRead);
  const canWriteRates = hasPermission(session.permissions, PERMISSIONS.ratesWrite);
  const category = categories.find((item) => item.id === equipment.categoryId);
  const parent = category?.parentId ? categories.find((item) => item.id === category.parentId) : undefined;
  const grandparent = parent?.parentId ? categories.find((item) => item.id === parent.parentId) : undefined;
  const purposeName = grandparent?.name || parent?.name || "Equipment";
  const typeName = grandparent ? parent?.name || equipment.name : category?.name || equipment.name;
  const sizeName = grandparent ? category?.name || equipment.capacity : equipment.capacity;
  const lengthNote = measureNote(equipment.boomLength, equipment.bedLength, sizeName);
  const cover = equipment.images[0] ? fileHref(IMAGE_BUCKET, equipment.images[0].storagePath) : "";
  const linkedSupplierIds = new Set(suppliers.filter((supplier) => supplier.source === "available").map((supplier) => supplier.supplierId));
  const unlinkedSuppliers = allSuppliers.filter((supplier) => !linkedSupplierIds.has(supplier.id));
  const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 rounded-2xl bg-navy px-5 py-5 text-white shadow-sm sm:flex-row sm:items-center">
        <CataloguePhoto name={typeName} src={cover} large />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber">{purposeName}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{equipment.name}</h1>
          {[typeName !== equipment.name ? typeName : "", sizeName && sizeName.toLowerCase() !== equipment.name.toLowerCase() ? capacityLabel(sizeName) : ""].filter(Boolean).join(" · ") && (
            <p className="mt-1 text-sm text-white/70">
              {[typeName !== equipment.name ? typeName : "", sizeName && sizeName.toLowerCase() !== equipment.name.toLowerCase() ? capacityLabel(sizeName) : ""].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lengthNote && <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white">{lengthNote}</span>}
            <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-semibold text-navy">{ownershipLabel(equipment.ownership)}</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white">{label(equipment.status)}</span>
          </div>
        </div>
        {canWrite && (
          <div className="flex shrink-0 gap-2">
            <ArchiveButton action={setEquipmentArchived} id={equipment.id} archived={Boolean(equipment.archivedAt)} />
            <PermanentDeleteButton
              action={deleteEquipment}
              id={equipment.id}
              message={`Delete ${equipment.name} permanently? Its supplier rates are deleted too. This cannot be restored.`}
            />
          </div>
        )}
      </div>
      <SectionNav items={[
        { id: "details", label: "Details" },
        ...(canRates ? [{ id: "general-rate", label: "General rate" }] : []),
        { id: "suppliers", label: "Suppliers" },
        { id: "specs", label: "Specs" },
        { id: "assets", label: "Assets" },
        { id: "images", label: "Photos" },
        { id: "documents", label: "Documents" },
        { id: "maintenance", label: "Maintenance" },
      ]} />
      <div>
        <div className="mx-auto max-w-5xl space-y-5">
          <Flash error={query.error} />
          {equipment.archivedAt && <p className="rounded-xl border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">This equipment is archived.</p>}

          <SectionStack collapsible>
          <Panel id="details" title="Details">
            {canWrite ? (
              <form action={updateEquipment} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={equipment.id} />
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="name">Name</label>
                  <input id="name" name="name" required defaultValue={equipment.name} className={fieldClass} />
                </div>
                <EquipmentCategoryFields
                  categories={categories
                    .filter((category) => !category.archivedAt || category.id === equipment.categoryId)
                    .map((category) => ({ id: category.id, name: category.name, parentId: category.parentId, kind: category.kind }))}
                  categoryId={equipment.categoryId}
                  capacity={equipment.capacity}
                  boomLength={equipment.boomLength}
                  bedLength={equipment.bedLength}
                />
                <div>
                  <label className={labelClass} htmlFor="code">Code</label>
                  <input id="code" name="code" defaultValue={equipment.code} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="ownership">Source</label>
                  <select id="ownership" name="ownership" defaultValue={equipment.ownership} className={fieldClass}>
                    {OWNERSHIP.map((item) => <option key={item} value={item}>{ownershipLabel(item)}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="status">Status</label>
                  <select id="status" name="status" defaultValue={equipment.status} className={fieldClass}>
                    {EQUIPMENT_STATUSES.map((item) => <option key={item} value={item}>{label(item)}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="description">Description</label>
                  <textarea id="description" name="description" rows={4} defaultValue={equipment.description} className={fieldClass} />
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue" type="submit">Save details</button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-slate-600">{equipment.description || "No description."}</p>
            )}
          </Panel>

          {canRates && (
            <Panel id="general-rate" title="General rate">
              <p className="mb-3 text-sm text-slate-600">The market note for this machine. It is separate from supplier prices.</p>
              <MarketRatePanel
                rate={{
                  equipmentId: equipment.id,
                  purposeName,
                  typeName,
                  sizeName,
                  boomLength: equipment.boomLength,
                  bedLength: equipment.bedLength,
                  ...storedRate,
                }}
                canWrite={canWriteRates}
                returnTo={`/dashboard/equipment/${equipment.id}`}
              />
            </Panel>
          )}

          <Panel
            id="suppliers"
            title={suppliers.length > 0 ? `Suppliers · ${suppliers.length}` : "Suppliers"}
          >
            {suppliers.length === 0 ? (
              <p className="text-sm text-slate-500">No supplier is linked yet.</p>
            ) : (
              <>
                <EquipmentSupplierCards suppliers={suppliers.slice(0, 2)} canRates={canRates} compact />
                {suppliers.length > 1 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Link href={`/dashboard/equipment/${equipment.id}/suppliers`} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md border border-navy/15 px-2.5 text-xs font-semibold text-navy hover:border-amber hover:bg-amber/10">
                      View all suppliers
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                    {canRates && (
                      <Link href={`/dashboard/rates/compare?equipment=${equipment.id}`} className="inline-flex h-8 items-center rounded-md bg-amber px-2.5 text-xs font-semibold text-navy hover:bg-amber/90">
                        Compare rates
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
            {canLinkSupplier && (
              unlinkedSuppliers.length > 0 ? (
                <form action={linkSupplierEquipment} className="mt-4 grid gap-3 rounded-2xl bg-[#f4f7fa] px-4 py-4 sm:grid-cols-[1fr_11rem_auto] sm:items-end">
                  <input type="hidden" name="equipmentId" value={equipment.id} />
                  <input type="hidden" name="returnTo" value={`/dashboard/equipment/${equipment.id}`} />
                  <div>
                    <label className={labelClass} htmlFor="supplierId">Supplier</label>
                    <select id="supplierId" name="supplierId" required defaultValue="" className={fieldClass}>
                      <option value="" disabled>Choose a supplier</option>
                      {unlinkedSuppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.companyName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="leadTime">Lead time</label>
                    <input id="leadTime" name="leadTime" placeholder="2 days" className={fieldClass} />
                  </div>
                  <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue" type="submit">Link supplier</button>
                </form>
              ) : allSuppliers.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  <Link href="/dashboard/suppliers/new" className="font-semibold text-blue hover:underline">Add a supplier</Link> before linking one here.
                </p>
              ) : null
            )}
          </Panel>

          <ExtraFieldPanel
            id="specs"
            fields={equipment.specs}
            canWrite={canWrite}
            addAction={addSpecification}
            removeAction={deleteSpecification}
            hidden={[{ name: "equipmentId", value: equipment.id }]}
          />

          <Panel id="assets" title="Owned assets">
            {equipment.assets.length === 0 && <p className="mb-4 text-sm text-slate-500">No owned assets yet.</p>}
            <div className="space-y-3">
              {equipment.assets.map((asset) => (
                canWrite ? (
                  <InlineEdit
                    key={asset.id}
                    summary={
                      <p className="text-slate-700">
                        <strong className="text-navy">{asset.assetCode}</strong>
                        {" · "}{asset.status}
                        {asset.registrationNumber ? ` · ${asset.registrationNumber}` : ""}
                        {asset.serialNumber ? ` · SN ${asset.serialNumber}` : ""}
                        {asset.location ? ` · ${asset.location}` : ""}
                      </p>
                    }
                  >
                    <form action={updateAsset} className="grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="equipmentId" value={equipment.id} />
                      <input type="hidden" name="id" value={asset.id} />
                      <input name="assetCode" defaultValue={asset.assetCode} placeholder="Asset code" required className={fieldClass} />
                      <input name="registrationNumber" defaultValue={asset.registrationNumber} placeholder="Registration / Mulkiya" className={fieldClass} />
                      <input name="serialNumber" defaultValue={asset.serialNumber} placeholder="Serial number" className={fieldClass} />
                      <input name="yearMade" defaultValue={asset.yearMade} placeholder="Year" className={fieldClass} />
                      <input name="location" defaultValue={asset.location} placeholder="Current location" className={fieldClass} />
                      <input name="notes" defaultValue={asset.notes} placeholder="Notes" className={fieldClass} />
                      <select name="status" className={fieldClass} defaultValue={asset.status}>
                        {ASSET_STATUSES.map((item) => <option key={item} value={item}>{label(item)}</option>)}
                      </select>
                      <button className={buttonClass} type="submit">Save asset</button>
                    </form>
                  </InlineEdit>
                ) : (
                  <p key={asset.id} className="text-sm text-slate-700">
                    <strong className="text-navy">{asset.assetCode}</strong>
                    {" · "}{asset.status}
                    {asset.registrationNumber ? ` · ${asset.registrationNumber}` : ""}
                    {asset.serialNumber ? ` · SN ${asset.serialNumber}` : ""}
                    {asset.location ? ` · ${asset.location}` : ""}
                  </p>
                )
              ))}
            </div>
            {canWrite && (
              <form action={addAsset} className={`${equipment.assets.length > 0 ? "mt-4 border-t border-slate-100 pt-4 " : ""}grid gap-3 sm:grid-cols-2`}>
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <div>
                  <label className={labelClass} htmlFor="assetCode">Asset code</label>
                  <input id="assetCode" name="assetCode" required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="registrationNumber">Registration / Mulkiya</label>
                  <input id="registrationNumber" name="registrationNumber" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="serialNumber">Serial number</label>
                  <input id="serialNumber" name="serialNumber" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="yearMade">Year</label>
                  <input id="yearMade" name="yearMade" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="location">Current location</label>
                  <input id="location" name="location" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="assetStatus">Status</label>
                  <select id="assetStatus" name="status" className={fieldClass} defaultValue="available">
                    {ASSET_STATUSES.map((item) => <option key={item} value={item}>{label(item)}</option>)}
                  </select>
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue" type="submit">Add asset</button>
                </div>
              </form>
            )}
          </Panel>

          <Panel id="images" title="Photos">
            {equipment.images.length === 0 ? (
              <p className="mb-4 text-sm text-slate-500">No photos yet. The catalogue photo stays until you upload one.</p>
            ) : (
              <div className="mb-4 grid gap-4 sm:grid-cols-3">
                {equipment.images.map((image) => (
                  <figure key={image.id} className="overflow-hidden rounded-xl border border-slate-200">
                    {/* Staff files are served through an authorized route. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fileHref(IMAGE_BUCKET, image.storagePath)} alt={image.alt || equipment.name} className="h-36 w-full object-cover" />
                    {canWrite && (
                      <form action={deleteEquipmentImage} className="px-3 py-2">
                        <input type="hidden" name="equipmentId" value={equipment.id} />
                        <input type="hidden" name="id" value={image.id} />
                        <input type="hidden" name="storagePath" value={image.storagePath} />
                        <button className="text-xs font-semibold text-red-600" type="submit">Remove</button>
                      </form>
                    )}
                  </figure>
                ))}
              </div>
            )}
            {canWrite && (
              <form action={addEquipmentImage} className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <div>
                  <label className={labelClass} htmlFor="equipmentPhoto">Photo</label>
                  <input id="equipmentPhoto" name="image" type="file" accept="image/*" required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="photoAlt">Alt text</label>
                  <input id="photoAlt" name="alt" className={fieldClass} />
                </div>
                <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue" type="submit">Upload</button>
              </form>
            )}
          </Panel>

          <Panel id="documents" title="Registration and certificates">
            {equipment.documents.length === 0 ? (
              <p className="mb-4 text-sm text-slate-500">No documents yet.</p>
            ) : (
              <ul className="mb-4 space-y-2 text-sm">
                {equipment.documents.map((document) => (
                  <li key={document.id} className="rounded-xl border border-slate-200/80 px-3 py-2">
                    <a className="font-semibold text-navy hover:text-blue" href={fileHref(DOCUMENT_BUCKET, document.storagePath)}>{document.title}</a>
                    <span className="text-slate-500"> · {label(document.docType.replaceAll("_", " "))}{document.expiresOn ? ` · expires ${document.expiresOn}` : ""}</span>
                  </li>
                ))}
              </ul>
            )}
            {canDocuments && (
              <form action={addEquipmentDocument} className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <div>
                  <label className={labelClass} htmlFor="documentTitle">Title</label>
                  <input id="documentTitle" name="title" required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="docType">Type</label>
                  <select id="docType" name="docType" className={fieldClass} defaultValue="certificate">
                    <option value="registration">Registration</option>
                    <option value="certificate">Certificate</option>
                    <option value="insurance">Insurance</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="expiresOn">Expires</label>
                  <input id="expiresOn" name="expiresOn" type="date" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="documentFile">File</label>
                  <input id="documentFile" name="document" type="file" accept="application/pdf,image/*" required className={fieldClass} />
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue" type="submit">Upload document</button>
                </div>
              </form>
            )}
          </Panel>

          <Panel id="maintenance" title="Maintenance">
            {equipment.maintenance.length === 0 ? (
              <p className="mb-4 text-sm text-slate-500">No maintenance records yet.</p>
            ) : (
              <ul className="mb-4 space-y-2 text-sm">
                {equipment.maintenance.map((entry) => (
                  <li key={entry.id} className="rounded-xl border border-slate-200/80 px-3 py-2">
                    <strong className="text-navy">{entry.servicedOn}</strong>
                    <span className="text-slate-600"> · {entry.description}</span>
                    {entry.nextDueOn ? <span className="text-slate-500"> · next due {entry.nextDueOn}</span> : null}
                  </li>
                ))}
              </ul>
            )}
            {canWrite && (
              <form action={addMaintenance} className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <input type="hidden" name="equipmentId" value={equipment.id} />
                <div>
                  <label className={labelClass} htmlFor="servicedOn">Serviced on</label>
                  <input id="servicedOn" name="servicedOn" type="date" required className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="nextDueOn">Next due</label>
                  <input id="nextDueOn" name="nextDueOn" type="date" className={fieldClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="maintenanceWork">Work carried out</label>
                  <textarea id="maintenanceWork" name="description" required rows={3} className={fieldClass} />
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <button className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-blue" type="submit">Add maintenance record</button>
                </div>
              </form>
            )}
          </Panel>
          </SectionStack>
        </div>
      </div>
    </>
  );
}
