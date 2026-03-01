"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { VisibilityScore } from "@/components/VisibilityScore";
import { LLMBreakdown } from "@/components/LLMBreakdown";
import { QueryResults } from "@/components/QueryResults";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
import { Recommendations } from "@/components/Recommendations";
import { HistoryChart } from "@/components/HistoryChart";
import { PerformanceScores } from "@/components/PerformanceScores";
import type { ScanWithDetails, Scan } from "@/types";

type FullScan = ScanWithDetails & { history: Scan[] };

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "queries", label: "Query Results", icon: "🔍" },
  { id: "competitors", label: "Competitors", icon: "🏆" },
  { id: "recommendations", label: "Recommendations", icon: "🎯" },
  { id: "history", label: "History", icon: "📈" },
  { id: "performance", label: "Performance", icon: "⚡" },
];

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = params.scanId as string;

  const [data, setData] = useState<FullScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [perfData, setPerfData] = useState<null | {
    performance: number; seo: number; accessibility: number; bestPractices: number;
    fcp: string; lcp: string; tbt: string; cls: string;
  }>(null);
  const [perfLoading, setPerfLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/scans/${scanId}`);
        if (!res.ok) throw new Error("Scan not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scanId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-spin">⚙</div>
          <p className="text-gray-500">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">❌</div>
          <p className="text-red-500">{error || "Scan not found"}</p>
          <Link href="/" className="text-blue-500 hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const mentionedCount = data.query_results.filter((r) => r.brand_mentioned).length;
  const totalCount = data.query_results.length;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Context bar */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-black/8 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
            ← New scan
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-foreground">{data.domain}</h1>
                {data.sector && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400">
                    {data.sector}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Analyzed {new Date(data.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-500/20 transition-all"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-black/8 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "performance" && perfData === null && data && !perfLoading) {
                  setPerfLoading(true);
                  fetch(`/api/performance?url=${encodeURIComponent(data.domain)}`)
                    .then((r) => r.json())
                    .then((d) => { setPerfData(d); setPerfLoading(false); })
                    .catch(() => setPerfLoading(false));
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? "text-foreground border-blue-500"
                  : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
                <VisibilityScore score={data.overall_score || 0} size={180} />
                <div className="text-center text-sm text-gray-500">AI Visibility Score</div>
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { label: "Mention Rate", value: `${Math.round(data.mention_rate || 0)}%`, sub: `${mentionedCount} of ${totalCount} queries`, icon: "📍", color: "text-green-500" },
                  { label: "Queries Analyzed", value: String(data.total_queries || 0), sub: "across 3 AI assistants", icon: "🔍", color: "text-blue-500" },
                  { label: "Competitors Found", value: String(data.competitors.length), sub: "entities identified", icon: "🏆", color: "text-orange-500" },
                  { label: "Recommendations", value: String(data.recommendations.length), sub: "actionable improvements", icon: "🎯", color: "text-purple-500" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{stat.icon}</span>
                      <span className="text-sm text-gray-500">{stat.label}</span>
                    </div>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>🤖</span> Results by AI Assistant
              </h2>
              <LLMBreakdown results={data.query_results} />
            </div>

            <div className="bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">How the score is calculated</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  { label: "Mention Rate", weight: "40%", desc: "% of queries where brand is mentioned" },
                  { label: "Position Score", weight: "25%", desc: "How early the brand appears in responses" },
                  { label: "Sentiment", weight: "20%", desc: "% of positive vs negative mentions" },
                  { label: "LLM Coverage", weight: "15%", desc: "% of AI assistants that mention the brand" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className="text-blue-500 dark:text-blue-400 font-bold">{item.weight}</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "queries" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">Query-by-Query Results</h2>
              <p className="text-sm text-gray-500">Each query was sent to ChatGPT, Gemini, and Perplexity. Click any row to see the full response.</p>
            </div>
            <QueryResults results={data.query_results} domain={data.domain} />
          </div>
        )}

        {activeTab === "competitors" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">Competitor Analysis</h2>
              <p className="text-sm text-gray-500">Brands that appeared in AI responses ahead of you.</p>
            </div>
            <CompetitorAnalysis competitors={data.competitors} totalResults={data.query_results.length} />
          </div>
        )}

        {activeTab === "recommendations" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">GEO Recommendations</h2>
              <p className="text-sm text-gray-500">
                Actionable steps to improve <strong className="text-foreground">{data.domain}</strong>&apos;s visibility in AI assistants.
              </p>
            </div>
            <Recommendations recommendations={data.recommendations} />
          </div>
        )}

        {activeTab === "performance" && (
          <div>
            {perfLoading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Fetching PageSpeed data… (may take up to 60s)</p>
              </div>
            )}
            {!perfLoading && perfData && !("error" in perfData) && (
              <PerformanceScores data={perfData} />
            )}
            {!perfLoading && perfData && "error" in perfData && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center max-w-md mx-auto">
                {(perfData as { error: string }).error === "no_api_key" ? (
                  <>
                    <span className="text-4xl">🔑</span>
                    <h3 className="text-lg font-semibold text-foreground">Google API Key Required</h3>
                    <p className="text-sm text-gray-500">
                      Add <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono text-xs">GOOGLE_API_KEY=your_key</code> to your <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono text-xs">.env.local</code> to enable performance analysis.
                    </p>
                    <p className="text-xs text-gray-400">
                      Get a free key at{" "}
                      <span className="text-blue-500">console.cloud.google.com</span>
                      {" "}→ Enable &quot;PageSpeed Insights API&quot; → Create API Key
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl">⏱️</span>
                    <h3 className="text-lg font-semibold text-foreground">Analysis timed out</h3>
                    <p className="text-sm text-gray-500">
                      PageSpeed Insights took too long to analyze this site. Try again — complex sites can take up to 60 seconds.
                    </p>
                    <button
                      onClick={() => { setPerfData(null); }}
                      className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm hover:bg-blue-500/20 transition-all"
                    >
                      Try again
                    </button>
                  </>
                )}
              </div>
            )}
            {!perfLoading && !perfData && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
                <span className="text-4xl">⚡</span>
                <p className="text-sm">Click the Performance tab to load data</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">Score History</h2>
              <p className="text-sm text-gray-500">
                Track <strong className="text-foreground">{data.domain}</strong>&apos;s AI visibility score over time.
              </p>
            </div>
            <div className="bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-xl p-6">
              <HistoryChart history={data.history} currentScanId={scanId} />
            </div>
            {data.history.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">All Scans</h3>
                <div className="space-y-2">
                  {data.history.map((scan) => (
                    <Link
                      key={scan.id}
                      href={`/results/${scan.id}`}
                      className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                        scan.id === scanId
                          ? "border-blue-500/30 bg-blue-500/10"
                          : "border-black/8 dark:border-white/8 bg-black/3 dark:bg-white/3 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(scan.created_at).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{Math.round(scan.mention_rate || 0)}% mentioned</span>
                        <span className={`font-bold text-lg ${
                          (scan.overall_score || 0) >= 70 ? "text-green-500"
                          : (scan.overall_score || 0) >= 40 ? "text-yellow-500"
                          : "text-red-500"
                        }`}>
                          {scan.overall_score || 0}
                        </span>
                        {scan.id === scanId && <span className="text-xs text-blue-500 dark:text-blue-400">Current</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
