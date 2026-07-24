import { notFound } from "next/navigation";
import MangaViewer from "@/components/books/MangaViewer";
import type { Metadata } from "next";

// Manga entries — each slug maps to a public image
const MANGA_ENTRIES: Record<string, { title: string; imagePath: string; width: number; height: number }> = {
  "foxes-in-the-garden": {
    title: "Foxes in the Garden",
    imagePath: "/manga/foxes-in-the-garden/main.png",
    width: 1794,
    height: 14220,
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(MANGA_ENTRIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = MANGA_ENTRIES[slug];
  if (!entry) return {};
  return { title: entry.title };
}

export default async function MangaPage({ params }: Props) {
  const { slug } = await params;
  const entry = MANGA_ENTRIES[slug];
  if (!entry) notFound();

  return (
    <MangaViewer
      imagePath={entry.imagePath}
      title={entry.title}
      naturalWidth={entry.width}
      naturalHeight={entry.height}
    />
  );
}
