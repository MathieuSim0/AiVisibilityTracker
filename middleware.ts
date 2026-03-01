import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const { auth } = NextAuth(authConfig);

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];
const TWO_FA_ROUTE = "/auth/2fa";

/** Strip locale prefix to get the effective pathname */
function stripLocale(pathname: string): string {
  const locales = routing.locales as readonly string[];
  for (const loc of locales) {
    if (loc === routing.defaultLocale) continue;
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      return pathname.slice(loc.length + 1) || "/";
    }
  }
  return pathname;
}

/** Get locale prefix from pathname (empty string for default locale) */
function getLocalePrefix(pathname: string): string {
  const locales = routing.locales as readonly string[];
  for (const loc of locales) {
    if (loc === routing.defaultLocale) continue;
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      return `/${loc}`;
    }
  }
  return "";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const cleanPath = stripLocale(pathname);
  const localePrefix = getLocalePrefix(pathname);

  // If authenticated user needs 2FA, gate all protected routes
  if (session?.user && session.user.twoFaEnabled && !session.user.twoFaVerified) {
    const twoFaUrl = `${localePrefix}${TWO_FA_ROUTE}`;
    if (
      cleanPath !== TWO_FA_ROUTE &&
      !pathname.startsWith("/api/auth") &&
      !cleanPath.startsWith("/auth/signin")
    ) {
      if (PROTECTED_ROUTES.some((r) => cleanPath.startsWith(r))) {
        return NextResponse.redirect(new URL(twoFaUrl, req.url));
      }
    }
  }

  // Redirect logged-in users away from auth pages
  if (session?.user && AUTH_ROUTES.some((r) => cleanPath.startsWith(r))) {
    return NextResponse.redirect(new URL(`${localePrefix}/dashboard`, req.url));
  }

  // Protect dashboard routes — redirect to sign in
  if (!session?.user && PROTECTED_ROUTES.some((r) => cleanPath.startsWith(r))) {
    const signInUrl = new URL(`${localePrefix}/auth/signin`, req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
