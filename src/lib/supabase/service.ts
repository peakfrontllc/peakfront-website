import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function supabaseUrl() {
  const raw = process.env.SUPABASE_URL?.trim() || "";
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url.origin;
  } catch {
    return raw.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
  }
}

function supabaseServiceKey() {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    ""
  );
}

let serviceClient: SupabaseClient | null = null;

export function usesServiceRole() {
  return Boolean(supabaseUrl() && supabaseServiceKey());
}

export function getServiceClient() {
  if (!usesServiceRole()) {
    throw new Error(
      "Add SUPABASE_URL and SUPABASE_SECRET_KEY, then redeploy.",
    );
  }

  if (!serviceClient) {
    serviceClient = createClient(supabaseUrl(), supabaseServiceKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return serviceClient;
}
