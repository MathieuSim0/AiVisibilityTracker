export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-is-geo",
    title: "What is GEO? The Beginner's Guide to Generative Engine Optimization",
    excerpt:
      "As AI assistants replace search engines for millions of users, a new discipline is emerging: GEO. Learn what it is, why it matters, and how to get started.",
    category: "GEO Basics",
    readTime: "5 min read",
    publishedAt: "2025-01-15",
    content: `
## The Shift from Search to Conversation

For the past 25 years, getting found online meant one thing: ranking in Google. Marketers built careers around keywords, backlinks, and technical SEO. Then something changed.

In 2023 and 2024, AI assistants — ChatGPT, Gemini, Perplexity — went from novelty to necessity. Today, hundreds of millions of users ask AI chatbots questions every day. Questions like:

- *"What's the best CRM for a startup?"*
- *"Which project management tool should I use?"*
- *"Who are the top players in cloud security?"*

When your potential customer asks one of these questions, **what does the AI say?** Is your brand mentioned? Is it first? Is the description accurate and positive?

If you don't know the answer — that's the problem GEO solves.

## What is GEO?

**Generative Engine Optimization (GEO)** is the practice of improving your brand's visibility, accuracy, and sentiment in AI-generated responses.

Just like SEO is about ranking in search results, GEO is about being mentioned (and well-represented) in AI answers.

The term was coined by researchers at Princeton and other institutions studying how brands can influence their representation in large language model outputs.

## How is GEO Different from SEO?

| Factor | SEO | GEO |
|---|---|---|
| Goal | Rank #1 in Google | Be mentioned by AI assistants |
| Measured by | Keyword rankings | Mention rate, position, sentiment |
| Content focus | Keywords, backlinks | Authority, structured data, citations |
| Update cycle | Real-time (crawling) | Periodic (model training) |
| Tactics | Technical SEO, link building | Entity building, PR, structured markup |

## The Four Pillars of GEO

### 1. Mention Rate
How often is your brand mentioned when relevant questions are asked? A mention rate of 0% means you're invisible; 100% means you appear in every relevant AI response.

### 2. Position
When your brand is mentioned, where does it appear? First mention carries the most weight — AI assistants, like humans, lead with the most important information.

### 3. Sentiment
Are mentions positive, neutral, or negative? AI models often include qualitative context ("X is known for its ease of use" vs. "X has faced criticism for pricing").

### 4. Coverage
Are you mentioned by all major AI assistants, or only some? Different LLMs have different training data and biases. Being visible in ChatGPT but not Perplexity means you're missing part of the market.

## How to Get Started with GEO

1. **Measure your baseline** — Use a tool like AI Visibility Tracker to get your current score across ChatGPT, Gemini, and Perplexity.
2. **Identify gaps** — Which queries aren't triggering your brand? Which LLMs are missing you?
3. **Build authority signals** — Get mentioned in industry publications, review sites, and directories that AI models cite heavily.
4. **Optimize your content** — Create comprehensive, factual content that AI models can cite. Include structured data.
5. **Track over time** — GEO takes months, not days. Run monthly scans to measure progress.

## The Bottom Line

GEO isn't a replacement for SEO — it's a complement. As AI assistants increasingly intermediate between users and brands, visibility in those AI responses becomes a critical marketing channel.

The brands that start building their AI visibility today will have a significant advantage as AI usage continues to grow.
`,
  },
  {
    slug: "how-chatgpt-decides-which-brands-to-mention",
    title: "How ChatGPT Decides Which Brands to Mention",
    excerpt:
      "Understanding the factors that influence ChatGPT's brand recommendations is the first step to improving your AI visibility. Here's what matters.",
    category: "Deep Dives",
    readTime: "7 min read",
    publishedAt: "2025-01-22",
    content: `
## The Black Box Problem

When a user asks ChatGPT "What's the best email marketing platform?", some brands get mentioned and others don't. If your brand doesn't appear, you might wonder: why? What determines which brands ChatGPT recommends?

The honest answer is that it's not fully transparent — but research and experimentation reveal consistent patterns.

## Factor 1: Training Data Prevalence

ChatGPT's knowledge comes from text scraped from the internet. Brands that appear frequently in that training data — especially in authoritative sources — are more likely to be mentioned.

**What this means for you:**
- Get covered in major industry publications (TechCrunch, Forbes, industry-specific blogs)
- Appear in product comparison articles and "best of" listicles
- Get reviewed on G2, Capterra, ProductHunt, and similar platforms
- Earn mentions in Wikipedia (or industry wikis)

The more your brand name appears in high-quality text, the more likely the model is to have "learned" about you.

## Factor 2: Association Strength

LLMs learn through pattern recognition. If your brand consistently appears alongside positive descriptors and in the context of solving specific problems, those associations get encoded.

For example, if hundreds of articles say "Slack is great for team communication," the model learns that Slack = team communication solution. When someone asks about team communication tools, Slack gets mentioned.

**What this means for you:**
- Be consistent in your messaging across all channels
- Claim and optimize your listings on directories with consistent descriptions
- Encourage reviews that mention specific use cases and benefits

## Factor 3: Temporal Recency (for newer models)

Newer GPT versions and models with web search (like Perplexity) factor in recency. Brands with recent news coverage and product updates get a visibility boost.

**What this means for you:**
- Maintain a regular cadence of press releases and product announcements
- Pursue coverage in industry media, not just your own blog
- Time major announcements for maximum media pickup

## Factor 4: Category Definition

AI models categorize brands. If you're clearly categorized as a "project management tool" or "CRM" or "email marketing platform," you're more likely to be mentioned for those queries.

If your brand doesn't fit cleanly into a recognized category — or if you're trying to own a new category — AI visibility will be harder to build.

**What this means for you:**
- Make sure your category is crystal clear in all public descriptions
- Ensure your own website explicitly states your category in structured data
- If you're creating a new category, invest heavily in category-definition content

## Factor 5: Authority and Trust Signals

LLMs tend to recommend brands that other sources recommend. It's a recursive effect: brands mentioned in authoritative sources get learned as "authoritative" and get recommended more.

**What this means for you:**
- Industry awards and recognition matter
- Being included in analyst reports (Gartner, Forrester, etc.) provides major authority signals
- Case studies published on your own site help if they get picked up by external sources

## The Simulation Limitation

One important caveat: AI visibility trackers (including this one) can only approximate real LLM behavior. The actual models are updated continuously, and the factors above are based on research and observation, not official documentation from OpenAI, Google, or Anthropic.

Regular tracking is the best way to measure your actual visibility — not theoretical models of how the AI works.

## Practical Next Steps

1. **Audit your online presence** — Are you on the major review sites? Do your profiles accurately describe your core value proposition?
2. **Identify authority gaps** — Where do your competitors get mentioned that you don't?
3. **Build a PR and content strategy** focused on the specific queries where you want to appear
4. **Track your progress monthly** using an AI visibility tool

Understanding these factors gives you a roadmap. The work isn't quick — but it's measurable.
`,
  },
  {
    slug: "5-ways-to-improve-ai-visibility",
    title: "5 Proven Ways to Improve Your Brand's Visibility in AI Assistants",
    excerpt:
      "Your brand isn't showing up in ChatGPT or Perplexity? Here are five concrete strategies with real examples of brands that improved their AI visibility scores.",
    category: "Strategies",
    readTime: "6 min read",
    publishedAt: "2025-02-01",
    content: `
## Why Your AI Visibility Score Matters

Before diving into tactics, let's quantify the opportunity: studies show that AI assistants are now involved in the research phase of over 30% of B2B purchase decisions. If your brand doesn't appear in those AI responses, you're losing at the top of the funnel.

Here are five proven strategies to change that.

## Strategy 1: Build Your Entity Presence

AI models understand the world through *entities* — recognized names, products, organizations, and concepts. The stronger your entity signal, the more confidently AI models mention you.

**How to build entity presence:**
- **Wikipedia/Wikidata**: If your company is notable enough, get a Wikipedia page or at minimum a Wikidata entry. This is a primary source for entity recognition.
- **Google Business Profile**: Claim and fully complete your profile.
- **Structured data**: Add organization schema.org markup to your website homepage — it directly signals your brand identity to crawlers that feed AI training data.
- **Consistent NAP**: Ensure your Name, Address, Phone is identical across every directory listing.

**Quick win**: Check if your brand appears on Wikidata. If not, create an entry with accurate, sourced information about your company.

## Strategy 2: Dominate Review Platforms

AI models — especially Perplexity and newer ChatGPT versions — heavily weight content from review aggregators. G2, Capterra, Trustpilot, and Product Hunt are frequently cited in AI training data.

**Action steps:**
- Claim your profiles on G2, Capterra, GetApp, and any industry-specific review sites
- Actively request reviews from happy customers (especially detailed ones that mention use cases)
- Respond to reviews — it signals an active, legitimate brand
- Aim for 50+ reviews with high ratings on at least two major platforms

A brand with 200 verified G2 reviews will appear in AI responses far more often than one with 10.

## Strategy 3: Get Covered in "Best Of" Content

When AI models answer "What's the best [tool] for [use case]?", they heavily draw from articles that use that exact framing. Being featured in "10 Best CRM Tools of 2025" articles is SEO and GEO gold.

**How to get there:**
- Identify the top "best of" articles in your category (search Google for "best [your category]")
- Do outreach to the authors/publishers — offer to provide updated info, a trial, or a quote
- Create your own definitive comparison content (including honest comparisons with competitors)
- Reach out to industry bloggers and YouTubers who create comparison content

**Pro tip**: Don't just aim for #1 rankings in these articles. Being consistently mentioned in positions 2-5 across many articles is better for AI visibility than being #1 in just one.

## Strategy 4: Publish Authoritative, Citable Content

AI models learn from text. If your website or blog publishes content that other sites cite and reference, your brand appears more in the training data ecosystem.

**What to create:**
- **Original research** (surveys, data studies) that journalists cite
- **Definitive guides** that become the reference resource for a topic
- **Data/statistics pages** that reporters link to when writing about your industry
- **Case studies** with specific, measurable results

**Example**: If you publish "The State of [Industry] in 2025" with original survey data, and 50 publications write about it with a citation, your brand appears in all those articles — and thus in AI training data.

## Strategy 5: Strategic PR and Third-Party Mentions

AI models weight third-party mentions more than self-published content. A TechCrunch article about your product is worth more than 100 blog posts on your own site.

**How to build third-party mentions:**
- **Product Hunt launches** — still one of the best ways to get third-party tech coverage
- **Press releases** on wire services (PR Newswire, BusinessWire) feed into training data
- **Industry newsletter features** — niche newsletters with dedicated audiences are powerful
- **Podcast appearances** — transcripts get indexed and become training data
- **Award applications** — industry awards get covered in press, creating authoritative mentions

**Prioritize quality over quantity.** One Forbes mention creates more AI visibility than ten small blog features.

## Putting It Together: A 90-Day GEO Plan

**Month 1 (Foundation):**
- Measure your baseline visibility score
- Claim all review profiles and request initial reviews
- Add schema.org markup to your website
- Create or update Wikidata entry

**Month 2 (Authority Building):**
- Outreach to 20 "best of" articles for inclusion
- Publish one original research piece
- Conduct 3-5 PR outreach campaigns

**Month 3 (Measurement):**
- Re-run your AI visibility scan
- Compare results by LLM and by query type
- Double down on the tactics that showed improvement

GEO is a marathon, not a sprint. But with consistent effort, brands typically see meaningful score improvements within 60-90 days.
`,
  },
  {
    slug: "seo-vs-geo-2025",
    title: "SEO vs. GEO in 2025: Do You Need Both?",
    excerpt:
      "With AI assistants eating into Google's search traffic, should you pivot from SEO to GEO — or do you need both? A data-driven look at the trade-offs.",
    category: "Strategy",
    readTime: "5 min read",
    publishedAt: "2025-02-10",
    content: `
## The Question Everyone Is Asking

"Should I focus on SEO or GEO in 2025?"

It's a fair question. AI-powered search has disrupted the traditional SEO playbook. Google's AI Overviews now answer queries directly on the results page, reducing click-through rates. Meanwhile, ChatGPT and Perplexity are becoming starting points for research that would have previously gone to Google.

Does this mean SEO is dying? No — but it is changing. And GEO is becoming a necessary complement.

## What the Traffic Data Shows

- **Google's dominance**: Google still handles ~90% of global search queries. SEO isn't optional.
- **AI assistant growth**: ChatGPT now has over 200M weekly active users. Perplexity processes 100M queries per month. These numbers are growing fast.
- **Zero-click searches**: Google's AI Overviews appear in ~40% of searches, often reducing organic traffic even when you rank #1.

The takeaway: Google is still dominant, but the **incremental opportunity** is in AI visibility — and the competition for that attention is lower right now.

## Where SEO and GEO Overlap

Good news: SEO and GEO have significant overlap. If you're doing SEO well, you're already building some of the foundations of GEO.

**Shared tactics:**
- High-quality, authoritative content
- Strong domain authority
- Technical site structure
- Consistent brand presence

**What this means**: Your SEO investments benefit your GEO score. You don't have to choose — you can prioritize and layer.

## Where GEO Requires Different Thinking

There are meaningful differences, however:

**Entity-first thinking**: GEO requires thinking about your brand as an *entity* in a knowledge graph, not just a keyword. Does your brand have a clear, unambiguous description across the web?

**Citation-focused content**: AI models love primary sources, research, and data. This is different from the "keyword-stuffed landing pages" approach that still works for some SEO.

**Sentiment management**: SEO doesn't track sentiment, but GEO does. How your brand is described in aggregate — across reviews, press, and social — affects how AI models represent you.

**No real-time feedback**: SEO tools give you ranking data within days. GEO changes take weeks or months to reflect in model outputs. You need longer-term thinking.

## The Bottom Line: Both, But Prioritized Differently

For most businesses in 2025:

1. **Don't abandon SEO** — it still drives the majority of organic traffic
2. **Add GEO as a complementary channel** — the incremental effort is relatively low if your SEO foundation is solid
3. **Prioritize GEO if** your buyers are in a high-intent research category (B2B software, financial services, healthcare, tech)
4. **Prioritize SEO if** your buyers use Google search as their primary discovery mechanism (local services, e-commerce, content sites)

The brands that will win in 2026 and beyond are those building visibility in *both* channels — not those who've picked one and ignored the other.

---

*Track your AI visibility score for free with AI Visibility Tracker — and see exactly where you stand in ChatGPT, Gemini, and Perplexity.*
`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
