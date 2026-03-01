import { NextRequest, NextResponse } from "next/server";
import { auth, unstable_update as update } from "@/auth";
import { verify2FAToken } from "@/lib/auth-db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

  const valid = verify2FAToken(session.user.id, code);
  if (!valid) {
    return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
  }

  await update({ user: { twoFaVerified: true } });

  return NextResponse.json({ success: true });
}
