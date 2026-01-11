import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session/jwt";

const protectedRoot = "/UMS";
const publicRoute = "/Login";

// Mapping of paths to allowed roles
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/UMS/Customers": ["admin", "staff", "manager"],
  "/UMS/Meters": ["admin", "staff"],
  "/UMS/Readings": ["admin", "officer"],
  "/UMS/Billing": ["admin", "cashier"],
  "/UMS/Payments": ["admin", "cashier"],
  "/UMS/Reports": ["admin", "manager"],
  "/UMS/Users": ["admin"],
  "/UMS/Settings": ["admin", "staff"],
  "/UMS/Dashboard": ["admin", "staff", "officer", "cashier", "manager"],
};

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(protectedRoot);
  const isPublicRoute = path === publicRoute;
  const cookie = req.cookies.get("session")?.value;

  // 1. Unauthenticated users trying to access protected routes
  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL(publicRoute, req.nextUrl));
  }

  if (cookie) {
    const session = await decrypt(cookie);

    // 2. Invalid session treatment
    if (!session?.userId && isProtectedRoute) {
      return NextResponse.redirect(new URL(publicRoute, req.nextUrl));
    }

    // 3. Authenticated users trying to access Login page
    if (session?.userId && isPublicRoute) {
      return NextResponse.redirect(
        new URL(protectedRoot + "/Dashboard", req.nextUrl)
      );
    }

    // 4. Role Based Access Control (RBAC)
    if (session?.userId && isProtectedRoute) {
      const userRole = session.role;

      // Find matching permission (handle subpaths, most specific match first)
      const matchingPath = Object.keys(ROUTE_PERMISSIONS)
        .filter((p) => path === p || path.startsWith(p + "/"))
        .sort((a, b) => b.length - a.length)[0];

      const allowedRoles = matchingPath
        ? ROUTE_PERMISSIONS[matchingPath]
        : null;

      if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to dashboard if trying to access unauthorized page
        console.log("Unauthorized");

        return NextResponse.redirect(
          new URL(protectedRoot + "/Dashboard", req.nextUrl)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};
