import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import type { Scan, QueryResult, Competitor, Recommendation, ScanWithDetails } from "@/types";

// Scans
export async function createScan(domain: string, userId?: string): Promise<Scan> {
  const { data, error } = await supabase
    .from("scans")
    .insert({ id: uuidv4(), user_id: userId ?? null, domain, status: "pending" })
    .select()
    .single();
  if (error) throw error;
  return data as Scan;
}

export async function getScansByUser(userId: string): Promise<Scan[]> {
  const { data, error } = await supabase
    .from("scans")
    .select()
    .eq("user_id", userId)
    .eq("status", "done")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Scan[];
}

export async function updateScan(
  id: string,
  data: Partial<Omit<Scan, "id" | "domain" | "created_at">>
): Promise<void> {
  const { error } = await supabase.from("scans").update(data).eq("id", id);
  if (error) throw error;
}

export async function getScanById(id: string): Promise<Scan | null> {
  const { data, error } = await supabase.from("scans").select().eq("id", id).single();
  if (error) return null;
  return data as Scan;
}

export async function getAllScans(): Promise<Scan[]> {
  const { data, error } = await supabase
    .from("scans")
    .select()
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Scan[];
}

export async function getScansByDomain(domain: string): Promise<Scan[]> {
  const { data, error } = await supabase
    .from("scans")
    .select()
    .eq("domain", domain)
    .eq("status", "done")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Scan[];
}

export async function getFullScan(id: string): Promise<ScanWithDetails | null> {
  const scan = await getScanById(id);
  if (!scan) return null;

  const [{ data: query_results }, { data: rawCompetitors }, { data: recommendations }] =
    await Promise.all([
      supabase.from("query_results").select().eq("scan_id", id),
      supabase
        .from("competitors")
        .select()
        .eq("scan_id", id)
        .order("mention_count", { ascending: false }),
      supabase
        .from("recommendations")
        .select()
        .eq("scan_id", id)
        .order("impact_score", { ascending: false }),
    ]);

  return {
    ...scan,
    query_results: (query_results ?? []) as QueryResult[],
    competitors: (rawCompetitors ?? []) as Competitor[],
    recommendations: (recommendations ?? []) as Recommendation[],
  };
}

// Query Results
export async function insertQueryResult(
  scanId: string,
  data: Omit<QueryResult, "id" | "scan_id">
): Promise<void> {
  const { error } = await supabase
    .from("query_results")
    .insert({ id: uuidv4(), scan_id: scanId, ...data });
  if (error) throw error;
}

// Competitors
export async function insertCompetitors(
  scanId: string,
  competitors: Omit<Competitor, "id" | "scan_id">[]
): Promise<void> {
  if (competitors.length === 0) return;
  const rows = competitors.map((c) => ({ id: uuidv4(), scan_id: scanId, ...c }));
  const { error } = await supabase.from("competitors").insert(rows);
  if (error) throw error;
}

// Recommendations
export async function insertRecommendations(
  scanId: string,
  recs: Omit<Recommendation, "id" | "scan_id">[]
): Promise<void> {
  if (recs.length === 0) return;
  const rows = recs.map((r) => ({ id: uuidv4(), scan_id: scanId, ...r }));
  const { error } = await supabase.from("recommendations").insert(rows);
  if (error) throw error;
}
