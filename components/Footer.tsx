"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations("footer");

  if (pathname.startsWith("/auth/")) return null;

  return (
    <footer className="relative z-10 border-t border-black/8 dark:border-white/5 bg-background">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎯</span>
              <span className="font-bold text-foreground">AI Visibility Tracker</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t("product")}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t("analyze")}</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t("how_it_works")}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t("resources")}</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/blog/what-is-geo" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t("what_is_geo")}</Link></li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t("technology")}</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-400 dark:text-gray-600">{t("chatgpt")}</span></li>
              <li><span className="text-sm text-gray-400 dark:text-gray-600">{t("gemini")}</span></li>
              <li><span className="text-sm text-gray-400 dark:text-gray-600">{t("perplexity")}</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-black/8 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {t("copyright")}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-700">
            {t("powered")}
          </p>
        </div>
      </div>
    </footer>
  );
}
