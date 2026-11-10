"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type FormState } from "@/lib/auth/actions";
import { buttonClass, fieldClass, labelClass } from "@/components/manage/form-styles";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState | undefined, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} className="border border-navy/10 bg-white p-6 sm:p-10">
      <input type="hidden" name="next" value={next} />
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
      <div className="mt-5">
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </div>
      {state?.error && (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${buttonClass} mt-8 w-full sm:w-auto`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-6 text-sm text-slate-600">
        <Link href="/manage/forgot-password" className="font-semibold text-blue hover:underline">
          Forgot password
        </Link>
      </p>
    </form>
  );
}
