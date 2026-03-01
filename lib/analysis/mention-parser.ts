/**
 * Parses LLM responses to detect brand mentions, position, sentiment, and context.
 */

export interface ParsedMention {
  brand_mentioned: boolean;
  mention_position: number; // 0 = not mentioned, 1 = first brand mentioned, etc.
  sentiment: "positive" | "neutral" | "negative" | null;
  context_snippet: string | null;
}

/**
 * Extract the brand name from a domain (e.g., "hubspot.com" → "HubSpot")
 */
export function extractBrandFromDomain(domain: string): string {
  const withoutTLD = domain.replace(/\.(com|io|co|net|org|fr|de|uk|app|ai|tech|dev)(\.[a-z]{2})?$/i, "");
  const parts = withoutTLD.split(".");
  const name = parts[parts.length - 1];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Generate common name variants to look for in responses
 */
export function getBrandVariants(domain: string): string[] {
  const brand = extractBrandFromDomain(domain);
  const domainWithoutTLD = domain.replace(/\.(com|io|co|net|org|fr|de|uk|app|ai|tech|dev)(\.[a-z]{2})?$/i, "");

  return [
    brand,
    brand.toLowerCase(),
    brand.toUpperCase(),
    domain,
    domain.replace(/^www\./, ""),
    domainWithoutTLD,
  ].filter((v, i, arr) => arr.indexOf(v) === i); // deduplicate
}

/**
 * Find the position (rank) of a brand mention within a response.
 * We split the response into sentences and find which sentence first mentions the brand.
 * Then we count how many other brands were mentioned before it.
 */
export function parseMentionFromResponse(response: string, domain: string): ParsedMention {
  const variants = getBrandVariants(domain);
  const responseLower = response.toLowerCase();

  // Check if brand is mentioned at all
  const isMentioned = variants.some((v) => responseLower.includes(v.toLowerCase()));

  if (!isMentioned) {
    return {
      brand_mentioned: false,
      mention_position: 0,
      sentiment: null,
      context_snippet: null,
    };
  }

  // Find the position of the first mention in the text
  const firstMentionIndex = Math.min(
    ...variants.map((v) => {
      const idx = responseLower.indexOf(v.toLowerCase());
      return idx === -1 ? Infinity : idx;
    })
  );

  // Extract context snippet (100 chars around the mention)
  const snippetStart = Math.max(0, firstMentionIndex - 100);
  const snippetEnd = Math.min(response.length, firstMentionIndex + 150);
  const context_snippet = response.slice(snippetStart, snippetEnd).trim();

  // Estimate position by counting paragraphs/list items before first mention
  const textBefore = response.slice(0, firstMentionIndex);
  const listItemsBefore = (textBefore.match(/^\s*[-*•\d+\.]/gm) || []).length;
  const mention_position = listItemsBefore + 1; // 1-indexed

  // Analyze sentiment from context
  const sentiment = analyzeSentiment(context_snippet, variants);

  return {
    brand_mentioned: true,
    mention_position,
    sentiment,
    context_snippet,
  };
}

function analyzeSentiment(text: string, brandVariants: string[]): "positive" | "neutral" | "negative" {
  const positiveWords = [
    "best", "top", "leading", "excellent", "great", "popular", "recommended",
    "powerful", "easy", "intuitive", "reliable", "trusted", "innovative",
    "outstanding", "superior", "perfect", "ideal", "well-known", "popular",
    "widely used", "market leader", "highly rated", "award", "favorite",
    "meilleur", "excellent", "populaire", "recommandé", "fiable", "puissant"
  ];

  const negativeWords = [
    "expensive", "complex", "difficult", "limited", "poor", "worst",
    "overpriced", "outdated", "lacking", "mediocre", "criticized",
    "problematic", "issues", "complaints", "avoid", "unreliable",
    "cher", "complexe", "difficile", "limité", "problèmes", "lent"
  ];

  const textLower = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  // Count sentiment words near brand mention
  for (const word of positiveWords) {
    if (textLower.includes(word)) positiveCount++;
  }
  for (const word of negativeWords) {
    if (textLower.includes(word)) negativeCount++;
  }

  if (positiveCount > negativeCount + 1) return "positive";
  if (negativeCount > positiveCount + 1) return "negative";
  return "neutral";
}

/**
 * Extract competitor names from a response, excluding the target brand
 */
export function extractCompetitorsFromResponse(
  response: string,
  targetDomain: string,
  llmName: string
): Array<{ name: string; position: number; llm: string }> {
  const targetVariants = getBrandVariants(targetDomain).map((v) => v.toLowerCase());

  // Common patterns for brand mentions in responses
  const lines = response.split(/\n/);
  const competitors: Array<{ name: string; position: number; llm: string }> = [];

  // Pattern: "Brand Name" - capitalized words that could be company names
  const companyPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s+[A-Z]+)?)\b/g;

  // Common generic words to exclude
  const excludeWords = new Set([
    "The", "This", "That", "These", "Those", "When", "What", "Where", "How",
    "With", "From", "Your", "Their", "They", "Here", "Note", "Also", "Both",
    "Each", "Some", "Many", "Most", "More", "Best", "For", "And", "But",
    "Not", "All", "Any", "New", "Key", "Top", "High", "Low", "Get", "Use",
    "You", "It", "In", "On", "At", "By", "If", "As", "Is", "Are", "Was",
    "Be", "To", "Of", "An", "A", "Can", "Will", "May", "Has", "Have",
    "API", "CRM", "SEO", "AI", "ML", "UI", "UX", "B2B", "SaaS",
    "Pro", "Plus", "Premium", "Free", "Plan", "Team", "Suite", "Cloud",
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ]);

  const seen = new Set<string>();
  let position = 1;

  for (const line of lines) {
    let match;
    const lineCompanies: string[] = [];

    while ((match = companyPattern.exec(line)) !== null) {
      const name = match[1].trim();
      if (
        name.length > 2 &&
        !excludeWords.has(name) &&
        !targetVariants.includes(name.toLowerCase()) &&
        !seen.has(name.toLowerCase())
      ) {
        lineCompanies.push(name);
      }
    }

    for (const name of lineCompanies) {
      seen.add(name.toLowerCase());
      competitors.push({ name, position, llm: llmName });
      position++;
    }
  }

  return competitors.slice(0, 20); // limit to top 20
}
