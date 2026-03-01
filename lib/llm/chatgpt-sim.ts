import { analyzeWithAI as openaiQuery } from "./ai-client";
import { parseMentionFromResponse } from "../analysis/mention-parser";
import type { ILLMAdapter } from "./types";
import type { LLMQueryRequest, LLMQueryResponse } from "@/types";

const CHATGPT_SYSTEM_PROMPT = `You are ChatGPT (GPT-4o), OpenAI's conversational AI assistant.
Respond in a helpful, conversational, and thorough manner.
When answering questions about products, services, or companies in a sector:
- Mention well-known, established brands by name
- Be comprehensive and include multiple options
- Use a friendly, accessible tone
- Structure your response with clear recommendations
- Draw from your knowledge of popular, widely-discussed brands and services
Your knowledge is based on data up to early 2024.`;

export class ChatGPTSimAdapter implements ILLMAdapter {
  name = "chatgpt" as const;

  async query(request: LLMQueryRequest): Promise<LLMQueryResponse> {
    const response = await openaiQuery(
      CHATGPT_SYSTEM_PROMPT,
      request.query,
      600
    );

    const parsed = parseMentionFromResponse(response, request.domain);

    return {
      llm_name: "chatgpt",
      query: request.query,
      response,
      ...parsed,
    };
  }
}
