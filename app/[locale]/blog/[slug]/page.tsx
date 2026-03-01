import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, BLOG_POSTS } from "@/lib/blog-posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/blog" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-400">{post.category}</span>
        </nav>

        {/* Post header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-500 dark:text-blue-400 text-xs font-medium">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.readTime}</span>
            <span className="text-gray-400 dark:text-gray-700 text-sm">
              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{post.excerpt}</p>
        </header>

        {/* Article content */}
        <article className="prose-custom">
          {post.content.trim().split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-foreground">{line.replace("## ", "")}</h2>;
            }
            if (line.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-semibold mt-6 mb-3 text-blue-500 dark:text-blue-300">{line.replace("### ", "")}</h3>;
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} className="text-gray-600 dark:text-gray-300 text-base leading-relaxed ml-4 list-disc mb-1">
                  <span dangerouslySetInnerHTML={{ __html: line.replace("- ", "").replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                </li>
              );
            }
            if (/^\d+\. /.test(line)) {
              return (
                <li key={i} className="text-gray-600 dark:text-gray-300 text-base leading-relaxed ml-4 list-decimal mb-1">
                  <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\. /, "").replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                </li>
              );
            }
            if (line.startsWith("---")) {
              return <hr key={i} className="border-black/10 dark:border-white/10 my-8" />;
            }
            if (line.trim() === "") {
              return <div key={i} className="h-2" />;
            }
            return (
              <p key={i} className="text-gray-500 dark:text-gray-400 leading-relaxed text-base">
                <span dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em class="text-gray-600 dark:text-gray-300">$1</em>')
                    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/8 dark:bg-white/10 text-blue-600 dark:text-blue-300 text-sm font-mono">$1</code>')
                }}
                />
              </p>
            );
          })}
        </article>

        {/* CTA box */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20 text-center">
          <h3 className="font-bold text-lg mb-2 text-foreground">Check your AI visibility score — free</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
            See how your brand performs in ChatGPT, Gemini, and Perplexity right now.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/20"
          >
            Analyze my domain →
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold mb-5 text-foreground">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="p-5 rounded-xl bg-black/3 dark:bg-white/3 border border-black/8 dark:border-white/8 hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                >
                  <span className="text-xs text-gray-400 dark:text-gray-600 mb-2 block">{p.category} · {p.readTime}</span>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors leading-snug">
                    {p.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
