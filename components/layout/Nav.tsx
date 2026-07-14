"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/blog", label: "Blog" },
  { href: "/books", label: "Books" },
  { href: "/games", label: "Games" },
  { href: "/about", label: "About" },
];

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative text-sm font-medium tracking-wide transition-colors duration-200",
        "after:absolute after:bottom-[-3px] after:left-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300",
        isActive
          ? "text-primary after:w-full"
          : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
      )}
    >
      {label}
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="text-primary">🦎</span>
          <span>Dancing Salamanders</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 bg-card border-border pt-12"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col gap-2 px-2">
              <p className="mb-4 font-serif text-xs uppercase tracking-widest text-muted-foreground px-3">
                Navigation
              </p>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 border-t border-border pt-6 flex gap-4 px-3">
                <a
                  href="https://soundcloud.com/dancingsalamanders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  SoundCloud
                </a>
                <a
                  href="https://open.spotify.com/artist/1KGvM7M0K9mwqiKJiGBBst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Spotify
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
