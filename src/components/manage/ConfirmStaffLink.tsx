"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { buttonClass } from "@/components/manage/form-styles";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/dashboard") || value.startsWith("//")) return "/dashboard/reset-password";
  if (value.startsWith("/dashboard/login") || value.includes("://")) return "/dashboard/reset-password";
  return value;
}

function isEmailOtpType(value: string): value is EmailOtpType {
  return value === "invite" || value === "recovery" || value === "email" || value === "magiclink" || value === "signup" || value === "email_change";
}

export function ConfirmStaffLink() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, setPending] = useState(false);
  const tokenHash = params.get("token_hash") ?? "";
  const type = params.get("type") ?? "";
  const next = safeNext(params.get("next"));
  const ready = Boolean(tokenHash && isEmailOtpType(type));

  async function continueSignIn() {
    if (!ready || !isEmailOtpType(type)) return;
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) {
      router.replace("/dashboard/login?error=expired");
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber">Peakfront</p>
        <h1 className="mt-2 text-xl font-semibold text-navy">Accept staff invitation</h1>
        {ready ? (
          <>
            <p className="mt-2 text-sm text-slate-500">
              Continue on this computer, then choose the password you will use to sign in.
            </p>
            <button type="button" disabled={pending} onClick={() => void continueSignIn()} className={`${buttonClass} mt-6`}>
              {pending ? "Opening…" : "Continue"}
            </button>
          </>
        ) : (
          <p className="mt-4 rounded-lg border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">
            This sign-in link is incomplete. On the Staff page, click Send sign-in link and open that link on this computer.
          </p>
        )}
      </main>
    </div>
  );
}
