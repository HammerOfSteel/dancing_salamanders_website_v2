import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";
import { Separator } from "@/components/ui/separator";
import { Heart, Music, BookOpen } from "lucide-react";

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const recent = posts.filter((p) => p.slug !== featured?.slug).slice(0, 3);

  return (
    <div className="pb-24">
      <PageHero
        title="Dancing Salamanders"
        subtitle="Echoes of Hope, Harmonies of Heart"
        size="full"
        align="center"
      />

      {/* Mission */}
      <FadeInView className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <Heart className="mx-auto mb-5 h-7 w-7 text-primary" />
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-5 leading-snug">
          Illuminating Hope<br />Through Connection
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
          We know from experience how overwhelming grief can feel, and how important it is to
          meet people who truly understand. Music becomes a bridge — to hope, to connection,
          and to each other.
        </p>
        <a
          href="https://www.livslusths.se/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
        >
          💛 Find support at Livslusth →
        </a>
      </FadeInView>

      <Separator className="bg-border max-w-6xl mx-auto" />

      {/* Featured post */}
      {featured && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <FadeInView>
            <p className="text-xs uppercase tracking-widest text-primary mb-4 font-medium">Featured</p>
            <BlogCard post={featured} featured />
          </FadeInView>
        </section>
      )}

      {/* Recent posts */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <FadeInView>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">Recent Writing</h2>
              <Link href="/blog" className="text-sm text-primary hover:underline underline-offset-2">All posts →</Link>
            </div>
          </FadeInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((post, i) => (
              <FadeInView key={post.slug} delay={i * 0.08}>
                <BlogCard post={post} />
              </FadeInView>
            ))}
          </div>
        </section>
      )}

      <Separator className="bg-border max-w-6xl mx-auto" />

      {/* Music & Books teasers */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeInView delay={0}>
            <div className="rounded-xl border border-border bg-card p-8 h-full flex flex-col">
              <Music className="mb-4 h-7 w-7 text-primary" />
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">Music</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                Acoustic guitar, violin, mandolin, cello, and flute — weaving stories that connect,
                inspire, and illuminate hope. All albums hosted right here.
              </p>
              <Link href="/music" className={buttonVariants({ variant: "outline", className: "border-border hover:border-primary w-fit" })}>Browse Albums →</Link>
            </div>
          </FadeInView>
          <FadeInView delay={0.1}>
            <div className="rounded-xl border border-border bg-card p-8 h-full flex flex-col">
              <BookOpen className="mb-4 h-7 w-7 text-primary" />
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">Books & Poetry</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                Words that hold the same intention as the music — stories that make space for memory,
                for grief, and for the quiet beauty that lives alongside both.
              </p>
              <Link href="/books" className={buttonVariants({ variant: "outline", className: "border-border hover:border-primary w-fit" })}>Explore Books →</Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Newsletter */}
      <FadeInView>
        <section className="mx-auto max-w-2xl px-4 sm:px-6 py-8 text-center">
          <p className="font-serif text-xl text-foreground mb-2">Stay in touch</p>
          <p className="text-sm text-muted-foreground mb-6">Sign up to receive news and updates.</p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 max-w-sm rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Subscribe
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">We respect your privacy.</p>
        </section>
      </FadeInView>
    </div>
  );
}
