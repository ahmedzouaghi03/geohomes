"use server";

import { db } from "@monkeyprint/db";

export async function getAdminById(id: string) {
  try {
    const admin = await db.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumbers: true,
      },
    });

    return admin;
  } catch (error) {
    console.error("Failed to fetch admin details:", error);
    return null;
  }
}
