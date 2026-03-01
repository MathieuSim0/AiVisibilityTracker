"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Scan } from "@/types";

interface Props {
  history: Scan[];
  currentScanId: string;
}

export function HistoryChart({ history, currentScanId }: Props) {
  if (history.length < 2) {
    return (
      <div className="text-center py-8 space-y-2">
        <div className="text-4xl">📈</div>
        <p className="text-gray-500 text-sm">
          Run another analysis on this domain to see the score evolution over time.
        </p>
      </div>
    );
  }

  const data = history.map((scan) => ({
    date: new Date(scan.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: scan.overall_score || 0,
    mention_rate: Math.round(scan.mention_rate || 0),
    current: scan.id === currentScanId,
  }));

  const latest = data[data.length - 1];

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Score evolution over {history.length} scans
      </div>
      <figure aria-label={`Graphique d'évolution sur ${data.length} scans`}>
        {/* Résumé textuel pour lecteurs d'écran */}
        <figcaption className="sr-only">
          Graphique d&apos;évolution sur {data.length} scans.
          {latest && (
            <>
              {" "}Dernier score de visibilité : {latest.score}/100.
              {" "}Dernier taux de mention : {latest.mention_rate}%.
            </>
          )}
          Données par date :{" "}
          {data.map((d) => `${d.date} — score ${d.score}, mention ${d.mention_rate}%`).join("; ")}.
        </figcaption>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
            <XAxis
              dataKey="date"
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              formatter={(value, name) => [
                `${value ?? 0}${name === "score" ? "/100" : "%"}`,
                name === "score" ? "Visibility Score" : "Mention Rate",
              ]}
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Visibility Score"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6, fill: "#60a5fa" }}
            />
            <Line
              type="monotone"
              dataKey="mention_rate"
              name="Mention Rate"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ fill: "#10b981", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </figure>
      <div className="flex gap-4 text-xs text-gray-500" role="list" aria-label="Légende du graphique">
        <span className="flex items-center gap-1.5" role="listitem">
          <span className="w-4 h-0.5 bg-blue-500 inline-block rounded" aria-hidden="true" /> Visibility Score
        </span>
        <span className="flex items-center gap-1.5" role="listitem">
          <span className="w-4 h-0.5 bg-emerald-500 inline-block rounded" aria-hidden="true" style={{ borderTop: "2px dashed #10b981", height: 0 }} /> Mention Rate
        </span>
      </div>
    </div>
  );
}
