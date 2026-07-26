import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/features/auth/auth";

/**
 * Routes that are always public.
 * /login, /signup, and all /api/* paths are excluded from protection.
 */
const PUBLIC_PATHS = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through without a session check.
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check the Better Auth session. auth.api.getSession runs in the Node.js
  // runtime (default for Next.js 16 Proxy) so we can import auth directly.
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    // Preserve the original destination so the login page can redirect back.
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api/*        (API routes — auth handlers manage their own 401s)
     * - /_next/static (Next.js static assets)
     * - /_next/image  (image optimisation)
     * - /favicon.ico, /sitemap.xml, /robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
