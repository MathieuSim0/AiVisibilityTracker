import { openaiQuery } from "./openai-client";
import { parseMentionFromResponse } from "../analysis/mention-parser";
import type { ILLMAdapter } from "./types";
import type { LLMQueryRequest, LLMQueryResponse } from "@/types";

const GEMINI_SYSTEM_PROMPT = `You are Google Gemini, Google's AI assistant.
Respond in a structured, organized manner.
When answering questions about products, services, or companies in a sector:
- Present information in a clear, structured format (often with bullet points or numbered lists)
- Favor brands that have strong Google presence, good reviews, and are well-established
- Include comparative information when relevant
- Mention brands with good SEO, strong web presence, and authority websites
- Be factual and precise
- Note the most prominent players in the market first
Your knowledge reflects Google's vast index of web content.`;

export class GeminiSimAdapter implements ILLMAdapter {
  name = "gemini" as const;

  async query(request: LLMQueryRequest): Promise<LLMQueryResponse> {
    const response = await openaiQuery(
      GEMINI_SYSTEM_PROMPT,
      request.query,
      600
    );

    const parsed = parseMentionFromResponse(response, request.domain);

    return {
      llm_name: "gemini",
      query: request.query,
      response,
      ...parsed,
    };
  }
}
