import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BlogCategoryMeta } from "@/lib/blog";

interface CategoryCardProps {
  category: BlogCategoryMeta;
  active?: boolean;
}

export function CategoryCard({ category, active = false }: CategoryCardProps) {
  return (
    <Link
      href={active ? "/blog" : `/blog?category=${category.id}`}
      className={cn(
        "group relative block h-48 sm:h-56 overflow-hidden rounded-xl border",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10",
        active ? "border-primary" : "border-border hover:border-primary/40"
      )}
    >
      <Image
        src={category.image}
        alt=""
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(min-width: 640px) 33vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white leading-snug">
          {category.title}
        </h3>
        <p className="mt-1 text-sm text-white/80 leading-relaxed">{category.tagline}</p>
      </div>

      {active && (
        <span className="absolute top-3 right-3 z-10 rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
          Clear filter
        </span>
      )}
    </Link>
  );
}
