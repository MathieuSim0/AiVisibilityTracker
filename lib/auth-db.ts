import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { generateSecret, generateURI, verifySync } from "otplib";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "tracker.db");

export interface User {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  google_id: string | null;
  avatar_url: string | null;
  two_fa_secret: string | null;
  two_fa_enabled: number; // 0 or 1
  created_at: string;
}

let _db: Database.Database | null = null;
function getDb(): Database.Database {
  if (!_db) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
  }
  return _db;
}

export function getUserByEmail(email: string): User | null {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as User | null;
}

export function getUserById(id: string): User | null {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | null;
}

export function getUserByGoogleId(googleId: string): User | null {
  return getDb().prepare("SELECT * FROM users WHERE google_id = ?").get(googleId) as User | null;
}

export function createUser(data: {
  email: string;
  name?: string | null;
  password_hash?: string | null;
  google_id?: string | null;
  avatar_url?: string | null;
}): User {
  const id = uuidv4();
  getDb().prepare(`
    INSERT INTO users (id, email, name, password_hash, google_id, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.email, data.name ?? null, data.password_hash ?? null, data.google_id ?? null, data.avatar_url ?? null);
  return getUserById(id)!;
}

export function linkGoogleAccount(userId: string, googleId: string, avatarUrl?: string | null): void {
  getDb().prepare(`UPDATE users SET google_id = ?, avatar_url = ? WHERE id = ?`)
    .run(googleId, avatarUrl ?? null, userId);
}

export function updateUserName(userId: string, name: string): void {
  getDb().prepare("UPDATE users SET name = ? WHERE id = ?").run(name, userId);
}

// ─── 2FA ────────────────────────────────────────────────────────────────────

export function generate2FASecret(userId: string): { secret: string; otpAuthUrl: string } {
  const user = getUserById(userId);
  if (!user) throw new Error("User not found");

  const secret = generateSecret();
  const otpAuthUrl = generateURI({
    label: user.email,
    issuer: "AI Visibility Tracker",
    secret,
  });

  // Store secret temporarily (not enabled yet — user must verify first)
  getDb().prepare("UPDATE users SET two_fa_secret = ? WHERE id = ?").run(secret, userId);

  return { secret, otpAuthUrl };
}

export function verify2FAToken(userId: string, token: string): boolean {
  const user = getUserById(userId);
  if (!user?.two_fa_secret) return false;
  const result = verifySync({ token, secret: user.two_fa_secret, epochTolerance: 1 });
  return result.valid;
}

export function enable2FA(userId: string): void {
  getDb().prepare("UPDATE users SET two_fa_enabled = 1 WHERE id = ?").run(userId);
}

export function disable2FA(userId: string): void {
  getDb().prepare("UPDATE users SET two_fa_enabled = 0, two_fa_secret = NULL WHERE id = ?").run(userId);
}
