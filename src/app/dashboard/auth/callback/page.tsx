"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/dashboard") || value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/dashboard/login") || value.includes("://")) return "/dashboard";
  return value;
}

function isEmailOtpType(value: string): value is EmailOtpType {
  return value === "invite" || value === "recovery" || value === "email" || value === "magiclink" || value === "signup" || value === "email_change";
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Opening your invitation…");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const url = new URL(window.location.href);
    const next = safeNext(url.searchParams.get("next"));
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    const finish = (path: string) => {
      router.replace(path);
      router.refresh();
    };

    const run = async () => {
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        finish(error ? "/dashboard/login?error=link" : next);
        return;
      }

      if (hash.get("error") || url.searchParams.get("error")) {
        finish("/dashboard/login?error=link");
        return;
      }

      const code = url.searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        finish(error ? "/dashboard/login?error=link" : next);
        return;
      }

      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type") ?? "";
      if (tokenHash && isEmailOtpType(type)) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        finish(error ? "/dashboard/login?error=link" : next);
        return;
      }

      finish("/dashboard/login?error=link");
    };

    void run().catch(() => {
      setMessage("This invitation link could not be opened.");
      router.replace("/dashboard/login?error=link");
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <p className="text-sm text-white">{message}</p>
    </div>
  );
}
