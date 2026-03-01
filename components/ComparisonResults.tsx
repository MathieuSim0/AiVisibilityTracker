"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export interface ComparisonEntry {
  domain: string;
  scanId: string;
  score: number;
  mentionRate: number;
  sector: string;
}

interface Props {
  results: ComparisonEntry[];
}

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

function barColor(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Excellent";
  if (score >= 40) return "Correct";
  return "Faible";
}

export function ComparisonResults({ results }: Props) {
  const t = useTranslations("compare");

  const sorted = [...results].sort((a, b) => b.score - a.score);

  const medals = ["🥇", "🥈", "🥉", "4️⃣"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {t("results_title")}
        </h2>
        <p className="text-sm text-gray-500">
          {sorted.length} domains analyzed · ranked by AI Visibility Score
        </p>
      </div>

      {/* Winner banner */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center gap-4">
        <span className="text-4xl">🏆</span>
        <div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wide mb-0.5">
            {t("winner")}
          </div>
          <div className="text-xl font-bold text-foreground">{sorted[0]?.domain}</div>
          <div className={`text-sm font-semibold ${scoreColor(sorted[0]?.score ?? 0)}`}>
            Score {sorted[0]?.score ?? 0} / 100
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-2xl p-6 space-y-5">
        {sorted.map((entry, idx) => (
          <div key={entry.domain} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{medals[idx] ?? `${idx + 1}.`}</span>
                <span className="font-semibold text-foreground">{entry.domain}</span>
                {entry.sector && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400">
                    {entry.sector}
                  </span>
                )}
              </div>
              <span className={`text-2xl font-bold ${scoreColor(entry.score)}`}>
                {entry.score}
                <span className="sr-only"> — {scoreLabel(entry.score)}</span>
              </span>
            </div>
            <div
              className="h-3 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={entry.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Score ${entry.domain} : ${entry.score}/100`}
            >
              <div
                className={`h-full ${barColor(entry.score)} rounded-full transition-all duration-700`}
                style={{ width: `${entry.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Metrics table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/8 dark:border-white/8">
              <th className="text-left py-3 pr-6 text-gray-500 font-medium">{t("rank")}</th>
              <th className="text-left py-3 pr-6 text-gray-500 font-medium">Domain</th>
              <th className="text-right py-3 pr-6 text-gray-500 font-medium">{t("score")}</th>
              <th className="text-right py-3 pr-6 text-gray-500 font-medium">{t("mention_rate")}</th>
              <th className="text-left py-3 pr-6 text-gray-500 font-medium">{t("sector")}</th>
              <th className="text-right py-3 text-gray-500 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, idx) => (
              <tr
                key={entry.domain}
                className="border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
              >
                <td className="py-4 pr-6">
                  <span className="text-lg">{medals[idx] ?? `${idx + 1}`}</span>
                </td>
                <td className="py-4 pr-6 font-semibold text-foreground">{entry.domain}</td>
                <td className={`py-4 pr-6 text-right font-bold text-xl ${scoreColor(entry.score)}`}>
                  {entry.score}
                  <span className="sr-only"> ({scoreLabel(entry.score)})</span>
                </td>
                <td className="py-4 pr-6 text-right text-foreground">
                  {Math.round(entry.mentionRate)}%
                </td>
                <td className="py-4 pr-6 text-gray-500">
                  {entry.sector || "—"}
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`/results/${entry.scanId}`}
                    className="text-blue-500 hover:text-blue-400 text-xs font-medium whitespace-nowrap"
                  >
                    {t("view_results")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
