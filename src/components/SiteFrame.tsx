"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SaveProgress } from "@/components/manage/SaveProgress";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { usesPublicSupabaseAuth } from "@/lib/supabase/public-env";

export function SiteFrame({
  children,
  header,
  footer,
  extras,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  extras: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const errorCode = hash.get("error_code") ?? "";
    const description = (hash.get("error_description") ?? "").replace(/\+/g, " ");
    if (!accessToken && !hash.get("error") && !errorCode) return;

    window.history.replaceState(null, "", window.location.pathname + window.location.search);

    if (accessToken && refreshToken && usesPublicSupabaseAuth()) {
      const supabase = createSupabaseBrowserClient();
      void supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
        if (error) {
          setAuthNotice("This staff link could not be opened. On the Staff page, click Send sign-in link and open that link on this computer.");
          return;
        }
        router.replace("/dashboard/reset-password");
        router.refresh();
      });
      return;
    }

    const expired = errorCode === "otp_expired" || /expired|invalid/i.test(description);
    setAuthNotice(
      expired
        ? "This staff link has expired. It opened the public website, which cannot sign staff in. On the Staff page, click Send sign-in link and open that link on this computer."
        : "This staff link could not be opened. On the Staff page, click Send sign-in link and open that link on this computer.",
    );
  }, [router]);

  const notice = authNotice ? (
    <div className="fixed inset-x-0 top-0 z-[80] bg-navy px-4 py-3 text-sm text-white shadow-lg">
      <div className="mx-auto flex max-w-3xl items-start justify-between gap-4">
        <p>{authNotice}</p>
        <button type="button" onClick={() => setAuthNotice("")} className="shrink-0 font-semibold text-amber">
          Close
        </button>
      </div>
    </div>
  ) : null;

  if (pathname.startsWith("/dashboard")) {
    return (
      <>
        {notice}
        <SaveProgress />
        {children}
      </>
    );
  }

  return (
    <>
      {notice}
      <SaveProgress />
      {header}
      <main id="main-content" className="pb-20 sm:pb-0">
        {children}
      </main>
      {footer}
      {extras}
    </>
  );
}
