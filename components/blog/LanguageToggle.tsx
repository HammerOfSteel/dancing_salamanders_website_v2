"use client";

import { useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;      // English content (server-rendered)
  svSlot?: ReactNode;       // Swedish content (server-rendered), only present if translation exists
}

export function LanguageToggle({ children, svSlot }: Props) {
  const [lang, setLang] = useState<"en" | "sv">("en");

  if (!svSlot) return <>{children}</>;

  return (
    <>
      {/* Language switcher bar */}
      <div className="flex items-center gap-1 mb-10 p-1 rounded-lg bg-muted/40 border border-border w-fit">
        <button
          onClick={() => setLang("en")}
          aria-pressed={lang === "en"}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            lang === "en"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLang("sv")}
          aria-pressed={lang === "sv"}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            lang === "sv"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Svenska
        </button>
      </div>

      {/* Content — both rendered on server, visibility toggled client-side */}
      <div className={lang === "en" ? undefined : "hidden"}>{children}</div>
      <div className={lang === "sv" ? undefined : "hidden"}>{svSlot}</div>
    </>
  );
}
