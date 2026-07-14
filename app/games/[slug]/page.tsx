import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllDevlogs, getDevlogBySlug } from "@/lib/games";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllDevlogs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const log = getDevlogBySlug(slug);
  if (!log) return {};
  return { title: log.title, description: log.excerpt };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function DevlogPage({ params }: Props) {
  const { slug } = await params;
  const log = getDevlogBySlug(slug);
  if (!log) notFound();

  const all = getAllDevlogs();
  const idx = all.findIndex((d) => d.slug === slug);
  const prev = all[idx + 1] ?? null;
  const next = all[idx - 1] ?? null;

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 pb-10">
        <Link href="/games" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> All Devlogs
        </Link>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground capitalize">{log.game}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{formatDate(log.date)}</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground leading-tight mb-5">{log.title}</h1>
        <div className="h-px w-16 bg-primary/60" />
      </div>

      <Separator className="bg-border" />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose-ds">
        <MDXRemote source={log.content} />
      </article>

      <Separator className="bg-border max-w-3xl mx-auto" />

      <nav className="mx-auto max-w-3xl px-4 sm:px-6 pt-10">
        <div className="flex items-stretch justify-between gap-4">
          {prev ? (
            <Link href={`/games/${prev.slug}`} className="group flex-1 rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-all">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><ArrowLeft className="h-3 w-3" /> Previous</p>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">{prev.title}</p>
            </Link>
          ) : <div className="flex-1" />}
          {next ? (
            <Link href={`/games/${next.slug}`} className="group flex-1 rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-all text-right">
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mb-2">Next <ArrowRight className="h-3 w-3" /></p>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">{next.title}</p>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </nav>
    </div>
  );
}
