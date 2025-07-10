import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/auth/login", "/auth/signup"];

async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("adminToken")?.value;
  const user = await getUserFromToken(token);

  // Logout on visiting /auth/login
  if (pathname === "/auth/login" && token) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.set("adminToken", "", { path: "/", maxAge: 0 });
    return response;
  }

  // Restrict /auth/signup to only SUPER_ADMIN
  if (pathname.startsWith("/auth/signup")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/house/createHouse", request.url)
      );
    }
    // SUPER_ADMIN can access /auth/signup, so allow
    return NextResponse.next();
  }

  // If logged in and visiting /auth/login, redirect to dashboard
  if (user && pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(
      new URL("/admin/house/createHouse", request.url)
    );
  }

  // Restrict /admin pages to logged-in admins
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // If logged in, always redirect to createHouse
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.redirect(
        new URL("/admin/house/createHouse", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
