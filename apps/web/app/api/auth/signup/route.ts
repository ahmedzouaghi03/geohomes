import { db } from "@monkeyprint/db";
import { hashPassword } from "@monkeyprint/utils/hash";
import { registerSchema } from "@monkeyprint/utils/zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    //validate input using zod schema
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password, role, phoneNumber } = result.data;

    // Check if user with this email already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    //hashing the password
    const newAdmin = await db.admin.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        role,
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
      },
    });

    //remove the password from response
    const { password: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json(
      { message: "Admin created successfully", admin: adminWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Internal server error in creating admin" },
      { status: 500 }
    );
  }
}
