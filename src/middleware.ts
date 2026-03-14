import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/backend/utils/jwt.util";
import { appConfig } from "@/config/app.config";

const PUBLIC_PATHS = ["/login", "/api/auth", "/api/health"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths, static files, and Next.js internals
  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(appConfig.auth.cookieName)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set(appConfig.auth.cookieName, "", {
      maxAge: 0,
      path: "/",
    });
    return response;
  }

  // Add user info to headers for downstream use
  const headers = new Headers(request.headers);
  headers.set("x-user-id", payload.id);
  headers.set("x-user-email", payload.email);
  headers.set("x-user-role", payload.role);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
