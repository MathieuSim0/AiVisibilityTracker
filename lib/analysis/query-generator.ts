import { analyzeWithAI as openaiQuery } from "../llm/ai-client";
import type { SectorInfo } from "./sector-detector";

export async function generateQueries(domain: string, sectorInfo: SectorInfo): Promise<string[]> {
  const systemPrompt = `You are an SEO and GEO (Generative Engine Optimization) expert.
Generate realistic search queries that users would type into an AI assistant like ChatGPT, Gemini, or Perplexity
when looking for solutions in a given sector.

These queries should be the kinds of questions where a relevant brand SHOULD appear if it has good AI visibility.
Mix different types: best-of lists, comparisons, how-to questions, specific use case questions.

Respond ONLY with a JSON array of 6 strings. No other text.
Example: ["best CRM software for startups", "how to automate email marketing", ...]`;

  const prompt = `Domain: ${domain}
Sector: ${sectorInfo.sector}
Description: ${sectorInfo.description}
Keywords: ${sectorInfo.keywords.join(", ")}

Generate 6 search queries that users would ask AI assistants when looking for solutions in this sector.
The queries should be varied: some broad market questions, some specific use-case questions, some comparison questions.`;

  const response = await openaiQuery(systemPrompt, prompt, 512);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");
    const queries = JSON.parse(jsonMatch[0]) as string[];
    return queries.slice(0, 6);
  } catch {
    // Fallback queries
    const { sector, keywords } = sectorInfo;
    return [
      `best ${sector.toLowerCase()} tools`,
      `top ${keywords[0]} software 2024`,
      `${keywords[0]} vs ${keywords[1]} comparison`,
      `how to choose ${sector.toLowerCase()} solution`,
      `${sector.toLowerCase()} recommendations for businesses`,
      `leading companies in ${sector.toLowerCase()}`,
    ];
  }
}
