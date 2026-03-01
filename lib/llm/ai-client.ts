/**
 * Unified AI client that uses the best available LLM for analysis tasks.
 * Priority: Groq (free) > Gemini > OpenAI > Anthropic > error
 *
 * To get free API access:
 * - Groq: https://console.groq.com (14,400 req/day free)
 * - Gemini: https://aistudio.google.com (needs billing enabled)
 * - OpenAI: https://platform.openai.com/billing
 */
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function groqQuery(systemPrompt: string, userMessage: string, maxTokens = 1024): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("No GROQ_API_KEY");

  // Groq is OpenAI-compatible
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return content;
}

async function geminiQuery(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No GEMINI_API_KEY");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(userMessage);
  return result.response.text();
}

async function openaiQuery(systemPrompt: string, userMessage: string, maxTokens = 1024): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("No OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");
  return content;
}

async function anthropicQuery(systemPrompt: string, userMessage: string, maxTokens = 1024): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("No ANTHROPIC_API_KEY");

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

export async function analyzeWithAI(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024
): Promise<string> {
  // Try providers in order of preference (free first)
  if (process.env.GROQ_API_KEY) {
    return groqQuery(systemPrompt, userMessage, maxTokens);
  }
  if (process.env.GEMINI_API_KEY) {
    return geminiQuery(systemPrompt, userMessage);
  }
  if (process.env.OPENAI_API_KEY) {
    return openaiQuery(systemPrompt, userMessage, maxTokens);
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropicQuery(systemPrompt, userMessage, maxTokens);
  }
  throw new Error(
    "No AI API key configured. Add GROQ_API_KEY (free at console.groq.com), " +
    "GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY to .env.local"
  );
}
