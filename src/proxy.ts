import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  supabasePublishableKey,
  supabasePublicUrl,
  usesPublicSupabaseAuth,
} from "@/lib/supabase/public-env";

const PUBLIC_PATHS = new Set([
  "/dashboard/login",
  "/dashboard/forgot-password",
  "/dashboard/reset-password",
  "/dashboard/auth/callback",
  "/dashboard/auth/confirm",
  "/dashboard/auth/sign-out",
]);

function isStaffPage(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

function isProtectedApi(pathname: string) {
  return (
    pathname === "/api/projects" ||
    pathname.startsWith("/api/projects/") ||
    pathname === "/api/erp" ||
    pathname.startsWith("/api/erp/")
  );
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  return to;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const staffPage = isStaffPage(pathname);
  const protectedApi = isProtectedApi(pathname);

  if (!staffPage && !protectedApi) {
    return NextResponse.next();
  }

  if (!usesPublicSupabaseAuth()) {
    if (protectedApi) {
      return NextResponse.json(
        { error: "Staff sign-in is not configured." },
        { status: 503 },
      );
    }
    if (staffPage && !PUBLIC_PATHS.has(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabasePublicUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const isPublicStaffPage = PUBLIC_PATHS.has(pathname);

  if (protectedApi && !user) {
    return copyCookies(
      response,
      NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    );
  }

  if (staffPage && !isPublicStaffPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/login";
    url.searchParams.set("next", pathname);
    return copyCookies(response, NextResponse.redirect(url));
  }

  if (user && (pathname === "/dashboard/login" || pathname === "/dashboard/forgot-password")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return copyCookies(response, NextResponse.redirect(url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/api/projects", "/api/projects/:path*", "/api/erp/:path*"],
};
