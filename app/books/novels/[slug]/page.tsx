import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllNovels, getNovelBySlug } from "@/lib/novels";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return getAllNovels().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);
  if (!novel) return {};
  return {
    title: `${novel.meta.title} — ${novel.meta.collection}`,
    description: novel.meta.excerpt,
  };
}

export default async function NovelReaderPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const novel = getNovelBySlug(slug);
  if (!novel) notFound();

  const { meta, pages } = novel;
  const totalPages = pages.length;
  const rawPage = parseInt(sp.page ?? "1", 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage > totalPages ? totalPages : rawPage;
  const paragraphs = pages[currentPage - 1];

  const prevHref = currentPage > 1 ? `/books/novels/${slug}?page=${currentPage - 1}` : null;
  const nextHref = currentPage < totalPages ? `/books/novels/${slug}?page=${currentPage + 1}` : null;

  // Estimate reading time for the whole book
  const readMins = Math.ceil(meta.wordCount / 200);

  return (
    <div className="grimoire-outer">
      {/* Top nav */}
      <div className="grimoire-topbar">
        <Link href="/books" className="grimoire-back">
          ← Back to Books
        </Link>
        <span className="grimoire-collection">{meta.collection}</span>
      </div>

      {/* Page wrapper */}
      <div className="grimoire-page">
        {/* Title block — only on page 1 */}
        {currentPage === 1 && (
          <div className="grimoire-title-block">
            <div className="grimoire-ornament">✦ ✦ ✦</div>
            <h1 className="grimoire-title">{meta.title}</h1>
            {meta.year && <p className="grimoire-year">{meta.year}</p>}
            {meta.excerpt && (
              <p className="grimoire-title-excerpt">{meta.excerpt}</p>
            )}
            <div className="grimoire-stats">
              <span>{meta.wordCount.toLocaleString()} words</span>
              <span className="grimoire-dot">·</span>
              <span>~{readMins} min read</span>
              <span className="grimoire-dot">·</span>
              <span>{totalPages} pages</span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="grimoire-divider" aria-hidden="true">
          <span>❧</span>
        </div>

        {/* Prose content */}
        <article className="grimoire-prose">
          {paragraphs.map((para, i) => {
            // Skip section headers like "# Part One: ..."
            if (para.startsWith("#")) {
              const text = para.replace(/^#+\s*/, "");
              return (
                <h2 key={i} className="grimoire-section-heading">
                  {text}
                </h2>
              );
            }
            return (
              <p
                key={i}
                className={
                  i === 0 && currentPage === 1
                    ? "grimoire-para grimoire-dropcap"
                    : "grimoire-para"
                }
              >
                {para}
              </p>
            );
          })}
        </article>

        {/* Bottom divider */}
        <div className="grimoire-divider" aria-hidden="true">
          <span>❧</span>
        </div>

        {/* Page navigation */}
        <nav className="grimoire-nav" aria-label="Page navigation">
          <div className="grimoire-nav-prev">
            {prevHref ? (
              <Link href={prevHref} className="grimoire-nav-btn">
                ← Previous
              </Link>
            ) : (
              <span className="grimoire-nav-disabled">← Previous</span>
            )}
          </div>

          <div className="grimoire-page-num">
            Page {currentPage} of {totalPages}
          </div>

          <div className="grimoire-nav-next">
            {nextHref ? (
              <Link href={nextHref} className="grimoire-nav-btn">
                Next →
              </Link>
            ) : (
              <span className="grimoire-nav-disabled">Next →</span>
            )}
          </div>
        </nav>

        {/* Quick jump to end if many pages */}
        {totalPages > 5 && (
          <div className="grimoire-jump">
            {currentPage !== 1 && (
              <Link href={`/books/novels/${slug}?page=1`} className="grimoire-jump-link">
                First page
              </Link>
            )}
            {currentPage !== totalPages && (
              <Link href={`/books/novels/${slug}?page=${totalPages}`} className="grimoire-jump-link">
                Last page
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
