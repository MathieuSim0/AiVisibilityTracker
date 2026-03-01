import { analyzeWithAI as openaiQuery } from "../llm/ai-client";

export interface SectorInfo {
  sector: string;
  description: string;
  keywords: string[];
}

export async function detectSector(domain: string): Promise<SectorInfo> {
  const systemPrompt = `You are a business analyst expert. Given a domain name, identify the business sector and industry.
Respond ONLY with a JSON object in this exact format:
{
  "sector": "Short sector name (2-4 words)",
  "description": "One sentence describing what the company does",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}
No other text, just the JSON.`;

  const prompt = `What sector/industry is the company at domain "${domain}" in?`;

  const response = await openaiQuery(systemPrompt, prompt, 512);

  try {
    // Extract JSON from the response (handle potential markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]) as SectorInfo;
  } catch {
    // Fallback if parsing fails
    return {
      sector: "Technology / Software",
      description: `${domain} is a technology company offering software solutions.`,
      keywords: ["software", "technology", "digital", "platform", "solution"],
    };
  }
}
