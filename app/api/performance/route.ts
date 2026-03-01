import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 90;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");
  const strategy = searchParams.get("strategy") || "mobile";

  if (!rawUrl) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  // Normalize domain to https URL
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "no_api_key" },
      { status: 503 }
    );
  }

  const psiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  psiUrl.searchParams.set("url", url);
  psiUrl.searchParams.set("strategy", strategy);
  psiUrl.searchParams.set("key", apiKey);
  psiUrl.searchParams.append("category", "performance");
  psiUrl.searchParams.append("category", "seo");
  psiUrl.searchParams.append("category", "accessibility");
  psiUrl.searchParams.append("category", "best-practices");

  try {
    const res = await fetch(psiUrl.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(75_000),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message ?? "PageSpeed API error";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const data = await res.json();
    const cats = data.lighthouseResult?.categories ?? {};
    const audits = data.lighthouseResult?.audits ?? {};

    const score = (key: string) => Math.round((cats[key]?.score ?? 0) * 100);

    const metricValue = (auditId: string): string => {
      const audit = audits[auditId];
      if (!audit) return "—";
      return audit.displayValue ?? "—";
    };

    return NextResponse.json({
      performance: score("performance"),
      seo: score("seo"),
      accessibility: score("accessibility"),
      bestPractices: score("best-practices"),
      fcp: metricValue("first-contentful-paint"),
      lcp: metricValue("largest-contentful-paint"),
      tbt: metricValue("total-blocking-time"),
      cls: metricValue("cumulative-layout-shift"),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
