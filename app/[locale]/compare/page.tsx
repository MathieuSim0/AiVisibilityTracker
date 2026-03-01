"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { ComparisonResults, type ComparisonEntry } from "@/components/ComparisonResults";

type Phase = "input" | "analyzing" | "done";

export default function ComparePage() {
  const t = useTranslations("compare");

  const [domains, setDomains] = useState<string[]>(["", ""]);
  const [phase, setPhase] = useState<Phase>("input");
  const [results, setResults] = useState<ComparisonEntry[]>([]);
  const [currentDomain, setCurrentDomain] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const filledDomains = domains.map((d) => d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]).filter(Boolean);

  const addDomain = () => {
    if (domains.length < 4) setDomains([...domains, ""]);
  };

  const removeDomain = (idx: number) => {
    if (domains.length <= 2) return;
    setDomains(domains.filter((_, i) => i !== idx));
  };

  const analyzeDomain = async (domain: string): Promise<ComparisonEntry | null> => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
      signal: ctrl.signal,
    });

    if (!res.ok || !res.body) return null;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let entry: ComparisonEntry | null = null;
    let capturedSector = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const dataMatch = line.match(/^data:\s*(.+)$/);
        if (!dataMatch) continue;
        try {
          const payload = JSON.parse(dataMatch[1].trim());
          // Capture sector from "sector" event (has sector but no scanId)
          if (payload.sector && payload.scanId === undefined) {
            capturedSector = payload.sector;
          }
          // Capture from "complete" event (has scanId + score)
          if (payload.scanId !== undefined && payload.score !== undefined) {
            entry = {
              domain,
              scanId: String(payload.scanId),
              score: Math.round(payload.score ?? 0),
              mentionRate: payload.mention_rate ?? 0,
              sector: capturedSector,
            };
          }
        } catch {
          // ignore parse errors
        }
      }
    }

    return entry;
  };

  const handleStart = async () => {
    if (filledDomains.length < 2) {
      setError(t("min_domains"));
      return;
    }
    setError("");
    setResults([]);
    setPhase("analyzing");

    const accumulated: ComparisonEntry[] = [];

    for (let i = 0; i < filledDomains.length; i++) {
      const domain = filledDomains[i];
      setCurrentDomain(domain);
      setCurrentIndex(i);

      try {
        const entry = await analyzeDomain(domain);
        if (entry) {
          accumulated.push(entry);
          setResults([...accumulated]);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") break;
        // Skip failed domains, continue
      }
    }

    setPhase("done");
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setPhase("input");
    setResults([]);
    setDomains(["", ""]);
    setError("");
  };

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-500 dark:text-blue-400 text-xs font-medium mb-6">
            <span>⚡</span>
            Multi-site comparison
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("title")}{" "}
            <span className="text-blue-500">{t("title_highlight")}</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Input phase */}
        {phase === "input" && (
          <div className="bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-2xl p-8 space-y-4">
            {domains.map((domain, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    {t("domain_label", { n: idx + 1 })}
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => {
                      const updated = [...domains];
                      updated[idx] = e.target.value;
                      setDomains(updated);
                    }}
                    placeholder={t("placeholder")}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-foreground placeholder-gray-400 dark:placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                {domains.length > 2 && (
                  <button
                    onClick={() => removeDomain(idx)}
                    className="mt-5 text-gray-400 hover:text-red-400 transition-colors text-sm"
                    title={t("remove")}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex items-center gap-4 pt-2">
              {domains.length < 4 && (
                <button
                  onClick={addDomain}
                  className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
                >
                  + {t("add_domain")}
                </button>
              )}
              <button
                onClick={handleStart}
                disabled={filledDomains.length < 2}
                className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("cta")}
              </button>
            </div>
          </div>
        )}

        {/* Analyzing phase */}
        {phase === "analyzing" && (
          <div className="space-y-8">
            <div className="bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("analyzing", { domain: currentDomain })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("analyzing_progress", {
                      current: currentIndex + 1,
                      total: filledDomains.length,
                    })}
                  </p>
                </div>
              </div>

              {/* Progress steps */}
              <div className="flex gap-2">
                {filledDomains.map((d, idx) => (
                  <div
                    key={d}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                      idx < currentIndex
                        ? "bg-green-500"
                        : idx === currentIndex
                        ? "bg-blue-500"
                        : "bg-black/10 dark:bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-1.5">
                {filledDomains.map((d, idx) => (
                  <div key={d} className="flex-1 text-center">
                    <span className={`text-xs ${idx <= currentIndex ? "text-foreground" : "text-gray-400"}`}>
                      {d}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partial results */}
            {results.length > 0 && (
              <div className="opacity-70">
                <ComparisonResults results={results} />
              </div>
            )}
          </div>
        )}

        {/* Done phase */}
        {phase === "done" && results.length > 0 && (
          <div className="space-y-8">
            <ComparisonResults results={results} />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 text-sm transition-all"
              >
                ← New comparison
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
