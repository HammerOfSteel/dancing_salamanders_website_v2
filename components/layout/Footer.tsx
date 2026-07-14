import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { href: "/music", label: "Music" },
  { href: "/blog", label: "Blog" },
  { href: "/books", label: "Books" },
  { href: "/games", label: "Games" },
  { href: "/about", label: "About" },
];

const SOCIAL_LINKS = [
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/dancingsalamanders",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/1KGvM7M0K9mwqiKJiGBBst",
  },
  {
    label: "Livslusth",
    href: "https://www.livslusths.se/",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="sm:col-span-1">
            <p className="font-serif text-xl font-semibold text-foreground mb-2">
              Dancing Salamanders
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              Illuminating Hope<br />Through Connection
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">
              Pages
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / External */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">
              Find Us
            </p>
            <ul className="space-y-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-border mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {year} Dancing Salamanders. All rights reserved.</p>
          <p>
            Made with care — built on{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
