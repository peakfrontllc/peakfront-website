import { timingSafeEqual } from "node:crypto";

const STATE_COOKIE = "decap_oauth_state";

export function decapOrigin(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (host) return `${proto || "https"}://${host}`;
  return url.origin;
}

export function decapCallbackUrl(origin: string) {
  return `${origin}/api/auth/callback`;
}

export function oauthCredentials() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET?.trim() ?? "";
  return { clientId, clientSecret };
}

export function stateCookie(value: string, secure: boolean) {
  return {
    name: STATE_COOKIE,
    value,
    options: {
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/api/auth",
      maxAge: 60 * 10,
    },
  };
}

export function readStateCookie(request: Request) {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|; )${STATE_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function clearStateCookie(secure: boolean) {
  return stateCookie("", secure).options;
}

export function sameSecret(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export function handshakePage(token: string) {
  const payload = JSON.stringify({ token, provider: "github" }).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Peakfront sign-in</title></head>
<body>
<script>
(function () {
  if (!window.opener) {
    document.body.textContent = "Close this window and use Login with GitHub from the admin page.";
    return;
  }
  function receiveMessage(event) {
    window.opener.postMessage('authorization:github:success:${payload}', event.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;
}
