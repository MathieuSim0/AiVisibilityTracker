import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export async function openaiQuery(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024
): Promise<string> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
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
