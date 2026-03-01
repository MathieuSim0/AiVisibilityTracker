import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 mb-6">
            GEO Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {t("title_highlight")}
            </span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/20 p-8 md:p-10 hover:border-blue-500/40 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium">
                  {t("featured")}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/8 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs">
                  {featured.category}
                </span>
                <span className="text-gray-500 dark:text-gray-600 text-xs">{featured.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4 max-w-2xl">{featured.excerpt}</p>
              <span className="text-blue-500 dark:text-blue-400 text-sm font-medium group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors">
                {t("read_more")}
              </span>
            </div>
          </div>
        </Link>

        {/* Articles grid */}
        <div className="mb-4 text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t("latest")}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col p-6 rounded-xl bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/12 dark:hover:border-white/12 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-md bg-black/8 dark:bg-white/8 text-gray-500 text-xs">
                  {post.category}
                </span>
                <span className="text-gray-400 dark:text-gray-700 text-xs">{post.readTime}</span>
              </div>
              <h3 className="font-bold text-foreground mb-2 text-sm leading-snug group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors flex-1">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-700">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="text-blue-500 text-xs group-hover:text-blue-400 transition-colors">
                  {t("read_more")}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8">
          <h3 className="text-xl font-bold mb-2 text-foreground">{t("newsletter_title")}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
            {t("newsletter_subtitle")}
          </p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder={t("newsletter_placeholder")}
              disabled
              className="flex-1 px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-foreground placeholder-gray-400 dark:placeholder-gray-700 text-sm"
            />
            <button disabled className="px-5 py-2.5 bg-blue-600/50 rounded-xl text-sm font-medium text-gray-300 cursor-not-allowed">
              {t("newsletter_cta")}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-700 mt-3">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
