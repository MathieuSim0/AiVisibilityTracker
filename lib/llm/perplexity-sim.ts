import { analyzeWithAI as openaiQuery } from "./ai-client";
import { parseMentionFromResponse } from "../analysis/mention-parser";
import type { ILLMAdapter } from "./types";
import type { LLMQueryRequest, LLMQueryResponse } from "@/types";

const PERPLEXITY_SYSTEM_PROMPT = `You are Perplexity AI, an AI-powered search and answer engine.
Respond in a concise, factual, citation-focused manner.
When answering questions about products, services, or companies in a sector:
- Focus on the most recent and authoritative sources
- Mention brands that have strong recent news coverage and online discussion
- Be concise and direct - get to the point quickly
- Include specific facts, statistics, or data points when available
- Rank options by relevance and authority
- Mention brands that are frequently cited in recent articles and reviews
Your responses reflect real-time web search results and recent information.`;

export class PerplexitySimAdapter implements ILLMAdapter {
  name = "perplexity" as const;

  async query(request: LLMQueryRequest): Promise<LLMQueryResponse> {
    const response = await openaiQuery(
      PERPLEXITY_SYSTEM_PROMPT,
      request.query,
      600
    );

    const parsed = parseMentionFromResponse(response, request.domain);

    return {
      llm_name: "perplexity",
      query: request.query,
      response,
      ...parsed,
    };
  }
}
