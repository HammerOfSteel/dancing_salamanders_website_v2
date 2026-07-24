import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";
import { getAllNovels, type NovelMeta } from "@/lib/novels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Novels, manga, and illustrated stories.",
};

function readMins(wordCount: number) {
  return Math.ceil(wordCount / 200);
}

function NovelCard({ novel, index }: { novel: NovelMeta; index: number }) {
  return (
    <FadeInView delay={index * 0.06}>
      <Link
        href={`/books/novels/${novel.slug}`}
        className="group flex flex-col h-full rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 overflow-hidden"
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <span className="inline-block text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-sans">
            {novel.collection}
          </span>
          <h3 className="font-serif text-xl font-semibold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors duration-200">
            {novel.title}
          </h3>
          {novel.excerpt && (
            <p className="font-serif text-sm italic text-muted-foreground leading-relaxed mb-4 flex-1">
              {novel.excerpt}
            </p>
          )}
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/50">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">{novel.wordCount.toLocaleString()} words</p>
              <p className="text-xs text-muted-foreground">~{readMins(novel.wordCount)} min · {novel.pageCount} pages</p>
            </div>
            <span className="text-xs font-sans tracking-wider uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Begin reading →
            </span>
          </div>
        </div>
      </Link>
    </FadeInView>
  );
}

export default function BooksPage() {
  const novels = getAllNovels();

  return (
    <div className="pb-24">
      <PageHero title="Books" subtitle="Novels, manga, and illustrated stories." size="sm" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 space-y-20">

        {/* Stars & Seas */}
        <section>
          <FadeInView>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-primary/60 text-xs tracking-widest uppercase font-sans">Collection</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Stars &amp; Seas</h2>
              <p className="mt-2 text-muted-foreground font-serif italic text-base max-w-xl">
                A series of interconnected stories about family, belonging, and the small distances between people.
              </p>
            </div>
          </FadeInView>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {novels.map((novel, i) => (
              <NovelCard key={novel.slug} novel={novel} index={i} />
            ))}
          </div>
        </section>

        {/* Manga */}
        <section>
          <FadeInView>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-primary/60 text-xs tracking-widest uppercase font-sans">Manga</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Illustrated Stories</h2>
            </div>
          </FadeInView>
          <FadeInView delay={0.1}>
            <Link
              href="/books/manga/foxes-in-the-garden"
              className="group flex flex-col sm:flex-row rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 overflow-hidden max-w-2xl"
            >
              <div className="relative sm:w-32 w-full h-40 sm:h-auto bg-muted/50 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/manga/foxes-in-the-garden/main.png"
                  alt="Foxes in the Garden preview"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                <span className="inline-block text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-sans">
                  Manga · Webtoon
                </span>
                <h3 className="font-serif text-xl font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors duration-200">
                  Foxes in the Garden
                </h3>
                <p className="font-serif text-sm italic text-muted-foreground leading-relaxed mb-4">
                  A vertical webtoon. Scroll to read — zoom in and out to your comfort.
                </p>
                <span className="mt-auto text-xs font-sans tracking-wider uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Read webtoon →
                </span>
              </div>
            </Link>
          </FadeInView>
        </section>

        {/* Children's Books */}
        <section>
          <FadeInView>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-primary/60 text-xs tracking-widest uppercase font-sans">Children&apos;s Books</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Little Stories</h2>
            </div>
          </FadeInView>
          <FadeInView delay={0.1}>
            <div className="relative rounded-2xl border border-dashed border-border bg-card/50 p-8 max-w-sm overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-border/20 text-8xl font-serif select-none">✦</span>
              </div>
              <div className="relative z-10">
                <span className="inline-block text-[10px] tracking-widest uppercase text-muted-foreground mb-3 font-sans">
                  In development
                </span>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Bloom on the Moon</h3>
                <p className="font-serif text-sm italic text-muted-foreground leading-relaxed">
                  An illustrated children&apos;s book. Coming soon.
                </p>
              </div>
            </div>
          </FadeInView>
        </section>

      </div>
    </div>
  );
}

