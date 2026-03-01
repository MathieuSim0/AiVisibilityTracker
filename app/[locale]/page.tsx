"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnalysisProgress } from "@/components/AnalysisProgress";

const EXAMPLE_DOMAINS = [
  "hubspot.com",
  "notion.so",
  "stripe.com",
  "vercel.com",
  "linear.app",
  "figma.com",
];

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations("home");
  const [domain, setDomain] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingDomain, setAnalyzingDomain] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (!cleaned) return;
    setAnalyzingDomain(cleaned);
    setIsAnalyzing(true);
    setError("");
  };

  const handleComplete = (scanId: string) => {
    router.push(`/results/${scanId}`);
  };

  const handleError = (message: string) => {
    setError(message);
    setIsAnalyzing(false);
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 min-h-[70vh]">
        <div className="w-full max-w-2xl">
          <AnalysisProgress
            domain={analyzingDomain}
            onComplete={handleComplete}
            onError={handleError}
          />
        </div>
      </div>
    );
  }

  const features = [
    { icon: "🤖", titleKey: "llm_title", descKey: "llm_desc" },
    { icon: "📊", titleKey: "score_title", descKey: "score_desc" },
    { icon: "🎯", titleKey: "reco_title", descKey: "reco_desc" },
    { icon: "🏆", titleKey: "competitor_title", descKey: "competitor_desc" },
    { icon: "📈", titleKey: "history_title", descKey: "history_desc" },
    { icon: "⚡", titleKey: "realtime_title", descKey: "realtime_desc" },
  ];

  return (
    <div className="flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {t("badge")}
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
              {t("headline_1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t("headline_highlight")}
              </span>{" "}
              {t("headline_2")}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🌐
                </div>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder={t("placeholder")}
                  className="w-full pl-10 pr-4 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-lg"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!domain.trim()}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-blue-500/20"
              >
                {t("cta")}
              </button>
            </div>

            {error && (
              <p className="mt-3 text-red-500 text-sm">{t("error_prefix")} {error}</p>
            )}
          </form>

          {/* Example domains */}
          <div className="space-y-3">
            <p className="text-sm text-gray-400 dark:text-gray-600">{t("try_label")}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_DOMAINS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className="px-4 py-1.5 rounded-lg text-sm bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {features.map((feature) => (
            <div
              key={feature.titleKey}
              className="p-5 rounded-xl bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{t(`features.${feature.titleKey}`)}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">{t(`features.${feature.descKey}`)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
