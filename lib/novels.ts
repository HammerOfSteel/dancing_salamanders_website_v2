import fs from "fs";
import path from "path";

export interface NovelMeta {
  slug: string;
  title: string;
  year?: number;
  collection: string;
  collectionSlug: string;
  excerpt?: string;
  coverImage?: string;
  audiobookSrc?: string;
  wordCount: number;
  pageCount: number;
}

const NOVELS_DIR = path.join(process.cwd(), "content", "books", "novels");
const WORDS_PER_PAGE = 500;

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Split raw prose into pages by word count. Returns array of paragraph arrays. */
export function splitIntoPages(content: string): string[][] {
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pages: string[][] = [];
  let current: string[] = [];
  let wordTotal = 0;

  for (const para of paragraphs) {
    const w = countWords(para);
    // Allow one extra paragraph to avoid tiny orphan pages
    if (wordTotal + w > WORDS_PER_PAGE && current.length >= 3) {
      pages.push(current);
      current = [para];
      wordTotal = w;
    } else {
      current.push(para);
      wordTotal += w;
    }
  }
  if (current.length > 0) pages.push(current);
  return pages;
}

function loadNovel(
  collectionSlug: string,
  slug: string
): { meta: NovelMeta; pages: string[][] } | null {
  const novelDir = path.join(NOVELS_DIR, collectionSlug, slug);
  const mainPath = path.join(novelDir, "main.md");
  const metaPath = path.join(novelDir, "meta.json");

  if (!fs.existsSync(mainPath)) return null;

  const content = fs.readFileSync(mainPath, "utf-8");
  const rawMeta = fs.existsSync(metaPath)
    ? (JSON.parse(fs.readFileSync(metaPath, "utf-8")) as Record<string, unknown>)
    : {};

  const pages = splitIntoPages(content);
  const wordCount = countWords(content);

  // Check for cover image in public/images/books/novels/[slug]/
  const coverExts = ["cover.webp", "cover.jpg", "cover.png"];
  const publicCoverDir = path.join(process.cwd(), "public", "images", "books", "novels", slug);
  const foundCover = coverExts.find((f) =>
    fs.existsSync(path.join(publicCoverDir, f))
  );

  // Check for audiobook in public/audiobooks/novels/[slug]/
  const audiobookPath = path.join(process.cwd(), "public", "audiobooks", "novels", slug, "audiobook.mp3");
  const hasAudiobook = fs.existsSync(audiobookPath);

  const meta: NovelMeta = {
    slug,
    title: typeof rawMeta.title === "string" ? rawMeta.title : slugToTitle(slug),
    year: typeof rawMeta.year === "number" ? rawMeta.year : undefined,
    collection: typeof rawMeta.collection === "string" ? rawMeta.collection : slugToTitle(collectionSlug),
    collectionSlug,
    excerpt: typeof rawMeta.excerpt === "string" ? rawMeta.excerpt : undefined,
    coverImage: foundCover ? `/images/books/novels/${slug}/${foundCover}` : undefined,
    audiobookSrc: hasAudiobook ? `/audiobooks/novels/${slug}/audiobook.mp3` : undefined,
    wordCount,
    pageCount: pages.length,
  };

  return { meta, pages };
}

export function getAllNovels(): NovelMeta[] {
  if (!fs.existsSync(NOVELS_DIR)) return [];
  const results: NovelMeta[] = [];

  for (const collection of fs.readdirSync(NOVELS_DIR)) {
    const collectionDir = path.join(NOVELS_DIR, collection);
    if (!fs.statSync(collectionDir).isDirectory()) continue;

    for (const slug of fs.readdirSync(collectionDir)) {
      const novelDir = path.join(collectionDir, slug);
      if (!fs.statSync(novelDir).isDirectory()) continue;
      const loaded = loadNovel(collection, slug);
      if (loaded) results.push(loaded.meta);
    }
  }

  return results;
}

export function getNovelBySlug(
  slug: string
): { meta: NovelMeta; pages: string[][] } | null {
  if (!fs.existsSync(NOVELS_DIR)) return null;

  for (const collection of fs.readdirSync(NOVELS_DIR)) {
    const collectionDir = path.join(NOVELS_DIR, collection);
    if (!fs.statSync(collectionDir).isDirectory()) continue;

    const result = loadNovel(collection, slug);
    if (result) return result;
  }

  return null;
}
