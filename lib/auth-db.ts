import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { generateSecret, generateURI, verifySync } from "otplib";

export interface User {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  google_id: string | null;
  avatar_url: string | null;
  two_fa_secret: string | null;
  two_fa_enabled: boolean;
  created_at: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();
  if (error) return null;
  return data as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();
  if (error) return null;
  return data as User;
}

export async function getUserByGoogleId(googleId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("google_id", googleId)
    .single();
  if (error) return null;
  return data as User;
}

export async function createUser(data: {
  email: string;
  name?: string | null;
  password_hash?: string | null;
  google_id?: string | null;
  avatar_url?: string | null;
}): Promise<User> {
  const id = uuidv4();
  const { error } = await supabase.from("users").insert({
    id,
    email: data.email,
    name: data.name ?? null,
    password_hash: data.password_hash ?? null,
    google_id: data.google_id ?? null,
    avatar_url: data.avatar_url ?? null,
  });
  if (error) throw error;
  return (await getUserById(id))!;
}

export async function linkGoogleAccount(
  userId: string,
  googleId: string,
  avatarUrl?: string | null
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ google_id: googleId, avatar_url: avatarUrl ?? null })
    .eq("id", userId);
  if (error) throw error;
}

export async function updateUserName(userId: string, name: string): Promise<void> {
  const { error } = await supabase.from("users").update({ name }).eq("id", userId);
  if (error) throw error;
}

// ─── 2FA ────────────────────────────────────────────────────────────────────

export async function generate2FASecret(
  userId: string
): Promise<{ secret: string; otpAuthUrl: string }> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const secret = generateSecret();
  const otpAuthUrl = generateURI({
    label: user.email,
    issuer: "AI Visibility Tracker",
    secret,
  });

  const { error } = await supabase
    .from("users")
    .update({ two_fa_secret: secret })
    .eq("id", userId);
  if (error) throw error;

  return { secret, otpAuthUrl };
}

export async function verify2FAToken(userId: string, token: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user?.two_fa_secret) return false;
  const result = verifySync({ token, secret: user.two_fa_secret, epochTolerance: 1 });
  return result.valid;
}

export async function enable2FA(userId: string): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ two_fa_enabled: true })
    .eq("id", userId);
  if (error) throw error;
}

export async function disable2FA(userId: string): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ two_fa_enabled: false, two_fa_secret: null })
    .eq("id", userId);
  if (error) throw error;
}
