import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      twoFaEnabled: boolean;
      twoFaVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    twoFaEnabled?: boolean;
    twoFaVerified?: boolean;
  }
}
