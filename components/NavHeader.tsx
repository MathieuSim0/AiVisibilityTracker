"use client";

import { usePathname, Link } from "@/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function NavHeader() {
  const pathname = usePathname(); // locale-stripped path
  const { data: session, status } = useSession();
  const t = useTranslations("nav");
  const loading = status === "loading";

  // Auth pages have their own full-page layout — hide global nav
  if (pathname.startsWith("/auth/")) return null;

  const NAV_LINKS = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/pricing", label: t("pricing") },
    { href: "/blog", label: t("blog") },
    { href: "/faq", label: t("faq") },
    { href: "/compare", label: t("compare") },
  ];

  return (
    <header className="relative z-50 flex items-center justify-between px-8 py-5 border-b border-black/8 dark:border-white/5 bg-background/80 backdrop-blur-sm sticky top-0">
      <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <span className="text-2xl">🎯</span>
        <span className="font-bold text-lg text-foreground">AI Visibility Tracker</span>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === link.href
                ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            {link.label}
          </Link>
        ))}
        {session?.user && (
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/dashboard"
                ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            {t("dashboard")}
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-2">
        <span className="hidden sm:block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-xs">
          Beta
        </span>

        <ThemeToggle />
        <LanguageSwitcher />

        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 animate-pulse" />
        ) : session?.user ? (
          <UserMenu
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
            twoFaEnabled={session.user.twoFaEnabled}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth/signin"
              className="hidden md:block px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t("signin")}
            </Link>
            <Link
              href="/"
              className="hidden md:block px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/20"
            >
              {t("analyze")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
