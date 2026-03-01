"use client";

import type { Competitor } from "@/types";

interface Props {
  competitors: Competitor[];
  totalResults: number;
}

const LLM_ICONS: Record<string, string> = {
  chatgpt: "🤖",
  gemini: "✨",
  perplexity: "🔍",
};

export function CompetitorAnalysis({ competitors, totalResults }: Props) {
  if (competitors.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No significant competitors detected in AI responses
      </div>
    );
  }

  const maxMentions = Math.max(...competitors.map((c) => c.mention_count));

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-500 mb-4">
        Based on {totalResults} LLM responses — entities mentioned more frequently than your brand
      </div>
      {competitors.map((competitor, index) => (
        <div
          key={competitor.id}
          className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700/30"
        >
          {/* Rank */}
          <div className="w-8 text-center">
            <span
              className={`text-sm font-bold ${
                index === 0
                  ? "text-yellow-400"
                  : index === 1
                  ? "text-gray-300"
                  : index === 2
                  ? "text-amber-600"
                  : "text-gray-500"
              }`}
            >
              #{index + 1}
            </span>
          </div>

          {/* Name */}
          <div className="w-32 flex-shrink-0">
            <span className="font-medium text-white">{competitor.name}</span>
          </div>

          {/* Bar */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
                  style={{ width: `${(competitor.mention_count / maxMentions) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-16 text-right">
                {competitor.mention_count} mentions
              </span>
            </div>
          </div>

          {/* LLMs */}
          <div className="flex gap-1">
            {(competitor.llms_present as string[]).map((llm) => (
              <span key={llm} title={llm} className="text-base">
                {LLM_ICONS[llm] || "🔷"}
              </span>
            ))}
          </div>

          {/* Avg position */}
          {competitor.avg_position > 0 && (
            <div className="text-xs text-gray-500 w-20 text-right flex-shrink-0">
              avg #{competitor.avg_position.toFixed(1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
