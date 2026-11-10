import type { Metadata } from "next";
import { ExtraFields } from "@/components/manage/erp/ExtraFields";
import { SupplierKindFields } from "@/components/manage/erp/SupplierKindFields";
import { EmiratesField, Flash, MasterHero, TextField } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { createSupplier } from "@/lib/erp/supplier-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Add supplier", robots: { index: false, follow: false } };

export default async function NewSupplierPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requirePermission(PERMISSIONS.suppliersWrite);
  const params = await searchParams;

  return (
    <>
      <MasterHero kicker="Sourcing" title="Add supplier" />
      <div>
        <div className="mx-auto max-w-3xl">
          <Flash error={params.error} />
          <form action={createSupplier} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
            <SupplierKindFields />
            <TextField name="tradeLicence" label="Trade licence" />
            <TextField name="phone" label="Phone" />
            <TextField name="email" label="Email" type="email" />
            <TextField name="website" label="Website" />
            <EmiratesField />
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="address">Address</label>
              <textarea id="address" name="address" rows={3} className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" rows={3} className={fieldClass} />
            </div>
            <ExtraFields />
            <button className={buttonClass} type="submit">Save supplier</button>
          </form>
        </div>
      </div>
    </>
  );
}
