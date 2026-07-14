import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BookFrontmatter {
  title: string;
  year?: number;
  format?: string; // "poetry" | "prose" | "picture book"
  excerpt?: string;
  cover?: string;
  externalLink?: string;
}

export interface Book extends BookFrontmatter {
  slug: string;
  content: string;
}

const BOOKS_DIR = path.join(process.cwd(), "content", "books");

export function getAllBooks(): Book[] {
  if (!fs.existsSync(BOOKS_DIR)) return [];
  return fs
    .readdirSync(BOOKS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, "");
      const raw = fs.readFileSync(path.join(BOOKS_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return { slug, content, ...(data as BookFrontmatter) };
    })
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function getBookBySlug(slug: string): Book | null {
  const fileMdx = path.join(BOOKS_DIR, `${slug}.mdx`);
  const fileMd = path.join(BOOKS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(fileMdx) ? fileMdx : fs.existsSync(fileMd) ? fileMd : null;
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, content, ...(data as BookFrontmatter) };
}
