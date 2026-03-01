import type { LLMQueryResponse } from "@/types";
import { extractCompetitorsFromResponse } from "./mention-parser";
import type { Competitor } from "@/types";

interface RawCompetitor {
  mentions: number;
  positions: number[];
  llms: Set<string>;
}

export function aggregateCompetitors(
  results: LLMQueryResponse[],
  targetDomain: string
): Omit<Competitor, "id" | "scan_id">[] {
  const competitorMap = new Map<string, RawCompetitor>();

  for (const result of results) {
    const extracted = extractCompetitorsFromResponse(
      result.response,
      targetDomain,
      result.llm_name
    );

    for (const { name, position, llm } of extracted) {
      const key = name.toLowerCase();
      if (!competitorMap.has(key)) {
        competitorMap.set(key, { mentions: 0, positions: [], llms: new Set() });
      }
      const entry = competitorMap.get(key)!;
      entry.mentions++;
      entry.positions.push(position);
      entry.llms.add(llm);
    }
  }

  // Convert to array and sort by mention count
  const competitors = Array.from(competitorMap.entries())
    .map(([, data]) => ({
      name: "", // will be filled below
      mention_count: data.mentions,
      avg_position:
        data.positions.reduce((sum, p) => sum + p, 0) / data.positions.length,
      llms_present: Array.from(data.llms),
    }));

  // Get proper cased names from the original map keys
  const sortedEntries = Array.from(competitorMap.entries())
    .sort(([, a], [, b]) => b.mentions - a.mentions)
    .slice(0, 10); // top 10 competitors

  return sortedEntries.map(([key, data]) => {
    // Find the original casing from any response
    let originalName = key;
    for (const result of results) {
      const extracted = extractCompetitorsFromResponse(result.response, targetDomain, result.llm_name);
      const found = extracted.find((c) => c.name.toLowerCase() === key);
      if (found) {
        originalName = found.name;
        break;
      }
    }

    return {
      name: originalName,
      mention_count: data.mentions,
      avg_position: data.positions.reduce((sum, p) => sum + p, 0) / data.positions.length,
      llms_present: Array.from(data.llms),
    };
  });
}
