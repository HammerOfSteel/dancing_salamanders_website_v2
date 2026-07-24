"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeInView } from "@/components/shared/FadeInView";
import { Calendar } from "lucide-react";
import type { Devlog } from "@/lib/games";

const GAME_LABELS: Record<string, string> = {
  Seren: "Seren",
  Bloom: "Bloom",
  TTT: "Tomes, Towers & Transmutation",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function GamesFilteredList({ devlogs, games }: { devlogs: Devlog[]; games: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? devlogs.filter((d) => d.game === active) : devlogs;

  return (
    <div>
      {/* Filter bar */}
      {games.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setActive(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase border transition-colors duration-150 ${
              active === null
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            }`}
          >
            All
          </button>
          {games.map((game) => (
            <button
              key={game}
              onClick={() => setActive(game === active ? null : game)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase border transition-colors duration-150 ${
                active === game
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {GAME_LABELS[game] ?? game}
            </button>
          ))}
        </div>
      )}

      {/* Devlog list */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No posts for this game yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((log, i) => (
            <FadeInView key={log.slug} delay={i * 0.06}>
              <Link
                href={`/games/${log.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-primary/8"
              >
                {/* Game + date */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-sans">
                    {GAME_LABELS[log.game] ?? log.game}
                  </span>
                  <span className="text-border/80">·</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                    <Calendar className="h-3 w-3 shrink-0" />
                    {formatDate(log.date)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-2 leading-snug">
                  {log.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                  {log.excerpt}
                </p>

                {/* Tags */}
                {log.tags && log.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {log.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-sans"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Read more →
                </p>
              </Link>
            </FadeInView>
          ))}
        </div>
      )}
    </div>
  );
}
