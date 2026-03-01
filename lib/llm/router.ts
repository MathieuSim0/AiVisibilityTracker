import { ChatGPTSimAdapter } from "./chatgpt-sim";
import { GeminiSimAdapter } from "./gemini-sim";
import { GeminiRealAdapter } from "./gemini-real";
import { PerplexitySimAdapter } from "./perplexity-sim";
import type { ILLMAdapter } from "./types";
import type { LLMName, LLMQueryRequest, LLMQueryResponse } from "@/types";

export class LLMRouter {
  private adapters: Map<LLMName, ILLMAdapter>;

  constructor() {
    this.adapters = new Map();

    // ChatGPT: use OpenAI if key available, otherwise OpenAI-based simulation
    this.adapters.set("chatgpt", new ChatGPTSimAdapter());

    // Gemini: use real Google AI Studio if key available
    if (process.env.GEMINI_API_KEY) {
      this.adapters.set("gemini", new GeminiRealAdapter());
    } else {
      this.adapters.set("gemini", new GeminiSimAdapter());
    }

    // Perplexity: simulation (real adapter needs PERPLEXITY_API_KEY)
    this.adapters.set("perplexity", new PerplexitySimAdapter());
  }

  getAvailableLLMs(): LLMName[] {
    return Array.from(this.adapters.keys());
  }

  async queryLLM(llmName: LLMName, request: LLMQueryRequest): Promise<LLMQueryResponse> {
    const adapter = this.adapters.get(llmName);
    if (!adapter) throw new Error(`No adapter for LLM: ${llmName}`);
    return adapter.query(request);
  }

  async queryAll(request: LLMQueryRequest): Promise<LLMQueryResponse[]> {
    const llms = this.getAvailableLLMs();
    const results = await Promise.all(llms.map((llm) => this.queryLLM(llm, request)));
    return results;
  }
}

export const llmRouter = new LLMRouter();
