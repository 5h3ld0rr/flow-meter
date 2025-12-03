import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { NextURL } from "next/dist/server/web/next-url";

const protectedRoute = "/UMS";
const publicRoute = "/Login";

const UnAuthorizedResponse = (url: NextURL) =>
  NextResponse.redirect(new URL(publicRoute, url));

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(protectedRoute);
  const isPublicRoute = publicRoute === path;
  const cookie = req.cookies.get("session")?.value;

  if (!isPublicRoute && !cookie) {
    return UnAuthorizedResponse(req.nextUrl);
  }

  if (cookie) {
    const session = await decrypt(cookie);
    if (!session?.userId && isProtectedRoute) {
      return UnAuthorizedResponse(req.nextUrl);
    }
    if (session?.userId && !isProtectedRoute) {
      return NextResponse.redirect(
        new URL(protectedRoute + "/Dashboard", req.nextUrl)
      );
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
