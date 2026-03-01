import { NextRequest, NextResponse } from "next/server";
import { getFullScan, getScansByDomain } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scan = getFullScan(id);
  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  // Include historical scans for the same domain
  const history = getScansByDomain(scan.domain);

  return NextResponse.json({ ...scan, history });
}
