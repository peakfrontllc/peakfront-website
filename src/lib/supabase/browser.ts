import { createBrowserClient } from "@supabase/ssr";
import {
  supabasePublishableKey,
  supabasePublicUrl,
} from "@/lib/supabase/public-env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabasePublicUrl(), supabasePublishableKey());
}
