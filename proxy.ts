import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define paths that need protection
  if (pathname.startsWith("/admin") || pathname === "/api/release-funds") {
    // 2. Allow access to the login page itself
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // 3. Check for the admin_auth cookie
    const adminSecret = process.env.ADMIN_SECRET;
    const authCookie = request.cookies.get("admin_auth")?.value;

    // 4. Validate session
    if (!authCookie || authCookie !== adminSecret) {
      // For API routes, return 401 instead of redirecting
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Matching Paths
export const config = {
  matcher: ["/admin/:path*", "/api/release-funds"],
};
