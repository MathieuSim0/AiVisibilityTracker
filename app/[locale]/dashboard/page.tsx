import { auth } from "@/auth";
import { getScansByUser } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Scan } from "@/types";

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-black/10 dark:text-white/10" />
        <circle
          cx="36" cy="36" r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
        {score}
      </span>
    </div>
  );
}

function ScanCard({ scan }: { scan: Scan }) {
  const mentionRate = Math.round(scan.mention_rate ?? 0);
  const date = new Date(scan.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <Link
      href={`/results/${scan.id}`}
      className="group flex items-center gap-4 bg-black/5 dark:bg-white/5 hover:bg-black/8 dark:hover:bg-white/8 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 rounded-xl p-4 transition-all"
    >
      <ScoreRing score={scan.overall_score ?? 0} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground truncate">{scan.domain}</span>
          {scan.sector && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400">
              {scan.sector}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
          <span>{date}</span>
          <span>•</span>
          <span>{mentionRate}% mention rate</span>
          {scan.total_queries && (
            <>
              <span>•</span>
              <span>{scan.total_queries} queries</span>
            </>
          )}
        </div>
      </div>
      <div className="text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors flex-shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-5">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("dashboard");

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.twoFaEnabled && !session.user.twoFaVerified) {
    redirect("/auth/2fa");
  }

  const scans = getScansByUser(session.user.id);

  const totalScans = scans.length;
  const uniqueDomains = new Set(scans.map((s) => s.domain)).size;
  const avgScore = totalScans > 0
    ? Math.round(scans.reduce((sum, s) => sum + (s.overall_score ?? 0), 0) / totalScans)
    : 0;
  const bestScan = scans.reduce<Scan | null>(
    (best, s) => (!best || (s.overall_score ?? 0) > (best.overall_score ?? 0) ? s : best),
    null
  );

  const domainMap = new Map<string, Scan[]>();
  for (const scan of scans) {
    if (!domainMap.has(scan.domain)) domainMap.set(scan.domain, []);
    domainMap.get(scan.domain)!.push(scan);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("welcome")}{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t("subtitle")}</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            {t("new_analysis")}
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label={t("total_scans")} value={totalScans} />
          <StatCard label={t("domains")} value={uniqueDomains} />
          <StatCard label={t("avg_score")} value={totalScans > 0 ? `${avgScore}/100` : "—"} />
          <StatCard
            label={t("best_score")}
            value={bestScan ? `${bestScan.overall_score}/100` : "—"}
            sub={bestScan?.domain}
          />
        </div>

        {/* 2FA security notice */}
        {!session.user.twoFaEnabled && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="text-sm font-medium text-yellow-600 dark:text-yellow-300">{t("security_title")}</div>
                <div className="text-xs text-yellow-600/70 dark:text-yellow-500/70 mt-0.5">{t("security_subtitle")}</div>
              </div>
            </div>
            <Link
              href="/auth/2fa/setup"
              className="flex-shrink-0 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-300 text-xs font-semibold hover:bg-yellow-500/20 transition-all"
            >
              {t("enable_2fa")}
            </Link>
          </div>
        )}

        {/* Scan history */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t("history_title")}</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">{totalScans} scan{totalScans !== 1 ? "s" : ""}</span>
          </div>

          {totalScans === 0 ? (
            <div className="text-center py-16 space-y-4 bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-xl">
              <div className="text-5xl">📡</div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{t("empty_title")}</p>
                <p className="text-gray-500 text-sm mt-1">{t("empty_subtitle")}</p>
              </div>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20"
              >
                {t("empty_cta")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map((scan) => <ScanCard key={scan.id} scan={scan} />)}
            </div>
          )}
        </div>

        {/* Domain groups */}
        {domainMap.size > 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">{t("domains_title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from(domainMap.entries()).map(([domain, domainScans]) => {
                const latest = domainScans[0];
                const trend = domainScans.length >= 2
                  ? (domainScans[0].overall_score ?? 0) - (domainScans[1].overall_score ?? 0)
                  : null;
                return (
                  <div key={domain} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <ScoreRing score={latest.overall_score ?? 0} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{domain}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {domainScans.length} scan{domainScans.length !== 1 ? "s" : ""}
                        {trend !== null && (
                          <span className={`ml-2 font-semibold ${trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-400"}`}>
                            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/results/${latest.id}`} className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 flex-shrink-0">
                      View →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-black/8 dark:border-white/5 pt-6 flex items-center justify-between text-sm text-gray-400 dark:text-gray-600">
          <span>{t("signed_in")} {session.user.email}</span>
          <div className="flex items-center gap-4">
            {session.user.twoFaEnabled ? (
              <span className="text-green-500 text-xs">{t("twofa_active")}</span>
            ) : (
              <Link href="/auth/2fa/setup" className="text-yellow-500 hover:text-yellow-400 text-xs">
                {t("enable_2fa")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
