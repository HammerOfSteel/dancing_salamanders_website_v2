import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { FadeInView } from "@/components/shared/FadeInView";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getAllTags } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Writing about grief, hope, music, memory and community.",
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = use(searchParams);
  const allPosts = getAllPosts();
  const tags = getAllTags();
  const posts = tag ? allPosts.filter((p) => p.tags?.includes(tag)) : allPosts;

  return (
    <div className="pb-24">
      <PageHero
        title="Blog"
        subtitle="Writing about grief, hope, music, memory and community."
        size="sm"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {/* Tag filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link href="/blog">
              <Badge
                variant={!tag ? "default" : "secondary"}
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                All
              </Badge>
            </Link>
            {tags.map((t) => (
              <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
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

        {/* Post grid */}
        {posts.length === 0 ? (
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
