"use client";

import { useState } from "react";
import type { QueryResult } from "@/types";

interface Props {
  results: QueryResult[];
  domain: string;
}

const LLM_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
};

const LLM_COLORS: Record<string, string> = {
  chatgpt: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  gemini: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  perplexity: "text-amber-400 bg-amber-500/10 border-amber-500/30",
};

const SENTIMENT_BADGE: Record<string, string> = {
  positive: "text-green-400 bg-green-500/10",
  neutral: "text-gray-400 bg-gray-500/10",
  negative: "text-red-400 bg-red-500/10",
};

export function QueryResults({ results, domain }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterLLM, setFilterLLM] = useState<string>("all");
  const [filterMention, setFilterMention] = useState<"all" | "mentioned" | "missed">("all");

  // Get unique queries
  const uniqueQueries = [...new Set(results.map((r) => r.query))];
  const llmNames = [...new Set(results.map((r) => r.llm_name))];

  const filtered = results.filter((r) => {
    if (filterLLM !== "all" && r.llm_name !== filterLLM) return false;
    if (filterMention === "mentioned" && !r.brand_mentioned) return false;
    if (filterMention === "missed" && r.brand_mentioned) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1" role="group" aria-label="Filtrer par LLM">
          {["all", ...llmNames].map((llm) => (
            <button
              key={llm}
              type="button"
              onClick={() => setFilterLLM(llm)}
              aria-pressed={filterLLM === llm}
              className={`px-3 py-1 rounded text-sm transition-all ${
                filterLLM === llm
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {llm === "all" ? "All LLMs" : LLM_LABELS[llm] || llm}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1" role="group" aria-label="Filtrer par mention">
          {(["all", "mentioned", "missed"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setFilterMention(filter)}
              aria-pressed={filterMention === filter}
              className={`px-3 py-1 rounded text-sm transition-all ${
                filterMention === filter
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {filter === "all" ? "All" : filter === "mentioned" ? "✅ Mentioned" : "❌ Missed"}
            </button>
          ))}
        </div>
      </div>

      {/* Results table */}
      <div className="space-y-2">
        {filtered.map((result) => (
          <div
            key={result.id}
            className={`rounded-lg border transition-all ${
              result.brand_mentioned
                ? "border-green-500/20 bg-green-500/5"
                : "border-gray-700/50 bg-gray-800/30"
            }`}
          >
            <button
              type="button"
              className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-all ${
                result.brand_mentioned
                  ? "hover:bg-green-500/10"
                  : "hover:bg-gray-800/50"
              }`}
              onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
              aria-expanded={expandedId === result.id}
              aria-controls={`detail-${result.id}`}
              aria-label={`${result.brand_mentioned ? "Mentionné" : "Non mentionné"} — ${result.query} (${LLM_LABELS[result.llm_name] || result.llm_name})`}
            >
              {/* Mention indicator */}
              <div className="text-lg flex-shrink-0" aria-hidden="true">
                {result.brand_mentioned ? "✅" : "❌"}
              </div>

              {/* LLM badge */}
              <span
                className={`px-2 py-0.5 rounded border text-xs font-medium flex-shrink-0 ${
                  LLM_COLORS[result.llm_name] || "text-gray-400 bg-gray-500/10 border-gray-500/30"
                }`}
              >
                {LLM_LABELS[result.llm_name] || result.llm_name}
              </span>

              {/* Query */}
              <div className="flex-1 text-sm text-gray-300 truncate">"{result.query}"</div>

              {/* Meta */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {result.brand_mentioned && (
                  <>
                    <span className="text-xs text-gray-500">#{result.mention_position}</span>
                    {result.sentiment && (
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          SENTIMENT_BADGE[result.sentiment] || ""
                        }`}
                      >
                        {result.sentiment}
                      </span>
                    )}
                  </>
                )}
                <span className="text-gray-600 text-xs" aria-hidden="true">{expandedId === result.id ? "▲" : "▼"}</span>
              </div>
            </button>

            {/* Expanded view */}
            {expandedId === result.id && (
              <div id={`detail-${result.id}`} className="px-4 pb-4 space-y-3 border-t border-gray-700/30 mt-1 pt-3">
                {result.context_snippet && (
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Brand Context</div>
                    <div className="bg-black/30 rounded p-3 text-sm text-gray-300 italic">
                      "...{result.context_snippet}..."
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">Full Response</div>
                  <div className="bg-black/30 rounded p-3 text-xs text-gray-400 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {result.response}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-8">No results match your filters</div>
      )}

      <div className="text-xs text-gray-600 text-right">
        {filtered.length} of {results.length} results shown
      </div>
    </div>
  );
}
