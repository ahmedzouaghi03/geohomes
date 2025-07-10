import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@monkeyprint/utils/email";

export async function POST(req: Request) {
  const data = await req.json();
  const { recipient, name, email, subject, message } = data;
  try {
    const res = await sendContactFormEmail({
      recipient,
      name,
      email,
      subject,
      message,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
