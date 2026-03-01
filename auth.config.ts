import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Node.js APIs, no SQLite).
 * Used by middleware.ts which runs on the Edge runtime.
 */
export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [], // populated in auth.ts (Node.js only)

  callbacks: {
    jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        token.userId = (user as { id?: string }).id;
        const twoFaEnabled = (user as { twoFaEnabled?: boolean }).twoFaEnabled ?? false;
        token.twoFaEnabled = twoFaEnabled;
        token.twoFaVerified = !twoFaEnabled;
      }
      if (trigger === "update" && updateSession?.user) {
        const u = updateSession.user as { twoFaEnabled?: boolean; twoFaVerified?: boolean };
        if (u.twoFaVerified !== undefined) token.twoFaVerified = u.twoFaVerified;
        if (u.twoFaEnabled !== undefined) token.twoFaEnabled = u.twoFaEnabled;
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.twoFaEnabled = (token.twoFaEnabled as boolean) ?? false;
      session.user.twoFaVerified = (token.twoFaVerified as boolean) ?? true;
      return session;
    },
  },
};
