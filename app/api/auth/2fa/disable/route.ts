import { NextRequest, NextResponse } from "next/server";
import { auth, unstable_update as update } from "@/auth";
import { verify2FAToken, disable2FA } from "@/lib/auth-db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { code } = await req.json();
  const valid = verify2FAToken(session.user.id, code);
  if (!valid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  disable2FA(session.user.id);
  await update({ user: { twoFaEnabled: false, twoFaVerified: true } });

  return NextResponse.json({ success: true });
}
