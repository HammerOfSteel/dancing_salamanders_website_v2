import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";
import { Badge } from "@/components/ui/badge";
import { getAllDevlogs, getAllGames } from "@/lib/games";
import { Calendar } from "lucide-react";

export const metadata = { title: "Games", description: "Game development devlogs for Seren and beyond." };

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function GamesPage() {
  const games = getAllGames();
  const devlogs = getAllDevlogs();

  return (
    <div className="pb-24">
      <PageHero title="Games" subtitle="Devlogs and updates on games in development." size="sm" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {devlogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No devlogs yet — add MDX files to content/games/</p>
        ) : (
          games.map((game) => {
            const gameLogs = devlogs.filter((d) => d.game === game);
            return (
              <section key={game} className="mb-14">
                <FadeInView>
                  <h2 className="font-serif text-2xl font-semibold text-foreground capitalize mb-6 flex items-center gap-3">
                    {game}
                    <span className="h-px flex-1 bg-border" />
                  </h2>
                </FadeInView>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {gameLogs.map((log, i) => (
                    <FadeInView key={log.slug} delay={i * 0.07}>
                      <Link
                        href={`/games/${log.slug}`}
                        className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:-translate-y-0.5 transition-all hover:shadow-lg hover:shadow-primary/10"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground border-none capitalize">{log.game}</Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />{formatDate(log.date)}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {log.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{log.excerpt}</p>
                        <p className="mt-4 text-xs font-medium text-primary group-hover:underline underline-offset-2">Read more →</p>
                      </Link>
                    </FadeInView>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
