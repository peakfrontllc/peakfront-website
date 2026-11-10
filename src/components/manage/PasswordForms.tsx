"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, updatePassword, type FormState } from "@/lib/auth/actions";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<FormState | undefined, FormData>(
    requestPasswordReset,
    undefined,
  );

  return (
    <form action={action}>
      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={fieldClass}
        />
      </div>
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
      <button type="submit" disabled={pending} className={`${buttonClass} mt-8 w-full sm:w-auto`}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <p className="mt-6 text-sm text-slate-600">
        <Link href="/manage/login" className="font-semibold text-blue hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState<FormState | undefined, FormData>(
    updatePassword,
    undefined,
  );

  return (
    <form action={action}>
      <div>
        <label className={labelClass} htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
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
          required
          className={fieldClass}
        />
      </div>
      <p className="mt-3 text-sm text-slate-500">At least 8 characters, with a letter and a number.</p>
      {state?.error && (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${buttonClass} mt-8 w-full sm:w-auto`}>
        {pending ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
