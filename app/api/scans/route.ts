import { NextResponse } from "next/server";
import { getAllScans } from "@/lib/db";

export async function GET() {
  const scans = getAllScans();
  return NextResponse.json(scans);
}
