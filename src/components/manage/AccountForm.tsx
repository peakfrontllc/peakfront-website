"use client";

import { useActionState } from "react";
import { updateAccount, type FormState } from "@/lib/auth/actions";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";

export function AccountForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [state, action, pending] = useActionState<FormState | undefined, FormData>(
    updateAccount,
    undefined,
  );

  return (
    <form action={action} className="border border-navy/10 bg-white p-6 sm:p-10">
      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input id="email" value={email} readOnly className={`${fieldClass} bg-slate-50`} />
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="fullName">
          Name
        </label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={fullName}
          required
          className={fieldClass}
        />
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>
      <p className="mt-3 text-sm text-slate-500">
        Leave the password blank to keep the current one.
      </p>
      {state?.error && (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${buttonClass} mt-8`}>
        {pending ? "Saving…" : "Save account"}
      </button>
    </form>
  );
}
