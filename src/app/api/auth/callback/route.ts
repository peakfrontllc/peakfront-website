import { NextResponse } from "next/server";
import {
  clearStateCookie,
  decapCallbackUrl,
  decapOrigin,
  handshakePage,
  oauthCredentials,
  readStateCookie,
  sameSecret,
} from "@/lib/decap-oauth";

export const dynamic = "force-dynamic";

function html(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = decapOrigin(request);
  const secure = origin.startsWith("https");
  const finish = (body: string, status = 400) => {
    const response = html(`<!doctype html><html><body><p>${body}</p></body></html>`, status);
    response.cookies.set("decap_oauth_state", "", { ...clearStateCookie(secure), maxAge: 0 });
    return response;
  };

  const githubError = url.searchParams.get("error");
  if (githubError) return finish("GitHub sign-in was cancelled.");

  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";
  if (!code || !sameSecret(state, readStateCookie(request))) {
    return finish("This sign-in link is no longer valid. Close the window and try Login with GitHub again.");
  }

  const { clientId, clientSecret } = oauthCredentials();
  if (!clientId || !clientSecret) return finish("GitHub login is not configured yet.", 503);

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: decapCallbackUrl(origin),
    }),
  });
  const tokenBody = (await tokenResponse.json()) as { access_token?: string; error?: string };
  const token = tokenBody.access_token ?? "";
  if (!tokenResponse.ok || !/^[A-Za-z0-9_]+$/.test(token)) {
    return finish("GitHub did not accept the sign-in. Check the OAuth app callback URL and try again.");
  }

  const response = html(handshakePage(token));
  response.cookies.set("decap_oauth_state", "", { ...clearStateCookie(secure), maxAge: 0 });
  return response;
}
