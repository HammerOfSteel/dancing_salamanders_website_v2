import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";
import { Badge } from "@/components/ui/badge";
import { getAllDevlogs, getAllGames } from "@/lib/games";
import { Calendar } from "lucide-react";
import GamesFilteredList from "@/components/games/GamesFilteredList";

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
          <GamesFilteredList devlogs={devlogs} games={games} />
        )}
      </div>
    </div>
  );
}
