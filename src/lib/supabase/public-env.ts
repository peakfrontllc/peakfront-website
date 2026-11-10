export function supabasePublicUrl() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
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

export function supabasePublishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
}

export function usesPublicSupabaseAuth() {
  return Boolean(supabasePublicUrl() && supabasePublishableKey());
}
