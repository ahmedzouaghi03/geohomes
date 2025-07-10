"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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
