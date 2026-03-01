"use client";

import { useMemo } from "react";

interface Props {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export function VisibilityScore({ score, size = 160, showLabel = true }: Props) {
  const { color, label, bgColor } = useMemo(() => {
    if (score >= 70)
      return { color: "#22c55e", label: "Excellent", bgColor: "rgba(34,197,94,0.1)" };
    if (score >= 50)
      return { color: "#3b82f6", label: "Good", bgColor: "rgba(59,130,246,0.1)" };
    if (score >= 30)
      return { color: "#f59e0b", label: "Fair", bgColor: "rgba(245,158,11,0.1)" };
    return { color: "#ef4444", label: "Low", bgColor: "rgba(239,68,68,0.1)" };
  }, [score]);

  const radius = (size / 2) * 0.8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          role="img"
          aria-label={`Score de visibilité : ${score}/100 — ${label}`}
        >
          <title>{`Score de visibilité : ${score}/100 — ${label}`}</title>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(128,128,128,0.2)"
            strokeWidth={size * 0.08}
          />
          {/* Score arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.08}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        {/* Score text — aria-hidden car le SVG annonce déjà l'info */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden="true"
          style={{ background: "transparent" }}
        >
          <span
            className="font-bold leading-none"
            style={{ fontSize: size * 0.28, color }}
          >
            {score}
          </span>
          <span
            className="text-gray-400 font-medium"
            style={{ fontSize: size * 0.1 }}
          >
            /100
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{ color, backgroundColor: bgColor }}
        >
          {label} Visibility
        </span>
      )}
    </div>
  );
}
