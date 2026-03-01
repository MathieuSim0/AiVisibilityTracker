"use client";

import type { QueryResult } from "@/types";

interface LLMStats {
  llm_name: string;
  score: number;
  mention_rate: number;
  avg_position: number;
  total: number;
  mentioned: number;
  sentiment_breakdown: { positive: number; neutral: number; negative: number };
}

interface Props {
  results: QueryResult[];
}

const LLM_CONFIG: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
  chatgpt: {
    label: "ChatGPT",
    icon: "🤖",
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.1)",
  },
  gemini: {
    label: "Gemini",
    icon: "✨",
    color: "#6366f1",
    bgColor: "rgba(99,102,241,0.1)",
  },
  perplexity: {
    label: "Perplexity",
    icon: "🔍",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.1)",
  },
};

function computeStats(results: QueryResult[]): LLMStats[] {
  const byLLM = new Map<string, QueryResult[]>();
  for (const r of results) {
    if (!byLLM.has(r.llm_name)) byLLM.set(r.llm_name, []);
    byLLM.get(r.llm_name)!.push(r);
  }

  return Array.from(byLLM.entries()).map(([llm_name, llmResults]) => {
    const mentioned = llmResults.filter((r) => r.brand_mentioned);
    const mention_rate = Math.round((mentioned.length / llmResults.length) * 100);
    const avg_position =
      mentioned.length > 0
        ? Math.round(
            (mentioned.reduce((sum, r) => sum + r.mention_position, 0) / mentioned.length) * 10
          ) / 10
        : 0;

    const posScores = mentioned
      .filter((r) => r.mention_position > 0)
      .map((r) => (1 / r.mention_position) * 100);
    const posScore = posScores.length > 0
      ? posScores.reduce((s, p) => s + p, 0) / posScores.length
      : 0;
    const sentScore =
      mentioned.length > 0
        ? (mentioned.filter((r) => r.sentiment === "positive").length / mentioned.length) * 100
        : 0;

    const score = Math.round(mention_rate * 0.45 + Math.min(posScore, 100) * 0.30 + sentScore * 0.25);

    return {
      llm_name,
      score,
      mention_rate,
      avg_position,
      total: llmResults.length,
      mentioned: mentioned.length,
      sentiment_breakdown: {
        positive: mentioned.filter((r) => r.sentiment === "positive").length,
        neutral: mentioned.filter((r) => r.sentiment === "neutral").length,
        negative: mentioned.filter((r) => r.sentiment === "negative").length,
      },
    };
  });
}

function ScoreBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 bg-gray-700/50 rounded-full h-1.5"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} : ${value}/100`}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right" aria-hidden="true">{value}%</span>
    </div>
  );
}

export function LLMBreakdown({ results }: Props) {
  const stats = computeStats(results);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const config = LLM_CONFIG[stat.llm_name] || {
          label: stat.llm_name,
          icon: "🔷",
          color: "#6b7280",
          bgColor: "rgba(107,114,128,0.1)",
        };

        return (
          <div
            key={stat.llm_name}
            className="rounded-xl border p-5 space-y-4"
            style={{
              borderColor: `${config.color}30`,
              backgroundColor: config.bgColor,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{config.icon}</span>
                <span className="font-semibold text-white">{config.label}</span>
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: config.color }}
              >
                {stat.score}
              </div>
            </div>

            {/* Score bar */}
            <ScoreBar value={stat.score} color={config.color} label={`Score ${config.label}`} />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <div className="text-white font-bold text-lg">{stat.mention_rate}%</div>
                <div className="text-gray-500 text-xs">Mention rate</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <div className="text-white font-bold text-lg">
                  {stat.mentioned}/{stat.total}
                </div>
                <div className="text-gray-500 text-xs">Queries</div>
              </div>
            </div>

            {/* Sentiment */}
            {stat.mentioned > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 font-medium">Sentiment</div>
                <div className="flex gap-2 text-xs">
                  {stat.sentiment_breakdown.positive > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400" aria-label={`${stat.sentiment_breakdown.positive} positif`}>
                      <span aria-hidden="true">+</span>{stat.sentiment_breakdown.positive}
                      <span className="sr-only"> positif</span>
                    </span>
                  )}
                  {stat.sentiment_breakdown.neutral > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400" aria-label={`${stat.sentiment_breakdown.neutral} neutre`}>
                      <span aria-hidden="true">~</span>{stat.sentiment_breakdown.neutral}
                      <span className="sr-only"> neutre</span>
                    </span>
                  )}
                  {stat.sentiment_breakdown.negative > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400" aria-label={`${stat.sentiment_breakdown.negative} négatif`}>
                      <span aria-hidden="true">-</span>{stat.sentiment_breakdown.negative}
                      <span className="sr-only"> négatif</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {stat.avg_position > 0 && (
              <div className="text-xs text-gray-500">
                Avg. position: <span className="text-white font-medium">#{stat.avg_position}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
