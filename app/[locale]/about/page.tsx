import { getTranslations } from "next-intl/server";
import Link from "next/link";

const HOW_IT_WORKS = [
  { step: "01", title: "Enter your domain", description: "Type in any domain name — your brand, a competitor, or a company you're researching. No account needed to start." },
  { step: "02", title: "AI detects your sector", description: "Our system automatically identifies your industry and generates 6 queries that a real user would ask an AI assistant about your sector." },
  { step: "03", title: "Queries 3 LLMs simultaneously", description: "Each query is sent to ChatGPT, Gemini, and Perplexity. We capture the full response, detect brand mentions, analyze position and sentiment." },
  { step: "04", title: "Calculate your Visibility Score", description: "A composite score (0-100) is computed from mention rate (40%), position (25%), sentiment (20%), and LLM coverage (15%)." },
  { step: "05", title: "Identify competitors", description: "We extract every brand mentioned in AI responses that isn't yours. You see exactly who's outcompeting you — and on which LLMs." },
  { step: "06", title: "Generate recommendations", description: "AI-powered, sector-specific recommendations tell you exactly what to do to improve your score — ranked by impact." },
];

const TECH_STACK = [
  { name: "Next.js 16", description: "App Router, TypeScript, Server Components" },
  { name: "Groq / Llama 3.3 70B", description: "Fast inference, free tier, 14,400 req/day" },
  { name: "SQLite + better-sqlite3", description: "Lightweight local persistence" },
  { name: "Recharts", description: "Historical score visualization" },
  { name: "Tailwind CSS + shadcn/ui", description: "Responsive UI with light/dark mode" },
  { name: "SSE Streaming", description: "Real-time progress updates" },
];

const SCORING_FACTORS = [
  { label: "Mention Rate", weight: "40%", description: "% of queries where your brand was mentioned", icon: "🎯" },
  { label: "Position Score", weight: "25%", description: "How early in the response your brand appears", icon: "📍" },
  { label: "Sentiment Score", weight: "20%", description: "Whether mentions are positive, neutral, or negative", icon: "💬" },
  { label: "Coverage Score", weight: "15%", description: "How many different LLMs mention you", icon: "🌐" },
];

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t("badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {t("title_highlight")}
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t("steps_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-xl bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <div className="text-3xl font-black text-black/10 dark:text-white/10 mb-3">{step.step}</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scoring methodology */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="p-8 rounded-2xl bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8">
            <h2 className="text-2xl font-bold mb-2 text-center text-foreground">{t("scoring_title")}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">
              Our score is computed from four independent factors, each measuring a different dimension of AI presence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {SCORING_FACTORS.map((factor) => (
                <div key={factor.label} className="flex items-start gap-4 p-4 rounded-xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5">
                  <span className="text-2xl">{factor.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">{factor.label}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-500 dark:text-blue-400 text-xs font-bold">
                        {factor.weight}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5 text-center">
              <code className="text-sm text-blue-500 dark:text-blue-300 font-mono">
                Score = mention_rate × 0.40 + position_score × 0.25 + sentiment_score × 0.20 + coverage_score × 0.15
              </code>
            </div>
          </div>
        </section>

        {/* Multi-LLM approach */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">{t("llms_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "ChatGPT", icon: "🤖", description: "Conversational, knowledge-rich, the most-used AI assistant globally.", color: "from-green-900/20 to-transparent border-green-500/20" },
              { name: "Gemini", icon: "🔮", description: "Google's AI — structured, list-oriented, favors sources with Google authority signals.", color: "from-blue-900/20 to-transparent border-blue-500/20" },
              { name: "Perplexity", icon: "🔍", description: "Citation-focused, real-time search-integrated. Biased toward recent news and authoritative sources.", color: "from-purple-900/20 to-transparent border-purple-500/20" },
            ].map((llm) => (
              <div key={llm.name} className={`p-6 rounded-xl bg-gradient-to-b ${llm.color} border`}>
                <div className="text-3xl mb-3">{llm.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{llm.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{llm.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">{t("tech_title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className="p-4 rounded-xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5">
                <h3 className="font-semibold text-foreground text-sm mb-1">{tech.name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20">
            <h3 className="text-2xl font-bold mb-3 text-foreground">{t("cta_title")}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t("cta_subtitle")}</p>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/20"
            >
              {t("cta_btn")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
