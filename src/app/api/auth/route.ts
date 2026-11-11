import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { decapCallbackUrl, decapOrigin, oauthCredentials, stateCookie } from "@/lib/decap-oauth";

export const dynamic = "force-dynamic";

function html(message: string, status = 200) {
  return new NextResponse(`<!doctype html><html><body><p>${message}</p></body></html>`, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  const { clientId, clientSecret } = oauthCredentials();
  if (!clientId || !clientSecret) {
    return html("GitHub login is not configured yet. Add the OAuth app keys on Vercel, then redeploy.", 503);
  }

  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") || "repo";
  if (!/^[\w,:]+$/.test(scope)) return html("That GitHub permission request is not allowed.", 400);

  const origin = decapOrigin(request);
  const state = randomUUID();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", decapCallbackUrl(origin));
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("state", state);

  const response = NextResponse.redirect(authorize);
  const cookie = stateCookie(state, origin.startsWith("https"));
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
