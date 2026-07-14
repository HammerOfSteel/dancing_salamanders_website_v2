import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllBooks, getBookBySlug } from "@/lib/books";
import { ExternalLink, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllBooks().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};
  return { title: book.title, description: book.excerpt };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 pb-6">
        <Link href="/books" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Books
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Cover */}
          {book.cover && (
            <div className="relative w-48 md:w-64 flex-shrink-0 self-start">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border shadow-xl">
                <Image src={book.cover} alt={book.title} fill className="object-cover" sizes="256px" />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            {book.format && (
              <Badge variant="secondary" className="mb-3 text-xs bg-muted text-muted-foreground">{book.format}</Badge>
            )}
            <h1 className="font-serif text-4xl font-semibold text-foreground leading-tight mb-2">{book.title}</h1>
            {book.year && <p className="text-sm text-muted-foreground mb-5">{book.year}</p>}

            {book.excerpt && (
              <p className="text-muted-foreground leading-relaxed mb-6 text-base max-w-prose">{book.excerpt}</p>
            )}

            {book.externalLink && (
              <a
                href={book.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "default", className: "gap-2" })}
              >
                <ExternalLink className="h-4 w-4" /> Read it
              </a>
            )}
          </div>
        </div>
      </div>

      {/* MDX content */}
      {book.content.trim() && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 prose-ds">
          <MDXRemote source={book.content} />
        </div>
      )}
    </div>
  );
}
