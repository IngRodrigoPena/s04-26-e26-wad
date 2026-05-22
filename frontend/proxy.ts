import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware only handles static assets and public routes.
 * Auth protection is client-side via AuthGuard because the backend
 * returns the token in the response body (not in cookies), so the
 * edge middleware has no way to verify authentication.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all public routes, static assets, and API calls
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // For all remaining routes, let the client-side AuthGuard handle auth
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo).*)"],
};
