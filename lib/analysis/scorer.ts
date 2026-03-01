import type { LLMQueryResponse, LLMName } from "@/types";

export interface ScoreBreakdown {
  overall_score: number;
  mention_rate: number; // 0-100
  position_score: number; // 0-100
  sentiment_score: number; // 0-100
  coverage_score: number; // 0-100
  by_llm: Record<LLMName, LLMScore>;
}

export interface LLMScore {
  llm_name: LLMName;
  score: number;
  mention_rate: number;
  avg_position: number;
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export function calculateScores(results: LLMQueryResponse[]): ScoreBreakdown {
  if (results.length === 0) {
    return {
      overall_score: 0,
      mention_rate: 0,
      position_score: 0,
      sentiment_score: 0,
      coverage_score: 0,
      by_llm: {} as Record<LLMName, LLMScore>,
    };
  }

  const totalQueries = results.length;
  const mentionedResults = results.filter((r) => r.brand_mentioned);

  // Mention Rate (0-100): % of queries where brand is mentioned
  const mention_rate = (mentionedResults.length / totalQueries) * 100;

  // Position Score (0-100): inverse of average position for mentioned results
  // Position 1 = 100, Position 2 = 50, Position 3 = 33, etc.
  const positionScores = mentionedResults
    .filter((r) => r.mention_position > 0)
    .map((r) => (1 / r.mention_position) * 100);

  const position_score =
    positionScores.length > 0
      ? positionScores.reduce((sum, s) => sum + s, 0) / positionScores.length
      : 0;

  // Sentiment Score (0-100): % of mentioned results with positive sentiment
  const positiveMentions = mentionedResults.filter((r) => r.sentiment === "positive").length;
  const sentiment_score =
    mentionedResults.length > 0 ? (positiveMentions / mentionedResults.length) * 100 : 0;

  // Coverage Score (0-100): % of LLMs that mention the brand at least once
  const llmNames = [...new Set(results.map((r) => r.llm_name))];
  const llmsWithMentions = new Set(
    mentionedResults.map((r) => r.llm_name)
  );
  const coverage_score = (llmsWithMentions.size / llmNames.length) * 100;

  // Overall Score (weighted)
  const overall_score = Math.round(
    mention_rate * 0.40 +
    Math.min(position_score, 100) * 0.25 +
    sentiment_score * 0.20 +
    coverage_score * 0.15
  );

  // Per-LLM breakdown
  const by_llm = {} as Record<LLMName, LLMScore>;
  for (const llmName of llmNames) {
    const llmResults = results.filter((r) => r.llm_name === llmName);
    const llmMentioned = llmResults.filter((r) => r.brand_mentioned);

    const llmMentionRate = (llmMentioned.length / llmResults.length) * 100;
    const llmPositionScores = llmMentioned
      .filter((r) => r.mention_position > 0)
      .map((r) => (1 / r.mention_position) * 100);
    const llmPositionScore =
      llmPositionScores.length > 0
        ? llmPositionScores.reduce((sum, s) => sum + s, 0) / llmPositionScores.length
        : 0;
    const llmPositiveMentions = llmMentioned.filter((r) => r.sentiment === "positive").length;
    const llmSentimentScore =
      llmMentioned.length > 0 ? (llmPositiveMentions / llmMentioned.length) * 100 : 0;

    const llmScore = Math.round(
      llmMentionRate * 0.45 + Math.min(llmPositionScore, 100) * 0.30 + llmSentimentScore * 0.25
    );

    const avgPosition =
      llmMentioned.length > 0
        ? llmMentioned.reduce((sum, r) => sum + r.mention_position, 0) / llmMentioned.length
        : 0;

    by_llm[llmName] = {
      llm_name: llmName,
      score: llmScore,
      mention_rate: Math.round(llmMentionRate),
      avg_position: Math.round(avgPosition * 10) / 10,
      sentiment_breakdown: {
        positive: llmMentioned.filter((r) => r.sentiment === "positive").length,
        neutral: llmMentioned.filter((r) => r.sentiment === "neutral").length,
        negative: llmMentioned.filter((r) => r.sentiment === "negative").length,
      },
    };
  }

  return {
    overall_score,
    mention_rate: Math.round(mention_rate),
    position_score: Math.round(Math.min(position_score, 100)),
    sentiment_score: Math.round(sentiment_score),
    coverage_score: Math.round(coverage_score),
    by_llm,
  };
}
