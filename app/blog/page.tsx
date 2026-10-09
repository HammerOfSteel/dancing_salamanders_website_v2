import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryCard } from "@/components/blog/CategoryCard";
import { FadeInView } from "@/components/shared/FadeInView";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, BLOG_CATEGORIES, type BlogCategory } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Writing about grief, hope, music, memory and community.",
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; category?: string }>;
}) {
  const { tag, category } = use(searchParams);
  const allPosts = getAllPosts();
  const activeCategory = BLOG_CATEGORIES.find((c) => c.id === category);

  const categoryPosts = activeCategory
    ? allPosts.filter((p) => p.category === (activeCategory.id as BlogCategory))
    : [];
  const tags = Array.from(new Set(categoryPosts.flatMap((p) => p.tags ?? []))).sort();
  const posts = categoryPosts.filter((p) => !tag || p.tags?.includes(tag));

  const tagHref = (t?: string) => {
    const params = new URLSearchParams();
    if (t) params.set("tag", t);
    if (activeCategory) params.set("category", activeCategory.id);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <div className="pb-24">
      <PageHero
        title="Blog"
        subtitle="Writing about grief, hope, music, memory and community."
        size="sm"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {BLOG_CATEGORIES.map((c, i) => (
            <FadeInView key={c.id} delay={i * 0.06}>
              <CategoryCard category={c} active={activeCategory?.id === c.id} />
            </FadeInView>
          ))}
        </div>

        {/* Active category heading */}
        {activeCategory && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">{activeCategory.title}</h2>
            <Link href={tagHref(tag)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Clear category
            </Link>
          </div>
        )}

        {/* Tag filter, only shown once a category is picked */}
        {activeCategory && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link href={tagHref()}>
              <Badge
                variant={!tag ? "default" : "secondary"}
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                All
              </Badge>
            </Link>
            {tags.map((t) => (
              <Link key={t} href={tagHref(t)}>
                <Badge
                  variant={tag === t ? "default" : "secondary"}
                  className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {t}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Post grid, only shown once a category is picked */}
        {!activeCategory ? (
          <p className="text-muted-foreground text-center py-20">
            Choose a category above to browse its posts.
          </p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <FadeInView key={post.slug} delay={i * 0.06}>
                <BlogCard post={post} />
              </FadeInView>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Next.js 15 requires 'use' import for async searchParams
import { use } from "react";
