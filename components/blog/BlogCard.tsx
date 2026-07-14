import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group block rounded-xl border border-border bg-card",
        "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
        "transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
      )}
    >
      <div className={cn("p-6", featured && "sm:p-8")}>
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px] bg-muted text-muted-foreground border-none"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className={cn(
            "font-serif font-semibold text-foreground leading-snug group-hover:text-primary transition-colors mb-3",
            featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
          )}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p
          className={cn(
            "text-muted-foreground leading-relaxed line-clamp-3 mb-4",
            featured ? "text-base" : "text-sm"
          )}
        >
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        </div>

        {/* CTA */}
        <p className="mt-4 text-xs font-medium text-primary group-hover:underline underline-offset-2 transition-all">
          Read more →
        </p>
      </div>
    </Link>
  );
}
