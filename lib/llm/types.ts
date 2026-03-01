import type { LLMName, LLMQueryRequest, LLMQueryResponse } from "@/types";

export interface ILLMAdapter {
  name: LLMName;
  query(request: LLMQueryRequest): Promise<LLMQueryResponse>;
}
