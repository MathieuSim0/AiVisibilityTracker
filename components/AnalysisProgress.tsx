"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LLMName } from "@/types";

interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
  detail?: string;
}

interface Props {
  domain: string;
  onComplete?: (scanId: string) => void;
  onError?: (message: string) => void;
}

const LLM_ICONS: Record<LLMName | string, string> = {
  chatgpt: "🤖",
  gemini: "✨",
  perplexity: "🔍",
};

const LLM_LABELS: Record<LLMName | string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
};

export function AnalysisProgress({ domain, onComplete, onError }: Props) {
  const router = useRouter();
  const [steps, setSteps] = useState<ProgressStep[]>([
    { id: "sector", label: "Detecting industry sector", status: "pending" },
    { id: "queries", label: "Generating relevant queries", status: "pending" },
    { id: "llm_queries", label: "Querying AI assistants", status: "pending" },
    { id: "competitors", label: "Analyzing competitors", status: "pending" },
    { id: "scoring", label: "Calculating visibility scores", status: "pending" },
    { id: "recommendations", label: "Generating recommendations", status: "pending" },
  ]);
  const [currentLLM, setCurrentLLM] = useState<string>("");
  const [llmProgress, setLlmProgress] = useState({ index: 0, total: 0, query: "" });
  const [sectorInfo, setSectorInfo] = useState<{ sector: string; description: string } | null>(null);
  const [queriesFound, setQueriesFound] = useState<string[]>([]);
  const [resultCount, setResultCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev.slice(-20), message]);
  };

  const updateStep = (id: string, status: ProgressStep["status"], detail?: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, detail: detail ?? s.detail } : s))
    );
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startAnalysis = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });

        if (!response.ok) {
          throw new Error("Failed to start analysis");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          let currentEvent = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ") && currentEvent) {
              try {
                const data = JSON.parse(line.slice(6));

                switch (currentEvent) {
                  case "step":
                    updateStep(data.step, "active");
                    addLog(`▶ ${data.message}`);
                    break;

                  case "sector":
                    setSectorInfo(data);
                    updateStep("sector", "done", data.sector);
                    addLog(`✓ Sector detected: ${data.sector}`);
                    break;

                  case "queries":
                    setQueriesFound(data.queries);
                    updateStep("queries", "done", `${data.queries.length} queries generated`);
                    addLog(`✓ ${data.queries.length} queries ready`);
                    break;

                  case "llm_progress":
                    setCurrentLLM(data.llm);
                    setLlmProgress({ index: data.index, total: data.total, query: data.query });
                    updateStep("llm_queries", "active", `${data.index}/${data.total} — ${LLM_LABELS[data.llm] || data.llm}`);
                    addLog(`${LLM_ICONS[data.llm] || "🔷"} ${LLM_LABELS[data.llm]}: "${data.query.slice(0, 50)}..."`);
                    break;

                  case "result":
                    setResultCount((n) => n + 1);
                    if (data.brand_mentioned) {
                      addLog(`  ↳ ✅ Brand mentioned (position ${data.mention_position}, ${data.sentiment})`);
                    } else {
                      addLog(`  ↳ ❌ Brand not mentioned`);
                    }
                    break;

                  case "competitors":
                    updateStep("competitors", "done", `${data.competitors.length} competitors found`);
                    addLog(`✓ ${data.competitors.length} competitors identified`);
                    break;

                  case "scoring":
                    updateStep("scoring", "done");
                    break;

                  case "recommendations":
                    updateStep("recommendations", "done", `${data.recommendations.length} recommendations`);
                    addLog(`✓ ${data.recommendations.length} recommendations generated`);
                    break;

                  case "complete":
                    updateStep("llm_queries", "done");
                    addLog(`🎉 Analysis complete! Score: ${data.score}/100`);
                    setTimeout(() => {
                      if (onComplete) onComplete(data.scanId);
                      else router.push(`/results/${data.scanId}`);
                    }, 800);
                    break;

                  case "error":
                    addLog(`❌ Error: ${data.message}`);
                    if (onError) onError(data.message);
                    break;
                }
              } catch {
                // Skip malformed events
              }
              currentEvent = "";
            }
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Analysis failed";
        addLog(`❌ ${message}`);
        if (onError) onError(message);
      }
    };

    startAnalysis();

    return () => {
      // cleanup
    };
  }, [domain]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const overallProgress =
    llmProgress.total > 0
      ? Math.round((llmProgress.index / llmProgress.total) * 100)
      : steps.filter((s) => s.status === "done").length > 0
      ? Math.round((steps.filter((s) => s.status === "done").length / steps.length) * 100)
      : 5;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-blue-400">
          <span className="animate-spin text-xl">⚙</span>
          <span className="font-semibold text-lg">Analyzing {domain}</span>
        </div>
        {sectorInfo && (
          <p className="text-gray-400 text-sm">{sectorInfo.sector} — {sectorInfo.description}</p>
        )}
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Overall Progress</span>
          <span aria-hidden="true">{overallProgress}%</span>
        </div>
        <div
          className="w-full bg-gray-800 rounded-full h-2"
          role="progressbar"
          aria-valuenow={overallProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression globale : ${overallProgress}%`}
        >
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2" role="status" aria-label="Étapes de l'analyse">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              step.status === "active"
                ? "bg-blue-500/10 border border-blue-500/30"
                : step.status === "done"
                ? "bg-green-500/5 border border-green-500/20"
                : "bg-gray-800/50 border border-gray-700/30"
            }`}
          >
            <div className="text-lg flex-shrink-0">
              {step.status === "done" && "✅"}
              {step.status === "active" && (
                <span className="inline-block animate-pulse">🔵</span>
              )}
              {step.status === "pending" && "⭕"}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-sm font-medium ${
                  step.status === "done"
                    ? "text-green-400"
                    : step.status === "active"
                    ? "text-blue-400"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </div>
              {step.detail && (
                <div className="text-xs text-gray-500 truncate">{step.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* LLM Progress (when active) */}
      {llmProgress.total > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-3 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">
              {LLM_ICONS[currentLLM]} Querying {LLM_LABELS[currentLLM] || currentLLM}
            </span>
            <span className="text-xs text-gray-500">
              {llmProgress.index}/{llmProgress.total}
            </span>
          </div>
          <div
            className="w-full bg-gray-700 rounded-full h-1.5"
            role="progressbar"
            aria-valuenow={llmProgress.index}
            aria-valuemin={0}
            aria-valuemax={llmProgress.total}
            aria-label={`Requêtes ${LLM_LABELS[currentLLM] || currentLLM} : ${llmProgress.index}/${llmProgress.total}`}
          >
            <div
              className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(llmProgress.index / llmProgress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 truncate">"{llmProgress.query}"</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Results: {resultCount}</span>
          </div>
        </div>
      )}

      {/* Live Logs */}
      <div
        ref={logsRef}
        className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-3 h-40 overflow-y-auto font-mono text-xs space-y-1"
        aria-live="polite"
        aria-label="Journal d'analyse en temps réel"
        role="log"
      >
        {logs.length === 0 ? (
          <span className="text-gray-600">Initializing...</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="text-gray-400 leading-relaxed">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
