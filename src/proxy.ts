import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    // Only redirect authenticated users away from / on a direct visit.
    // If they navigate here from within the app (e.g. clicking a Home link),
    // the Referer will start with the site origin — let them through.
    const referer = request.headers.get("referer");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const isInternalNav = referer?.startsWith(siteUrl) ?? false;

    if (sessionCookie && !isInternalNav) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If NOT authenticated and visiting a private route → go to landing page
  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*"],
};
