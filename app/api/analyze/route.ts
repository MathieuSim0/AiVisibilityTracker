import { NextRequest } from "next/server";
import { createScan, updateScan, insertQueryResult, insertCompetitors, insertRecommendations } from "@/lib/db";
import { detectSector } from "@/lib/analysis/sector-detector";
import { generateQueries } from "@/lib/analysis/query-generator";
import { llmRouter } from "@/lib/llm/router";
import { aggregateCompetitors } from "@/lib/analysis/competitor-extractor";
import { calculateScores } from "@/lib/analysis/scorer";
import { generateRecommendations } from "@/lib/recommendations";
import { isDemoDomain, getDemoData } from "@/lib/demo-data";
import { auth } from "@/auth";
import type { LLMQueryResponse, LLMName } from "@/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max

function sendEvent(controller: ReadableStreamDefaultController, event: string, data: unknown) {
  const encoder = new TextEncoder();
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  controller.enqueue(encoder.encode(message));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const domain = (body.domain as string)?.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  if (!domain) {
    return new Response(JSON.stringify({ error: "Domain is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Attach scan to authenticated user if available
  const session = await auth();
  const userId = session?.user?.id ?? undefined;

  const scan = createScan(domain, userId);
  updateScan(scan.id, { status: "running" });

  // Demo mode: use pre-populated data for demo domains
  const demoData = isDemoDomain(domain) ? getDemoData(domain) : null;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (demoData) {
          // Simulate streaming with demo data (with small delays for realism)
          const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

          sendEvent(controller, "step", { step: "sector", message: "Detecting industry sector..." });
          await delay(800);
          updateScan(scan.id, { sector: demoData.sector.sector });
          sendEvent(controller, "sector", demoData.sector);

          await delay(600);
          sendEvent(controller, "step", { step: "queries", message: "Generating relevant queries..." });
          await delay(700);
          sendEvent(controller, "queries", { queries: demoData.queries });

          const total = demoData.results.length;
          sendEvent(controller, "step", { step: "llm_queries", message: `Querying 3 AI assistants with ${demoData.queries.length} queries...` });

          for (let i = 0; i < demoData.results.length; i++) {
            const result = demoData.results[i];
            await delay(300);
            sendEvent(controller, "llm_progress", { llm: result.llm_name, query: result.query, index: i + 1, total });
            await delay(400);
            insertQueryResult(scan.id, result);
            sendEvent(controller, "result", result);
          }

          await delay(500);
          sendEvent(controller, "step", { step: "competitors", message: "Analyzing competitors..." });
          insertCompetitors(scan.id, demoData.competitors);
          sendEvent(controller, "competitors", { competitors: demoData.competitors });

          await delay(400);
          sendEvent(controller, "step", { step: "scoring", message: "Calculating visibility scores..." });

          await delay(600);
          sendEvent(controller, "step", { step: "recommendations", message: "Generating recommendations..." });
          insertRecommendations(scan.id, demoData.recommendations);
          sendEvent(controller, "recommendations", { recommendations: demoData.recommendations });

          // Calculate score from demo results
          const scores = calculateScores(demoData.results as LLMQueryResponse[]);
          updateScan(scan.id, {
            status: "done",
            overall_score: scores.overall_score,
            mention_rate: scores.mention_rate,
            avg_position: 2.1,
            total_queries: demoData.queries.length,
          });

          await delay(300);
          sendEvent(controller, "complete", { scanId: scan.id, score: scores.overall_score, mention_rate: scores.mention_rate });
          controller.close();
          return;
        }

        // Step 1: Detect sector
        sendEvent(controller, "step", { step: "sector", message: "Detecting industry sector..." });
        const sectorInfo = await detectSector(domain);
        updateScan(scan.id, { sector: sectorInfo.sector });
        sendEvent(controller, "sector", { sector: sectorInfo.sector, description: sectorInfo.description });

        // Step 2: Generate queries
        sendEvent(controller, "step", { step: "queries", message: "Generating relevant queries..." });
        const queries = await generateQueries(domain, sectorInfo);
        sendEvent(controller, "queries", { queries });

        // Step 3: Query all LLMs
        const llms = llmRouter.getAvailableLLMs();
        const totalCalls = queries.length * llms.length;
        let completedCalls = 0;
        const allResults: LLMQueryResponse[] = [];

        sendEvent(controller, "step", {
          step: "llm_queries",
          message: `Querying ${llms.length} AI assistants with ${queries.length} queries...`,
        });

        for (const query of queries) {
          for (const llmName of llms) {
            completedCalls++;
            sendEvent(controller, "llm_progress", {
              llm: llmName,
              query,
              index: completedCalls,
              total: totalCalls,
            });

            // Retry logic for rate limits (Groq TPM limit)
            let retries = 3;
            while (retries > 0) {
              try {
                const result = await llmRouter.queryLLM(llmName as LLMName, {
                  query,
                  domain,
                  sector: sectorInfo.sector,
                });
                allResults.push(result);
                insertQueryResult(scan.id, result);
                sendEvent(controller, "result", result);
                break;
              } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                if (msg.includes("429") || msg.includes("rate limit") || msg.includes("Rate limit")) {
                  // Extract retry delay from error message or use default
                  const waitMatch = msg.match(/try again in (\d+)ms/i) || msg.match(/(\d+)ms/);
                  const waitMs = waitMatch ? parseInt(waitMatch[1]) + 200 : 2000;
                  console.log(`Rate limited on ${llmName}, waiting ${waitMs}ms...`);
                  await new Promise((r) => setTimeout(r, waitMs));
                  retries--;
                } else {
                  console.error(`Error querying ${llmName} for "${query}":`, err);
                  break;
                }
              }
            }

            // Small delay between calls to stay within TPM limits
            await new Promise((r) => setTimeout(r, 600));
          }
        }

        // Step 4: Analyze competitors
        sendEvent(controller, "step", { step: "competitors", message: "Analyzing competitors..." });
        const competitors = aggregateCompetitors(allResults, domain);
        insertCompetitors(scan.id, competitors);
        sendEvent(controller, "competitors", { competitors });

        // Step 5: Calculate scores
        sendEvent(controller, "step", { step: "scoring", message: "Calculating visibility scores..." });
        const scores = calculateScores(allResults);

        // Step 6: Generate recommendations
        sendEvent(controller, "step", { step: "recommendations", message: "Generating recommendations..." });
        const recommendations = await generateRecommendations(
          domain,
          sectorInfo,
          scores,
          allResults,
          competitors
        );
        insertRecommendations(scan.id, recommendations);
        sendEvent(controller, "recommendations", { recommendations });

        // Step 7: Update scan with final scores
        updateScan(scan.id, {
          status: "done",
          overall_score: scores.overall_score,
          mention_rate: scores.mention_rate,
          avg_position:
            allResults.filter((r) => r.brand_mentioned && r.mention_position > 0).length > 0
              ? allResults
                  .filter((r) => r.brand_mentioned && r.mention_position > 0)
                  .reduce((sum, r) => sum + r.mention_position, 0) /
                allResults.filter((r) => r.brand_mentioned && r.mention_position > 0).length
              : 0,
          total_queries: queries.length,
        });

        sendEvent(controller, "complete", {
          scanId: scan.id,
          score: scores.overall_score,
          mention_rate: scores.mention_rate,
        });
      } catch (error) {
        console.error("Analysis error:", error);
        updateScan(scan.id, { status: "error" });
        sendEvent(controller, "error", {
          message: error instanceof Error ? error.message : "Analysis failed",
          scanId: scan.id,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Scan-Id": scan.id,
    },
  });
}
