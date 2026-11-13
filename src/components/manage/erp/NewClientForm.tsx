"use client";

import { useActionState } from "react";
import { ExtraFields } from "@/components/manage/erp/ExtraFields";
import { EmiratesField } from "@/components/manage/erp/EmiratesField";
import { IndustryField } from "@/components/manage/erp/IndustryField";
import { Flash, TextField } from "@/components/manage/erp/ui";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";
import { createClientRecord, type NewClientState } from "@/lib/erp/client-actions";

const emptyClient: NewClientState = {
  attempt: 0,
  error: "",
  companyName: "",
  tradeLicence: "",
  industry: "",
  phone: "",
  email: "",
  website: "",
  emirates: [],
  billingAddress: "",
  notes: "",
  contactName: "",
  contactJobTitle: "",
  contactPhone: "",
  contactEmail: "",
  contactWhatsapp: "",
  extras: [],
};

export function NewClientForm() {
  const [state, action] = useActionState(createClientRecord, emptyClient);

  return (
    <>
      <Flash error={state.error} />
      <form key={state.attempt} action={action} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2"><TextField name="companyName" label="Company" required defaultValue={state.companyName} /></div>
        <TextField name="tradeLicence" label="Trade licence" defaultValue={state.tradeLicence} />
        <IndustryField defaultValue={state.industry} />
        <TextField name="phone" label="Phone" defaultValue={state.phone} />
        <TextField name="email" label="Email" type="email" defaultValue={state.email} />
        <TextField name="website" label="Website" defaultValue={state.website} />
        <EmiratesField defaultValue={state.emirates} />
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="billingAddress">Billing address</label>
          <textarea id="billingAddress" name="billingAddress" rows={3} defaultValue={state.billingAddress} className={fieldClass} />
        </div>
        <div className="sm:col-span-2 border-t border-slate-100 pt-2">
          <p className="text-sm font-semibold text-navy">Contact person</p>
          <p className="mt-1 text-sm text-slate-500">Optional. Leave this blank, or enter a name to save them as the primary contact.</p>
        </div>
        <TextField name="contactName" label="Name" defaultValue={state.contactName} />
        <TextField name="contactJobTitle" label="Job title" defaultValue={state.contactJobTitle} />
        <TextField name="contactPhone" label="Phone" defaultValue={state.contactPhone} />
        <TextField name="contactEmail" label="Email" type="email" defaultValue={state.contactEmail} />
        <TextField name="contactWhatsapp" label="WhatsApp" defaultValue={state.contactWhatsapp} />
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={3} defaultValue={state.notes} className={fieldClass} />
        </div>
        <ExtraFields initial={state.extras} />
        <button className={buttonClass} type="submit">Save client</button>
      </form>
    </>
  );
}
