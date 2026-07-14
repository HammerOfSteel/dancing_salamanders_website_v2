import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";
import { Badge } from "@/components/ui/badge";
import { getAllBooks } from "@/lib/books";

export const metadata = { title: "Books", description: "Poetry, prose, and picture books." };

export default function BooksPage() {
  const books = getAllBooks();

  return (
    <div className="pb-24">
      <PageHero title="Books" subtitle="Poetry, prose, and picture books." size="sm" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {books.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No books yet — add MDX files to content/books/</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {books.map((book, i) => (
              <FadeInView key={book.slug} delay={i * 0.05}>
                <Link
                  href={`/books/${book.slug}`}
                  className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-xs px-3 text-center font-serif">{book.title}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-serif text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {book.year && <span className="text-xs text-muted-foreground">{book.year}</span>}
                      {book.format && (
                        <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground border-none">
                          {book.format}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </FadeInView>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
