import { analyzeWithAI as openaiQuery } from "./llm/ai-client";
import type { LLMQueryResponse, Competitor, Recommendation } from "@/types";
import type { ScoreBreakdown } from "./analysis/scorer";
import type { SectorInfo } from "./analysis/sector-detector";

export async function generateRecommendations(
  domain: string,
  sectorInfo: SectorInfo,
  scores: ScoreBreakdown,
  results: LLMQueryResponse[],
  competitors: Omit<Competitor, "id" | "scan_id">[]
): Promise<Omit<Recommendation, "id" | "scan_id">[]> {
  const mentionedResults = results.filter((r) => r.brand_mentioned);
  const missedResults = results.filter((r) => !r.brand_mentioned);

  const systemPrompt = `You are a GEO (Generative Engine Optimization) expert specializing in improving brand visibility in AI assistants like ChatGPT, Gemini, and Perplexity.
Your job is to generate highly specific, actionable recommendations based on brand visibility data.

Respond ONLY with a JSON array of recommendation objects. Each object must have:
{
  "category": "content" | "technical" | "authority" | "presence",
  "priority": "high" | "medium" | "low",
  "title": "Short title (max 10 words)",
  "description": "Detailed actionable description (2-4 sentences, specific to this brand)",
  "impact_score": number between 1-10
}

Categories:
- "content": What to write/publish to be mentioned more
- "technical": Schema markup, structured data, website optimization
- "authority": Backlinks, citations, trust signals
- "presence": Where to be listed, profiles to create

Return exactly 6-8 recommendations, sorted by impact_score descending.`;

  const prompt = `Brand: ${domain}
Sector: ${sectorInfo.sector} — ${sectorInfo.description}

VISIBILITY DATA:
- Overall Score: ${scores.overall_score}/100
- Mention Rate: ${scores.mention_rate}% (mentioned in ${mentionedResults.length}/${results.length} queries)
- Position Score: ${scores.position_score}/100 (lower = appears later in responses)
- Sentiment: ${scores.sentiment_score}% positive
- LLM Coverage: ${scores.coverage_score}% of AI assistants mention this brand

PER-LLM SCORES:
${Object.values(scores.by_llm)
  .map((l) => `- ${l.llm_name}: Score ${l.score}/100, Mention rate ${l.mention_rate}%`)
  .join("\n")}

TOP COMPETITORS (appear more often):
${competitors.slice(0, 5).map((c) => `- ${c.name}: ${c.mention_count} mentions, avg position ${c.avg_position.toFixed(1)}, present in: ${c.llms_present.join(", ")}`).join("\n")}

QUERIES WHERE BRAND WAS MISSED:
${missedResults.slice(0, 3).map((r) => `- "${r.query}" (${r.llm_name})`).join("\n")}

QUERIES WHERE BRAND WAS MENTIONED:
${mentionedResults.slice(0, 3).map((r) => `- "${r.query}" (${r.llm_name}) — position ${r.mention_position}, sentiment: ${r.sentiment}`).join("\n")}

Generate 6-8 specific, actionable GEO recommendations to improve ${domain}'s visibility in AI assistants.`;

  try {
    const response = await openaiQuery(systemPrompt, prompt, 2048);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");
    const recs = JSON.parse(jsonMatch[0]) as Omit<Recommendation, "id" | "scan_id">[];
    return recs.slice(0, 8);
  } catch {
    // Fallback recommendations
    return getDefaultRecommendations(domain, scores);
  }
}

function getDefaultRecommendations(
  domain: string,
  scores: ScoreBreakdown
): Omit<Recommendation, "id" | "scan_id">[] {
  const recs: Omit<Recommendation, "id" | "scan_id">[] = [];

  if (scores.mention_rate < 50) {
    recs.push({
      category: "content",
      priority: "high",
      title: "Create comprehensive comparison content",
      description: `Publish in-depth comparison articles between ${domain} and top competitors. AI assistants frequently cite "best X vs Y" content when answering user queries.`,
      impact_score: 9,
    });
  }

  recs.push({
    category: "technical",
    priority: "high",
    title: "Implement structured data markup",
    description: `Add Organization, Product, and FAQ schema markup to ${domain}. Structured data helps AI systems extract and cite your brand information more accurately.`,
    impact_score: 8,
  });

  recs.push({
    category: "authority",
    priority: "high",
    title: "Get featured on industry review platforms",
    description: `Ensure ${domain} is listed and reviewed on platforms like G2, Capterra, Trustpilot, and ProductHunt. These are frequently scraped by AI training data.`,
    impact_score: 8,
  });

  recs.push({
    category: "content",
    priority: "medium",
    title: "Publish authoritative guides and use cases",
    description: `Create detailed guides covering your sector's key questions. AI assistants prefer authoritative, comprehensive content when formulating answers.`,
    impact_score: 7,
  });

  recs.push({
    category: "presence",
    priority: "medium",
    title: "Increase Wikipedia and knowledge base presence",
    description: `Create or update ${domain}'s Wikipedia page. AI assistants heavily rely on Wikipedia and Wikidata for factual brand information.`,
    impact_score: 7,
  });

  return recs;
}
