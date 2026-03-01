import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generate2FASecret } from "@/lib/auth-db";
import QRCode from "qrcode";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { secret, otpAuthUrl } = await generate2FASecret(session.user.id);
  const qrDataUrl = await QRCode.toDataURL(otpAuthUrl);

  return NextResponse.json({ secret, qrDataUrl });
}
