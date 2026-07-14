"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavChild = { href: string; label: string };
type NavItem =
  | { href: string; label: string; children?: undefined }
  | { href: string; label: string; children: NavChild[] };

const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/blog", label: "Blog" },
  { href: "/books", label: "Books" },
  { href: "/games", label: "Games" },
  {
    href: "/resources",
    label: "Resources",
    children: [{ href: "/garden-of-memory", label: "Garden of Memory" }],
  },
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

function DropdownNavItem({ item }: { item: NavItem & { children: NavChild[] } }) {
  const pathname = usePathname();
  const isActive =
    pathname.startsWith(item.href) ||
    item.children.some((c) => pathname.startsWith(c.href));

  return (
    <div className="relative group">
      <div className="flex items-center gap-0.5">
        <NavLink href={item.href} label={item.label} />
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors mt-px" />
      </div>
      {/* Dropdown */}
      <div
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 rounded-md border border-border bg-background/95 backdrop-blur-sm shadow-lg",
          "opacity-0 invisible translate-y-1",
          "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0",
          "transition-all duration-200"
        )}
      >
        <div className="py-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block px-4 py-2 text-sm transition-colors",
                pathname.startsWith(child.href)
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
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
          {NAV_LINKS.map((link) =>
            link.children ? (
              <DropdownNavItem key={link.href} item={link as NavItem & { children: NavChild[] }} />
            ) : (
              <NavLink key={link.href} href={link.href} label={link.label} />
            )
          )}
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
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center rounded-md pl-7 pr-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        ↳ {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
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
