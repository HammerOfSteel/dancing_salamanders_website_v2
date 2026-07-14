import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface DevlogFrontmatter {
  title: string;
  game: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
}

export interface Devlog extends DevlogFrontmatter {
  slug: string;
  content: string;
}

const GAMES_DIR = path.join(process.cwd(), "content", "games");

export function getAllDevlogs(): Devlog[] {
  if (!fs.existsSync(GAMES_DIR)) return [];
  return fs
    .readdirSync(GAMES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, "");
      const raw = fs.readFileSync(path.join(GAMES_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return { slug, content, ...(data as DevlogFrontmatter) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDevlogBySlug(slug: string): Devlog | null {
  const fileMdx = path.join(GAMES_DIR, `${slug}.mdx`);
  const fileMd = path.join(GAMES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(fileMdx) ? fileMdx : fs.existsSync(fileMd) ? fileMd : null;
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, content, ...(data as DevlogFrontmatter) };
}

export function getDevlogsByGame(game: string): Devlog[] {
  return getAllDevlogs().filter((d) => d.game === game);
}

export function getAllGames(): string[] {
  return Array.from(new Set(getAllDevlogs().map((d) => d.game))).sort();
}
