import type { Metadata } from "next";
import Link from "next/link";
import { EquipmentCategoryFields } from "@/components/manage/erp/EquipmentCategoryFields";
import { ExtraFields } from "@/components/manage/erp/ExtraFields";
import { Flash, MasterHero } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listCategories } from "@/lib/erp/equipment";
import { createEquipment } from "@/lib/erp/equipment-actions";
import { EQUIPMENT_STATUSES, OWNERSHIP, ownershipLabel } from "@/lib/erp/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add equipment", robots: { index: false, follow: false } };

export default async function NewEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.equipmentWrite);
  const params = await searchParams;
  const categories = await listCategories();

  return (
    <>
      <MasterHero kicker="Available" title="Add our equipment" />
      <div>
        <div className="mx-auto max-w-3xl">
          <Flash error={params.error} />
          {categories.length === 0 ? (
            <p className="text-sm text-slate-600">
              Add a category first. <Link className="font-semibold text-blue" href="/manage/categories">Categories</Link>
            </p>
          ) : (
            <form action={createEquipment} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="name">Name</label>
                <input id="name" name="name" required className={fieldClass} />
              </div>
              <EquipmentCategoryFields
                categories={categories.map((category) => ({
                  id: category.id,
                  name: category.name,
                  parentId: category.parentId,
                }))}
              />
              <div>
                <label className={labelClass} htmlFor="code">Code</label>
                <input id="code" name="code" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="ownership">Source</label>
                <select id="ownership" name="ownership" className={fieldClass} defaultValue="owned">
                  {OWNERSHIP.map((item) => <option key={item} value={item}>{ownershipLabel(item)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="status">Status</label>
                <select id="status" name="status" className={fieldClass} defaultValue="available">
                  {EQUIPMENT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="description">Description</label>
                <textarea id="description" name="description" rows={4} className={fieldClass} />
              </div>
              <ExtraFields />
              <button className={buttonClass} type="submit">Save equipment</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
