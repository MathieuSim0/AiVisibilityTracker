import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function PricingPage() {
  const t = await getTranslations("pricing");

  const PLANS = [
    {
      nameKey: "free_name",
      priceKey: "free_price",
      periodKey: "free_period",
      descKey: "free_desc",
      ctaKey: "free_cta",
      features: [
        "3 domain scans per month",
        "3 LLMs analyzed (ChatGPT, Gemini, Perplexity)",
        "Visibility score & basic report",
        "Top 5 competitors detected",
        "7-day history",
      ],
      limitations: ["No API access", "No custom queries", "No export"],
      href: "/",
      highlighted: false,
      badge: null,
    },
    {
      nameKey: "pro_name",
      priceKey: "pro_price",
      periodKey: "pro_period",
      descKey: "pro_desc",
      ctaKey: "pro_cta",
      badgeKey: "pro_badge",
      features: [
        "Unlimited domain scans",
        "All 3 LLMs + future integrations",
        "Full visibility report with AI recommendations",
        "Unlimited competitor tracking",
        "90-day history & trend charts",
        "CSV/JSON export",
        "Priority support",
      ],
      limitations: [],
      href: "/",
      highlighted: true,
      badge: "pro_badge",
    },
    {
      nameKey: "agency_name",
      priceKey: "agency_price",
      periodKey: "agency_period",
      descKey: "agency_desc",
      ctaKey: "agency_cta",
      features: [
        "Everything in Pro",
        "Up to 20 domains",
        "White-label reports (PDF)",
        "API access",
        "Scheduled automated scans",
        "Client-sharing dashboard",
        "Dedicated support",
      ],
      limitations: [],
      href: "/",
      highlighted: false,
      badge: null,
    },
  ];

  const FAQ_ITEMS = [
    { qKey: "faq_q1", aKey: "faq_a1" },
    { qKey: "faq_q2", aKey: "faq_a2" },
    { qKey: "faq_q3", aKey: "faq_a3" },
    { qKey: "faq_q4", aKey: "faq_a4" },
  ];

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("title_1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {t("title_highlight")}
            </span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.nameKey}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all ${
                plan.highlighted
                  ? "bg-gradient-to-b from-blue-900/30 to-blue-950/20 border-blue-500/40 shadow-xl shadow-blue-500/10"
                  : "bg-black/3 dark:bg-white/3 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-semibold text-white shadow-lg">
                    {t(plan.badge as Parameters<typeof t>[0])}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold mb-1 text-foreground">{t(plan.nameKey as Parameters<typeof t>[0])}</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">{t(plan.priceKey as Parameters<typeof t>[0])}</span>
                  <span className="text-gray-500 text-sm">/ {t(plan.periodKey as Parameters<typeof t>[0])}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t(plan.descKey as Parameters<typeof t>[0])}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
                {plan.limitations.map((l) => (
                  <li key={l} className="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-600">
                    <span className="mt-0.5">✕</span>
                    {l}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20"
                    : "bg-black/8 dark:bg-white/8 hover:bg-black/12 dark:hover:bg-white/12 text-foreground border border-black/10 dark:border-white/10"
                }`}
              >
                {t(plan.ctaKey as Parameters<typeof t>[0])}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">{t("faq_title")}</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.qKey} className="p-5 rounded-xl bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8">
                <h3 className="font-semibold text-foreground mb-2">{t(item.qKey as Parameters<typeof t>[0])}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t(item.aKey as Parameters<typeof t>[0])}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
