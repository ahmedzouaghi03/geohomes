"use server";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export async function getCurrentUser() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("adminToken")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      id: string;
      email: string;
      role: string;
      name?: string;
      phoneNumbers?: string[];
    };
  } catch {
    return null;
  }
}

export async function refreshToken() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("adminToken")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jwtVerify(token, secret);

    // Create new token with extended expiration
    const newToken = await new SignJWT({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    cookiesStore.set({
      name: "adminToken",
      value: newToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return payload;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}
