import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import type { Scan, QueryResult, Competitor, Recommendation, ScanWithDetails } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "tracker.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      google_id TEXT UNIQUE,
      avatar_url TEXT,
      two_fa_secret TEXT,
      two_fa_enabled INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      domain TEXT NOT NULL,
      sector TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      overall_score INTEGER,
      mention_rate REAL,
      avg_position REAL,
      total_queries INTEGER,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS query_results (
      id TEXT PRIMARY KEY,
      scan_id TEXT REFERENCES scans(id),
      llm_name TEXT NOT NULL,
      query TEXT NOT NULL,
      response TEXT NOT NULL,
      brand_mentioned INTEGER DEFAULT 0,
      mention_position INTEGER DEFAULT 0,
      sentiment TEXT,
      context_snippet TEXT
    );

    CREATE TABLE IF NOT EXISTS competitors (
      id TEXT PRIMARY KEY,
      scan_id TEXT REFERENCES scans(id),
      name TEXT NOT NULL,
      mention_count INTEGER DEFAULT 0,
      avg_position REAL DEFAULT 0,
      llms_present TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      scan_id TEXT REFERENCES scans(id),
      category TEXT NOT NULL,
      priority TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      impact_score INTEGER DEFAULT 5
    );
  `);

  // Migrations — add columns that may be missing in existing DBs
  const scanCols = db.pragma("table_info(scans)") as { name: string }[];
  if (!scanCols.some((c) => c.name === "user_id")) {
    db.exec(`ALTER TABLE scans ADD COLUMN user_id TEXT REFERENCES users(id);`);
  }
}

// Scans
export function createScan(domain: string, userId?: string): Scan {
  const db = getDb();
  const id = uuidv4();
  db.prepare(
    `INSERT INTO scans (id, user_id, domain, status) VALUES (?, ?, ?, 'pending')`
  ).run(id, userId ?? null, domain);
  return getScanById(id)!;
}

export function getScansByUser(userId: string): Scan[] {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM scans WHERE user_id = ? AND status = 'done' ORDER BY created_at DESC`)
    .all(userId) as Scan[];
}

export function updateScan(
  id: string,
  data: Partial<Omit<Scan, "id" | "domain" | "created_at">>
): void {
  const db = getDb();
  const fields = Object.keys(data)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = [...Object.values(data), id];
  db.prepare(`UPDATE scans SET ${fields} WHERE id = ?`).run(...values);
}

export function getScanById(id: string): Scan | null {
  const db = getDb();
  return db.prepare(`SELECT * FROM scans WHERE id = ?`).get(id) as Scan | null;
}

export function getAllScans(): Scan[] {
  const db = getDb();
  return db.prepare(`SELECT * FROM scans ORDER BY created_at DESC`).all() as Scan[];
}

export function getScansByDomain(domain: string): Scan[] {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM scans WHERE domain = ? AND status = 'done' ORDER BY created_at ASC`)
    .all(domain) as Scan[];
}

export function getFullScan(id: string): ScanWithDetails | null {
  const db = getDb();
  const scan = getScanById(id);
  if (!scan) return null;

  const query_results = db
    .prepare(`SELECT * FROM query_results WHERE scan_id = ?`)
    .all(id) as QueryResult[];

  const rawCompetitors = db
    .prepare(`SELECT * FROM competitors WHERE scan_id = ? ORDER BY mention_count DESC`)
    .all(id) as Array<Competitor & { llms_present: string }>;

  const competitors: Competitor[] = rawCompetitors.map((c) => ({
    ...c,
    llms_present: JSON.parse(c.llms_present || "[]"),
  }));

  const recommendations = db
    .prepare(`SELECT * FROM recommendations WHERE scan_id = ? ORDER BY impact_score DESC`)
    .all(id) as Recommendation[];

  return {
    ...scan,
    query_results: query_results.map((r) => ({
      ...r,
      brand_mentioned: Boolean(r.brand_mentioned),
    })),
    competitors,
    recommendations,
  };
}

// Query Results
export function insertQueryResult(
  scanId: string,
  data: Omit<QueryResult, "id" | "scan_id">
): void {
  const db = getDb();
  const id = uuidv4();
  db.prepare(`
    INSERT INTO query_results (id, scan_id, llm_name, query, response, brand_mentioned, mention_position, sentiment, context_snippet)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    scanId,
    data.llm_name,
    data.query,
    data.response,
    data.brand_mentioned ? 1 : 0,
    data.mention_position,
    data.sentiment,
    data.context_snippet
  );
}

// Competitors
export function insertCompetitors(
  scanId: string,
  competitors: Omit<Competitor, "id" | "scan_id">[]
): void {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO competitors (id, scan_id, name, mention_count, avg_position, llms_present)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((comps: Omit<Competitor, "id" | "scan_id">[]) => {
    for (const c of comps) {
      insert.run(
        uuidv4(),
        scanId,
        c.name,
        c.mention_count,
        c.avg_position,
        JSON.stringify(c.llms_present)
      );
    }
  });
  insertMany(competitors);
}

// Recommendations
export function insertRecommendations(
  scanId: string,
  recs: Omit<Recommendation, "id" | "scan_id">[]
): void {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO recommendations (id, scan_id, category, priority, title, description, impact_score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((recommendations: Omit<Recommendation, "id" | "scan_id">[]) => {
    for (const r of recommendations) {
      insert.run(uuidv4(), scanId, r.category, r.priority, r.title, r.description, r.impact_score);
    }
  });
  insertMany(recs);
}
