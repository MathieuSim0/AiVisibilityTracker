"use client";

import type { Recommendation } from "@/types";

interface Props {
  recommendations: Recommendation[];
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  content: { label: "Content", icon: "📝", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  technical: { label: "Technical", icon: "⚙️", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  authority: { label: "Authority", icon: "🏆", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  presence: { label: "Presence", icon: "🌐", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: "High Impact", color: "text-red-400 bg-red-500/10" },
  medium: { label: "Medium", color: "text-orange-400 bg-orange-500/10" },
  low: { label: "Quick Win", color: "text-green-400 bg-green-500/10" },
};

function ImpactDots({ score }: { score: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`Impact : ${score}/10`}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`w-1.5 h-1.5 rounded-full ${
            i < score ? "bg-blue-400" : "bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

export function Recommendations({ recommendations }: Props) {
  const sorted = [...recommendations].sort((a, b) => b.impact_score - a.impact_score);

  return (
    <div className="space-y-4">
      {/* Summary by category */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => {
          const count = recommendations.filter((r) => r.category === cat).length;
          return (
            <div
              key={cat}
              className={`rounded-lg p-3 border text-center ${config.bg}`}
            >
              <div className="text-xl mb-1">{config.icon}</div>
              <div className={`text-xs font-medium ${config.color}`}>{config.label}</div>
              <div className="text-2xl font-bold text-white">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Recommendations list */}
      {sorted.map((rec, index) => {
        const catConfig = CATEGORY_CONFIG[rec.category] || {
          label: rec.category,
          icon: "💡",
          color: "text-gray-400",
          bg: "bg-gray-500/10 border-gray-500/20",
        };
        const prioConfig = PRIORITY_CONFIG[rec.priority] || {
          label: rec.priority,
          color: "text-gray-400 bg-gray-500/10",
        };

        return (
          <div
            key={rec.id}
            className={`rounded-xl border p-5 space-y-3 ${catConfig.bg}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xl flex-shrink-0">{catConfig.icon}</span>
                <div>
                  <h3 className="font-semibold text-white">{rec.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${catConfig.color} ${catConfig.bg}`}>
                      {catConfig.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${prioConfig.color}`}>
                      {prioConfig.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-lg font-bold ${catConfig.color}`}>{rec.impact_score}/10</span>
                <ImpactDots score={rec.impact_score} />
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">{rec.description}</p>
          </div>
        );
      })}
    </div>
  );
}
