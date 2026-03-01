import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import {
  getUserByEmail,
  getUserByGoogleId,
  createUser,
  linkGoogleAccount,
  getUserById,
} from "@/lib/auth-db";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        const user = getUserByEmail(email);
        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? email.split("@")[0],
          image: user.avatar_url ?? null,
          twoFaEnabled: user.two_fa_enabled === 1,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    // Runs on Google sign-in: create/link user in our DB
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const googleId = profile?.sub as string;
        const existing = getUserByGoogleId(googleId);

        if (!existing) {
          const byEmail = getUserByEmail(user.email!);
          if (byEmail) {
            linkGoogleAccount(byEmail.id, googleId, user.image ?? null);
            user.id = byEmail.id;
          } else {
            const created = createUser({
              email: user.email!,
              name: user.name ?? null,
              google_id: googleId,
              avatar_url: user.image ?? null,
            });
            user.id = created.id;
          }
        } else {
          user.id = existing.id;
        }
      }
      return true;
    },

    // Override session to also refresh name/image from DB
    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.twoFaEnabled = (token.twoFaEnabled as boolean) ?? false;
      session.user.twoFaVerified = (token.twoFaVerified as boolean) ?? true;

      if (token.userId) {
        const dbUser = getUserById(token.userId as string);
        if (dbUser) {
          session.user.name = dbUser.name ?? session.user.name;
          session.user.image = dbUser.avatar_url ?? session.user.image;
        }
      }
      return session;
    },
  },
});
