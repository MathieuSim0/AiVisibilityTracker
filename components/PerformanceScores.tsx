"use client";

interface PerfData {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  fcp: string;
  lcp: string;
  tbt: string;
  cls: string;
}

interface Props {
  data: PerfData;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const size = 100;
  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const color =
    score >= 90 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel =
    score >= 90 ? "Bon" : score >= 50 ? "À améliorer" : "Faible";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          role="img"
          aria-label={`${label} : ${score}/100 — ${scoreLabel}`}
        >
          <title>{`${label} : ${score}/100 — ${scoreLabel}`}</title>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(128,128,128,0.15)"
            strokeWidth={size * 0.09}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.09}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className="font-bold text-2xl" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
        {label}
      </span>
    </div>
  );
}

export function PerformanceScores({ data }: Props) {
  const metrics = [
    { label: "First Contentful Paint", value: data.fcp, good: false },
    { label: "Largest Contentful Paint", value: data.lcp, good: false },
    { label: "Total Blocking Time", value: data.tbt, good: false },
    { label: "Cumulative Layout Shift", value: data.cls, good: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Technical Performance
        </h2>
        <p className="text-sm text-gray-500">
          Scores measured on mobile. Powered by Google PageSpeed Insights.
        </p>
      </div>

      {/* Score rings */}
      <div className="bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          <ScoreRing score={data.performance} label="Performance" />
          <ScoreRing score={data.seo} label="SEO" />
          <ScoreRing score={data.accessibility} label="Accessibility" />
          <ScoreRing score={data.bestPractices} label="Best Practices" />
        </div>

        {/* Color legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-black/8 dark:border-white/8 text-xs text-gray-500" role="list" aria-label="Légende des scores">
          <span className="flex items-center gap-1.5" role="listitem">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" aria-hidden="true" />
            90–100 Good
          </span>
          <span className="flex items-center gap-1.5" role="listitem">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" aria-hidden="true" />
            50–89 Needs improvement
          </span>
          <span className="flex items-center gap-1.5" role="listitem">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" aria-hidden="true" />
            0–49 Poor
          </span>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 rounded-xl p-4"
            >
              <div className="text-xs text-gray-500 mb-1">{m.label}</div>
              <div className="text-xl font-bold text-foreground">{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
        Data provided by Google PageSpeed Insights · Mobile strategy ·{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
