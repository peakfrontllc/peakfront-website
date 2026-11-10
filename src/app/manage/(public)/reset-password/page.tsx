import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/manage/PasswordForms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { usesPublicSupabaseAuth } from "@/lib/supabase/public-env";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Choose a password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  let signedIn = false;
  if (usesPublicSupabaseAuth()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  }

  return (
    <>
      <section className="bg-navy pt-28 pb-14 text-white sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-5 lg:px-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-amber" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
              Peakfront staff
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Choose a new password
          </h1>
        </div>
      </section>
      <section className="section-padding bg-slate-50">
        <div className="mx-auto max-w-lg px-4 sm:px-5 lg:px-10">
          {signedIn ? (
            <ResetPasswordForm />
          ) : (
            <p className="border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">
              Open the reset link from your email, then choose a new password.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
