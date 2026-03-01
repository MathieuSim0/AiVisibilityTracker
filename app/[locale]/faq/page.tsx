"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const FAQ_CATEGORIES = [
  {
    categoryKey: "cat_general",
    icon: "💡",
    questions: [
      { q: "What is AI Visibility Tracking?", a: "AI Visibility Tracking measures how often and how prominently your brand appears when AI assistants like ChatGPT, Gemini, or Perplexity respond to questions in your industry. Unlike traditional SEO which focuses on search engine rankings, AI Visibility focuses on how AI assistants represent your brand in their answers." },
      { q: "What is GEO — Generative Engine Optimization?", a: "GEO (Generative Engine Optimization) is the practice of improving your brand's presence and representation in AI-generated responses. Just like SEO helps you rank higher in Google, GEO helps you appear more frequently, more prominently, and more positively when AI assistants answer questions in your sector." },
      { q: "Why does AI visibility matter for my business?", a: "AI assistants are rapidly becoming the first point of contact for product research. Studies show that over 30% of users now start their research with an AI chatbot rather than a search engine. If your brand isn't mentioned in AI responses, you're invisible to a growing segment of potential customers." },
      { q: "How is this different from SEO?", a: "Traditional SEO optimizes for keyword rankings in Google/Bing. AI Visibility focuses on how AI assistants perceive and represent your brand. The factors that drive AI visibility — authority signals, structured data, named entity recognition, citation quality — are different from classic SEO ranking factors." },
    ],
  },
  {
    categoryKey: "cat_technical",
    icon: "⚙️",
    questions: [
      { q: "How does the analysis work?", a: "When you enter a domain, our system: (1) Detects your industry sector using AI, (2) Generates 6 relevant queries, (3) Sends those queries to ChatGPT, Gemini, and Perplexity simultaneously, (4) Analyzes each response for your brand's presence, position, and sentiment, (5) Identifies competitors mentioned, and (6) Generates actionable GEO recommendations." },
      { q: "How is the Visibility Score calculated?", a: "The Visibility Score (0-100) is calculated from four factors: Mention Rate (40%) — how often your brand is mentioned; Position Score (25%) — how high in the response your brand appears; Sentiment Score (20%) — whether mentions are positive, neutral, or negative; Coverage Score (15%) — how many different LLMs mention you." },
      { q: "Are the LLM responses real?", a: "Yes. We query real AI APIs. When an API key isn't available, we use Groq (Llama 3.3 70B) with specialized system prompts to simulate each LLM's response style and personality." },
      { q: "How long does an analysis take?", a: "A full analysis typically takes 60-120 seconds. We run 18 queries total (6 queries × 3 LLMs) sequentially to respect API rate limits, then analyze the results and generate recommendations." },
    ],
  },
  {
    categoryKey: "cat_pricing",
    icon: "📊",
    questions: [
      { q: "What do the results mean?", a: "The dashboard shows: your overall Visibility Score, a per-LLM breakdown, which queries triggered mentions, a ranked list of competitors, and AI-generated recommendations to improve your score." },
      { q: "Are my results stored?", a: "Yes, results are stored locally so you can track your score over time. On the Free plan, results are kept for 7 days. Pro users get 90-day history. Your data is never shared with third parties." },
      { q: "Can I re-run an analysis to track progress?", a: "Absolutely — that's the main use case. Run an analysis, implement GEO improvements, then re-run it after a few weeks to measure the impact." },
      { q: "Do you offer a free trial for Pro?", a: "Yes — the Pro trial gives you 14 days of full Pro access, no credit card required." },
    ],
  },
  {
    categoryKey: "cat_geo",
    icon: "🚀",
    questions: [
      { q: "What are the most effective ways to improve AI visibility?", a: "The top GEO strategies are: (1) Build authoritative content; (2) Get mentioned in industry publications and directories; (3) Add structured data (schema.org) to your site; (4) Create comprehensive 'best of' and comparison content; (5) Ensure your brand appears in industry databases and review sites." },
      { q: "How quickly can I see improvements?", a: "AI models update their knowledge periodically, so changes to your online presence take time to reflect. Typically, significant improvements in AI visibility take 4-12 weeks after implementing GEO strategies." },
      { q: "My score is 0 — is my brand completely invisible?", a: "A score of 0 usually means your brand is very new or hasn't yet built enough authority signals. Focus on the Recommendations tab for a customized action plan." },
      { q: "Why does my competitor rank higher than me?", a: "Higher-ranking competitors usually have more mentions in authoritative sources, more user reviews, more comprehensive web content, longer brand history, and stronger domain authority." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10" : "bg-black/3 dark:bg-white/3 border-black/8 dark:border-white/8 hover:bg-black/5 dark:hover:bg-white/4"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
      >
        <span className="font-medium text-foreground text-sm">{q}</span>
        <span className={`text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const t = useTranslations("faq");
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].categoryKey);

  const currentCategory = FAQ_CATEGORIES.find((c) => c.categoryKey === activeCategory)!;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-10 right-1/4 w-[500px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 mb-6">
            FAQ
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AI Visibility
            </span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-48 flex-shrink-0">
            <div className="md:sticky md:top-24 space-y-1">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.categoryKey}
                  onClick={() => setActiveCategory(cat.categoryKey)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    activeCategory === cat.categoryKey
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {t(cat.categoryKey as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">{currentCategory.icon}</span>
              <h2 className="text-xl font-bold text-foreground">{t(currentCategory.categoryKey as Parameters<typeof t>[0])}</h2>
            </div>
            {currentCategory.questions.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20">
          <h3 className="text-xl font-bold mb-2 text-foreground">{t("cta_title")}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t("cta_subtitle")}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/20"
          >
            {t("cta_btn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
