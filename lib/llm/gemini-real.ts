import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMentionFromResponse } from "../analysis/mention-parser";
import type { ILLMAdapter } from "./types";
import type { LLMQueryRequest, LLMQueryResponse } from "@/types";

let client: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

const GEMINI_SYSTEM = `You are Google Gemini, an AI assistant. When answering questions about products,
services, or companies in a sector, provide helpful, accurate information based on your knowledge.
Mention specific brand names and be comprehensive in your response.`;

export class GeminiRealAdapter implements ILLMAdapter {
  name = "gemini" as const;

  async query(request: LLMQueryRequest): Promise<LLMQueryResponse> {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: GEMINI_SYSTEM,
    });

    const result = await model.generateContent(request.query);
    const response = result.response.text();

    const parsed = parseMentionFromResponse(response, request.domain);

    return {
      llm_name: "gemini",
      query: request.query,
      response,
      ...parsed,
    };
  }
}
