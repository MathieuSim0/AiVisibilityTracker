export interface Scan {
  id: string;
  domain: string;
  sector: string | null;
  created_at: string;
  overall_score: number | null;
  mention_rate: number | null;
  avg_position: number | null;
  total_queries: number | null;
  status: "pending" | "running" | "done" | "error";
}

export interface QueryResult {
  id: string;
  scan_id: string;
  llm_name: "chatgpt" | "gemini" | "perplexity";
  query: string;
  response: string;
  brand_mentioned: boolean;
  mention_position: number; // 0 = not mentioned, 1 = first, 2 = second, etc.
  sentiment: "positive" | "neutral" | "negative" | null;
  context_snippet: string | null;
}

export interface Competitor {
  id: string;
  scan_id: string;
  name: string;
  mention_count: number;
  avg_position: number;
  llms_present: string[]; // JSON array
}

export interface Recommendation {
  id: string;
  scan_id: string;
  category: "content" | "technical" | "authority" | "presence";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact_score: number; // 1-10
}

export interface ScanWithDetails extends Scan {
  query_results: QueryResult[];
  competitors: Competitor[];
  recommendations: Recommendation[];
}

export type LLMName = "chatgpt" | "gemini" | "perplexity";

export interface LLMQueryRequest {
  query: string;
  domain: string;
  sector: string;
}

export interface LLMQueryResponse {
  llm_name: LLMName;
  query: string;
  response: string;
  brand_mentioned: boolean;
  mention_position: number;
  sentiment: "positive" | "neutral" | "negative" | null;
  context_snippet: string | null;
}

// SSE Event types
export type SSEEvent =
  | { event: "sector"; data: { sector: string; description: string } }
  | { event: "queries"; data: { queries: string[] } }
  | { event: "llm_progress"; data: { llm: LLMName; query: string; index: number; total: number } }
  | { event: "result"; data: LLMQueryResponse }
  | { event: "competitors"; data: { competitors: Omit<Competitor, "id" | "scan_id">[] } }
  | { event: "recommendations"; data: { recommendations: Omit<Recommendation, "id" | "scan_id">[] } }
  | { event: "complete"; data: { scanId: string; score: number; mention_rate: number } }
  | { event: "error"; data: { message: string } };
