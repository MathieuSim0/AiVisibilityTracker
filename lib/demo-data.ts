/**
 * Demo mode: pre-populated realistic data for showcasing the app
 * without consuming API credits. Activated with ?demo=1 or demo domains.
 */

export const DEMO_DOMAINS = ["hubspot.com", "notion.so", "stripe.com"];

export function isDemoDomain(domain: string): boolean {
  return DEMO_DOMAINS.includes(domain.toLowerCase());
}

interface DemoAnalysis {
  sector: { sector: string; description: string };
  queries: string[];
  results: Array<{
    llm_name: "chatgpt" | "gemini" | "perplexity";
    query: string;
    response: string;
    brand_mentioned: boolean;
    mention_position: number;
    sentiment: "positive" | "neutral" | "negative" | null;
    context_snippet: string | null;
  }>;
  competitors: Array<{ name: string; mention_count: number; avg_position: number; llms_present: string[] }>;
  recommendations: Array<{
    category: "content" | "technical" | "authority" | "presence";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    impact_score: number;
  }>;
}

const HUBSPOT_DEMO: DemoAnalysis = {
  sector: {
    sector: "CRM / Marketing Automation",
    description: "HubSpot provides an all-in-one CRM, marketing, sales, and customer service platform for businesses.",
  },
  queries: [
    "best CRM software for small businesses",
    "top marketing automation tools 2024",
    "CRM vs Salesforce comparison",
    "how to automate email marketing campaigns",
    "best tools for inbound marketing",
    "sales pipeline management software",
  ],
  results: [
    {
      llm_name: "chatgpt",
      query: "best CRM software for small businesses",
      response: `For small businesses, here are the top CRM options:\n\n1. **HubSpot CRM** - Excellent free tier, intuitive interface, and scales well. Best for businesses prioritizing inbound marketing and sales automation.\n\n2. **Salesforce** - Industry leader with extensive customization. Can be complex for small teams.\n\n3. **Pipedrive** - Sales-focused CRM with visual pipeline management.\n\n4. **Zoho CRM** - Affordable with strong feature set.\n\n5. **Monday.com** - Flexible project management + CRM hybrid.\n\nHubSpot is often the top recommendation for small businesses due to its generous free plan and ease of use.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot CRM - Excellent free tier, intuitive interface, and scales well. Best for businesses prioritizing inbound marketing",
    },
    {
      llm_name: "chatgpt",
      query: "top marketing automation tools 2024",
      response: `The leading marketing automation platforms in 2024:\n\n1. **HubSpot** - All-in-one platform combining CRM, email marketing, social media, and analytics. Strong inbound marketing focus.\n\n2. **Marketo (Adobe)** - Enterprise-grade automation, complex but powerful.\n\n3. **Mailchimp** - User-friendly email marketing with automation features.\n\n4. **ActiveCampaign** - Excellent email automation and CRM integration.\n\n5. **Pardot (Salesforce)** - B2B marketing automation integrated with Salesforce.\n\nFor most mid-market companies, HubSpot offers the best balance of features and usability.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot - All-in-one platform combining CRM, email marketing, social media, and analytics",
    },
    {
      llm_name: "chatgpt",
      query: "CRM vs Salesforce comparison",
      response: `Salesforce vs alternatives comparison:\n\n**Salesforce**\n- Industry standard for enterprises\n- Highly customizable\n- Large ecosystem of integrations\n- Expensive (starts ~$25/user/month)\n\n**HubSpot**\n- Better for inbound marketing\n- Free CRM tier available\n- Easier to implement\n- More affordable for SMBs\n\n**Microsoft Dynamics**\n- Best for Microsoft shop environments\n- Strong ERP integration\n\n**Pipedrive**\n- Sales-focused, simple pipeline\n\nChoice depends on company size and budget.`,
      brand_mentioned: true,
      mention_position: 2,
      sentiment: "positive",
      context_snippet: "HubSpot - Better for inbound marketing. Free CRM tier available. Easier to implement. More affordable for SMBs",
    },
    {
      llm_name: "chatgpt",
      query: "how to automate email marketing campaigns",
      response: `Email marketing automation best practices:\n\n**Tools to use:**\n- Mailchimp - Simple automation for beginners\n- ActiveCampaign - Advanced behavioral triggers\n- Klaviyo - Best for e-commerce\n- Drip - E-commerce CRM\n\n**Key automation workflows:**\n1. Welcome sequence (new subscribers)\n2. Abandoned cart recovery\n3. Lead nurturing drip campaigns\n4. Re-engagement campaigns\n\n**Tips:** Segment your audience, test subject lines, and monitor open rates.\n\nFor B2B businesses, consider tools with CRM integration like Salesforce or Marketo.`,
      brand_mentioned: false,
      mention_position: 0,
      sentiment: null,
      context_snippet: null,
    },
    {
      llm_name: "chatgpt",
      query: "best tools for inbound marketing",
      response: `Top inbound marketing tools:\n\n1. **HubSpot** - The de facto standard for inbound marketing. Offers content management, SEO tools, social media scheduling, and lead generation.\n\n2. **SEMrush** - Comprehensive SEO and content marketing platform.\n\n3. **Ahrefs** - Leading backlink and keyword research tool.\n\n4. **Canva** - Design tool for creating marketing content.\n\n5. **Buffer/Hootsuite** - Social media management.\n\nHubSpot was essentially founded on the concept of inbound marketing and remains the category leader.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot - The de facto standard for inbound marketing. Offers content management, SEO tools, social media scheduling",
    },
    {
      llm_name: "chatgpt",
      query: "sales pipeline management software",
      response: `Best sales pipeline management tools:\n\n1. **Salesforce** - Most powerful, enterprise-focused\n2. **Pipedrive** - Visual pipeline, sales-team favorite\n3. **HubSpot Sales Hub** - Great free tier, integrates with marketing\n4. **Close** - Built for inside sales teams\n5. **Copper** - Best for Google Workspace users\n\nFor visual pipeline management with strong reporting, Pipedrive and HubSpot are top choices.`,
      brand_mentioned: true,
      mention_position: 3,
      sentiment: "positive",
      context_snippet: "HubSpot Sales Hub - Great free tier, integrates with marketing",
    },
    {
      llm_name: "gemini",
      query: "best CRM software for small businesses",
      response: `**Best CRM Software for Small Businesses**\n\nHere are the top options organized by use case:\n\n**Best Overall:**\n- HubSpot CRM (free tier, easy to use)\n- Zoho CRM (affordable, feature-rich)\n\n**Best for Sales Teams:**\n- Pipedrive\n- Salesforce Essentials\n\n**Best for Marketing:**\n- HubSpot Marketing Hub\n- ActiveCampaign\n\n**Pricing Considerations:**\nHubSpot offers a completely free CRM with premium features available. Pipedrive starts at $12.50/user/month.\n\nKey features to look for: contact management, email integration, reporting, mobile access.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot CRM (free tier, easy to use) listed as Best Overall CRM for small businesses",
    },
    {
      llm_name: "gemini",
      query: "top marketing automation tools 2024",
      response: `**Marketing Automation Platforms - 2024 Overview**\n\n| Platform | Best For | Starting Price |\n|----------|----------|----------------|\n| HubSpot | All-in-one SMB | Free / $45/mo |\n| Marketo | Enterprise B2B | $895/mo |\n| Mailchimp | Email focus | Free / $13/mo |\n| ActiveCampaign | Email + CRM | $29/mo |\n| Pardot | Salesforce users | $1,250/mo |\n\n**Key Trend:** Platforms are integrating AI for predictive lead scoring and content personalization. HubSpot and ActiveCampaign lead in AI feature adoption for SMBs.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot listed first in comparison table for All-in-one SMB marketing automation",
    },
    {
      llm_name: "gemini",
      query: "CRM vs Salesforce comparison",
      response: `**CRM Platform Comparison: Salesforce vs Alternatives**\n\n**Salesforce**\n✓ Most complete feature set\n✓ Largest app ecosystem (AppExchange)\n✓ Best enterprise scalability\n✗ High cost and complexity\n✗ Steep learning curve\n\n**Key Competitors:**\n- Microsoft Dynamics 365 (ERP integration)\n- Oracle CX Cloud (large enterprises)\n- SAP CRM (manufacturing focus)\n- Zoho (budget-friendly)\n\nNote: HubSpot is often compared favorably to Salesforce for growing SMBs as a more accessible alternative with strong marketing capabilities.`,
      brand_mentioned: true,
      mention_position: 4,
      sentiment: "neutral",
      context_snippet: "HubSpot is often compared favorably to Salesforce for growing SMBs as a more accessible alternative",
    },
    {
      llm_name: "gemini",
      query: "how to automate email marketing campaigns",
      response: `**Email Marketing Automation Guide**\n\n**Step 1: Choose Your Platform**\n- Mailchimp (beginner-friendly)\n- Klaviyo (e-commerce)\n- HubSpot (B2B with CRM)\n- ActiveCampaign (advanced automations)\n\n**Step 2: Build Your Automation Workflows**\n1. Welcome series (3-5 emails)\n2. Lead nurturing sequences\n3. Behavioral triggers (page visits, downloads)\n4. Re-engagement campaigns\n\n**Step 3: Segment and Personalize**\nUse demographic and behavioral data to segment.\n\n**Key Metrics:** Open rate, click rate, conversion rate, unsubscribe rate.`,
      brand_mentioned: true,
      mention_position: 3,
      sentiment: "neutral",
      context_snippet: "HubSpot (B2B with CRM) listed as a platform choice for email marketing automation",
    },
    {
      llm_name: "gemini",
      query: "best tools for inbound marketing",
      response: `**Inbound Marketing Tool Stack**\n\n**Content & SEO:**\n- HubSpot CMS Hub\n- SEMrush / Ahrefs\n- WordPress + Yoast\n\n**Lead Generation:**\n- HubSpot Forms\n- Unbounce (landing pages)\n- OptinMonster\n\n**Email Marketing:**\n- HubSpot Email\n- Mailchimp\n\n**Analytics:**\n- Google Analytics 4\n- HubSpot Analytics\n\nHubSpot coined the term "inbound marketing" and its platform is purpose-built around this methodology.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot coined the term 'inbound marketing' and its platform is purpose-built around this methodology",
    },
    {
      llm_name: "gemini",
      query: "sales pipeline management software",
      response: `**Sales Pipeline Management Tools**\n\n**Visual Pipeline Focus:**\n- Pipedrive (best visual kanban pipeline)\n- Monday.com Sales CRM\n\n**Full CRM with Pipeline:**\n- Salesforce (enterprise)\n- Microsoft Dynamics\n- Zoho CRM\n\n**SMB Friendly:**\n- HubSpot Sales Hub (free tier available)\n- Close CRM\n- Freshsales\n\nFor teams that need pipeline visibility with minimal setup, Pipedrive and HubSpot are most recommended.`,
      brand_mentioned: true,
      mention_position: 4,
      sentiment: "positive",
      context_snippet: "HubSpot Sales Hub (free tier available) listed under SMB Friendly options",
    },
    {
      llm_name: "perplexity",
      query: "best CRM software for small businesses",
      response: `Based on recent reviews and market data, the top CRM platforms for small businesses are:\n\n**#1 HubSpot CRM** — Most recommended for SMBs in 2024. Rated 4.4/5 on G2 with 11,000+ reviews. Free tier supports unlimited users and contacts.\n\n**#2 Salesforce Starter** — $25/user/month. Best for teams planning to scale to enterprise.\n\n**#3 Zoho CRM** — Starting at $14/user/month. Strong automation at lower price point.\n\n**#4 Pipedrive** — $12.50/user/month. Highest-rated for sales pipeline visualization.\n\n**Market stats:** CRM software market is $65B globally, growing at 13% CAGR. 91% of companies with 10+ employees use a CRM.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot CRM - Most recommended for SMBs in 2024. Rated 4.4/5 on G2 with 11,000+ reviews",
    },
    {
      llm_name: "perplexity",
      query: "top marketing automation tools 2024",
      response: `According to recent market analysis and user reviews:\n\n**Enterprise Tier:**\n- Salesforce Marketing Cloud (market share: 21%)\n- Adobe Marketo (market share: 14%)\n- Oracle Eloqua (market share: 8%)\n\n**Mid-Market:**\n- HubSpot Marketing Hub (market share: 17%, fastest growing)\n- Mailchimp (market share: 12%)\n\n**Key 2024 trends:** AI-powered content generation, predictive lead scoring, and omnichannel orchestration are differentiating features.\n\nHubSpot reported 64,000+ customers as of Q3 2024, with 33% YoY growth in enterprise segment.`,
      brand_mentioned: true,
      mention_position: 2,
      sentiment: "positive",
      context_snippet: "HubSpot Marketing Hub (market share: 17%, fastest growing). HubSpot reported 64,000+ customers",
    },
    {
      llm_name: "perplexity",
      query: "CRM vs Salesforce comparison",
      response: `**Salesforce Alternatives Analysis (2024 Data)**\n\nSalesforce maintains 19.5% CRM market share (Gartner 2024).\n\n**Closest competitors:**\n- Microsoft Dynamics 365: 5.7% share\n- Oracle CX: 5.1% share\n- SAP: 3.1% share\n- Zoho: 2.8% share\n\nFor SMBs looking to avoid Salesforce complexity:\n- HubSpot: 76% user satisfaction vs Salesforce's 81%\n- Lower TCO: HubSpot averages 60% lower implementation cost\n- Faster time-to-value: avg 3 months vs 6+ months for Salesforce\n\nSource: Forrester Wave CRM 2024, G2 Winter Reports.`,
      brand_mentioned: true,
      mention_position: 3,
      sentiment: "positive",
      context_snippet: "HubSpot: 76% user satisfaction. Lower TCO: HubSpot averages 60% lower implementation cost",
    },
    {
      llm_name: "perplexity",
      query: "how to automate email marketing campaigns",
      response: `**Email Automation Best Practices & Tools**\n\nTop platforms by category:\n\n**E-commerce:** Klaviyo (43% of Shopify stores), Drip\n**B2B:** Marketo, Pardot, HubSpot\n**General:** Mailchimp, ActiveCampaign, Brevo\n\n**Essential automation flows:**\n1. Welcome series: 26% higher open rates than standard emails\n2. Abandoned cart: recovers 15% of lost sales on average\n3. Behavioral triggers: 2-3x higher engagement than batch sends\n\n**2024 benchmark:** Average email open rate is 21.5%, click rate 2.9%.`,
      brand_mentioned: true,
      mention_position: 3,
      sentiment: "neutral",
      context_snippet: "B2B email automation tools listed: Marketo, Pardot, HubSpot",
    },
    {
      llm_name: "perplexity",
      query: "best tools for inbound marketing",
      response: `**Inbound Marketing Platform Rankings (2024)**\n\nBased on G2 ratings, market share, and user reviews:\n\n1. **HubSpot** — Score: 4.4/5. Invented the inbound marketing category. Used by 194,000+ companies globally.\n2. **SEMrush** — Score: 4.5/5. Leading SEO and content tool.\n3. **Ahrefs** — Score: 4.6/5. Best for backlink analysis.\n4. **Moz** — Score: 4.3/5. SEO-focused platform.\n5. **Drift** — Score: 4.4/5. Conversational marketing.\n\nHubSpot dominates inbound marketing software with 40%+ category market share.`,
      brand_mentioned: true,
      mention_position: 1,
      sentiment: "positive",
      context_snippet: "HubSpot — Score: 4.4/5. Invented the inbound marketing category. Used by 194,000+ companies globally",
    },
    {
      llm_name: "perplexity",
      query: "sales pipeline management software",
      response: `**Sales Pipeline Software - Market Overview**\n\n**G2 Top Rated 2024:**\n1. Salesforce Sales Cloud — 4.3/5 (18,000+ reviews)\n2. Pipedrive — 4.3/5 (11,000+ reviews)\n3. HubSpot Sales Hub — 4.4/5 (11,000+ reviews)\n4. Monday.com CRM — 4.6/5 (8,000+ reviews)\n5. Close — 4.6/5 (6,000+ reviews)\n\n**Pricing range:** $0 (HubSpot free) to $300+/user/month (Salesforce Enterprise)\n\nPipedrive leads for visual pipeline management; HubSpot wins on marketing + sales integration.`,
      brand_mentioned: true,
      mention_position: 3,
      sentiment: "positive",
      context_snippet: "HubSpot Sales Hub — 4.4/5 (11,000+ reviews). HubSpot free tier available. HubSpot wins on marketing + sales integration",
    },
  ],
  competitors: [
    { name: "Salesforce", mention_count: 14, avg_position: 1.8, llms_present: ["chatgpt", "gemini", "perplexity"] },
    { name: "Pipedrive", mention_count: 11, avg_position: 2.4, llms_present: ["chatgpt", "gemini", "perplexity"] },
    { name: "Mailchimp", mention_count: 9, avg_position: 3.1, llms_present: ["chatgpt", "gemini", "perplexity"] },
    { name: "ActiveCampaign", mention_count: 8, avg_position: 3.8, llms_present: ["chatgpt", "gemini", "perplexity"] },
    { name: "Zoho", mention_count: 7, avg_position: 3.5, llms_present: ["chatgpt", "gemini", "perplexity"] },
    { name: "Marketo", mention_count: 6, avg_position: 2.5, llms_present: ["chatgpt", "gemini", "perplexity"] },
    { name: "Klaviyo", mention_count: 4, avg_position: 2.2, llms_present: ["chatgpt", "perplexity"] },
    { name: "SEMrush", mention_count: 3, avg_position: 2.0, llms_present: ["gemini", "perplexity"] },
  ],
  recommendations: [
    {
      category: "content",
      priority: "high",
      title: "Create more comparison content targeting Salesforce keywords",
      description: "Salesforce appears in 14/18 responses vs HubSpot's 16/18. Create dedicated 'HubSpot vs Salesforce' landing pages and blog posts. AI assistants heavily cite comparison content when answering 'vs' queries, which represent 20%+ of CRM-related questions.",
      impact_score: 9,
    },
    {
      category: "authority",
      priority: "high",
      title: "Increase G2 and Capterra review volume",
      description: "Perplexity and Gemini cited review platform ratings in 4/6 queries. HubSpot currently has 11,000 G2 reviews vs Salesforce's 18,000. Running a customer review campaign to close this gap would increase citation frequency in data-driven LLM responses.",
      impact_score: 8,
    },
    {
      category: "content",
      priority: "high",
      title: "Publish quarterly 'State of CRM' research reports",
      description: "Perplexity cited market share data and statistics in 5/6 responses. Publishing original research (survey of 1,000+ CRM users, market size data) creates citable statistics that AI assistants prefer to reference, increasing brand mentions in factual responses.",
      impact_score: 8,
    },
    {
      category: "technical",
      priority: "medium",
      title: "Implement FAQ schema on all comparison pages",
      description: "Add structured FAQ schema markup to 'HubSpot vs X' comparison pages and pricing pages. AI assistants extract FAQ content to directly answer user questions, and schema markup signals content relevance to these systems.",
      impact_score: 7,
    },
    {
      category: "presence",
      priority: "medium",
      title: "Expand Wikipedia and Wikidata presence",
      description: "HubSpot's Wikipedia article lacks detail on product categories and market position. Expanding the article with sourced statistics and ensuring Wikidata entries are complete would improve factual citation accuracy across all AI assistants.",
      impact_score: 7,
    },
    {
      category: "content",
      priority: "medium",
      title: "Target 'email automation' queries where brand is missing",
      description: "HubSpot was not mentioned in 'how to automate email marketing' queries by ChatGPT (email-specific tools like Mailchimp dominated). Publishing a dedicated HubSpot Email Automation guide with concrete tutorials would help capture these queries.",
      impact_score: 6,
    },
    {
      category: "presence",
      priority: "low",
      title: "Get listed on more industry analyst reports",
      description: "Perplexity cited Gartner, Forrester, and G2 data in responses. Ensuring HubSpot is featured in Gartner Magic Quadrant, Forrester Wave, and IDC reports creates high-authority citations that AI assistants frequently reference.",
      impact_score: 6,
    },
  ],
};

export function getDemoData(domain: string): DemoAnalysis | null {
  if (domain === "hubspot.com") return HUBSPOT_DEMO;
  return null;
}
