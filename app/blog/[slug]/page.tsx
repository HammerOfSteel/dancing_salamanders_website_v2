import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prev = allPosts[idx + 1] ?? null;
  const next = allPosts[idx - 1] ?? null;

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 pb-10">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((t) => (
              <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  {t}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground leading-tight mb-5">
          {post.title}
        </h1>
        <div className="flex items-center gap-5 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(post.date)}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readingTime} min read</span>
        </div>
        <div className="h-px w-16 bg-primary/60" />
      </div>

      <Separator className="bg-border" />

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose-ds">
        <MDXRemote source={post.content} />
      </article>

      <Separator className="bg-border max-w-3xl mx-auto" />

      {/* Prev / Next */}
      <nav className="mx-auto max-w-3xl px-4 sm:px-6 pt-10">
        <div className="flex items-stretch justify-between gap-4">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex-1 rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-all"
            >
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <ArrowLeft className="h-3 w-3" /> Previous
              </p>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {prev.title}
              </p>
            </Link>
          ) : <div className="flex-1" />}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex-1 rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-all text-right"
            >
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mb-2">
                Next <ArrowRight className="h-3 w-3" />
              </p>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {next.title}
              </p>
            </Link>
          ) : <div className="flex-1" />}
        </div>

        <div className="mt-8 text-center">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← All posts
          </Link>
        </div>
      </nav>
    </div>
  );
}
