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

  // Debug logging for production
  if (process.env.NODE_ENV === "production") {
    console.log("Middleware - Path:", pathname);
    console.log("Middleware - Token exists:", !!token);
    console.log("Middleware - User exists:", !!user);
  }

  if (pathname === "/auth/login") {
    if (token && user) {
      // If logged in with valid token, redirect to dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (token && !user) {
      // If token exists but invalid, clear it and allow login
      const response = NextResponse.next();
      response.cookies.set("adminToken", "", { path: "/", maxAge: 0 });
      return response;
    }
    // If no token, allow access to login page
    return NextResponse.next();
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
