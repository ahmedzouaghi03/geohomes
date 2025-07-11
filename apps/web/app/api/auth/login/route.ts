import { db } from "@monkeyprint/db";
import { comparePassword } from "@monkeyprint/utils/hash";
import { signInSchema } from "@monkeyprint/utils/zod";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jwt_cookies = await cookies();

    //validate input using zod schema
    const result = signInSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    //find admin by email
    const admin = await db.admin.findUnique({
      where: { email },
    });

    if (!admin || admin.isDeleted) {
      return NextResponse.json({ error: "Incorrect email" }, { status: 401 });
    }

    //compare password
    const passwordMatch = await comparePassword(password, admin.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    //create jwt token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    jwt_cookies.set({
      name: "adminToken",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      message: "Sign in successful",
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "Something went wrong with login" },
      { status: 500 }
    );
  }
}
