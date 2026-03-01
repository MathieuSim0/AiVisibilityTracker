import { NextResponse } from "next/server";
import { getAllScans } from "@/lib/db";

export async function GET() {
  const scans = await getAllScans();
  return NextResponse.json(scans);
}
