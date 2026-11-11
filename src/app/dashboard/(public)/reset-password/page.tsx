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
      <h1 className="text-xl font-semibold text-navy">Choose a password</h1>
      <p className="mt-1 text-sm text-slate-500">Use this password the next time you sign in.</p>
      <div className="mt-6">
        {signedIn ? (
          <ResetPasswordForm />
        ) : (
          <p className="rounded-lg border border-amber/40 bg-amber/15 px-4 py-3 text-sm text-navy">
            Click Accept invitation in the email, then choose a password on this page.
          </p>
        )}
      </div>
    </>
  );
}
