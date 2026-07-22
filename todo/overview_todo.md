# Dancing Salamanders V2 — Roadmap Overview & Working Index

> The roadmap used to live in one `todo.md` with every phase unchecked, which no
> longer matched reality — a lot has actually been built. This reorg splits the plan
> per phase **and** reconciles it against the real codebase, so the checkboxes mean
> something again.

---

## ▶ Where we are right now

Most of the core site is built: blog, books, games (devlogs), music player, and the
about/contact page. The **home page already matches the live site** — its simplicity
is intentional, not a gap (see Phase 7). The biggest real gaps are **SEO/sitemap
files** (missing entirely) and **no real music content yet** (folder convention is
there, but no albums/mp3s dropped in). There are also two pages that were built but
never documented in any plan — see Phase 12.

- ✅ [Phase 1 — Foundation](phase-01-foundation.md)
- ✅ [Phase 2 — Design System & Layout](phase-02-design-system-layout.md) (a couple of
  planned shared components not found — verify)
- ✅ [Phase 3 — Music System](phase-03-music-system.md) (scanner/player built, no
  tests, no real content yet)
- ✅ [Phase 4 — Blog System](phase-04-blog-system.md)
- ✅ [Phase 5 — Books Page](phase-05-books-page.md)
- ✅ [Phase 6 — Games Page](phase-06-games-page.md)
- ⚠️ **[Phase 7 — Home Page](phase-07-home-page.md)** — matches the live site
  (hero + mission blurb); optional enhancement ideas listed but not gaps
- ✅ [Phase 8 — About Page](phase-08-about-page.md)
- ❌ **[Phase 9 — Polish, Accessibility & SEO](phase-09-polish-accessibility-seo.md)**
  — not started; `sitemap.ts`/`robots.ts`/`manifest.ts` don't exist yet
- ⚠️ [Phase 10 — Docker & Deployment](phase-10-docker-deployment.md) — scaffolding
  exists, not re-verified end-to-end
- ⚠️ [Phase 11 — Content & Launch](phase-11-content-launch.md) — written content
  migrated, no real music yet, not launched
- ⭐ **[Phase 12 — Undocumented Existing Features](phase-12-undocumented-features.md)**
  *(new)* — `garden-of-memory` (memorial gallery) and `resources` (grief/crisis
  helplines) pages exist in the code but were never in any plan
- [Backlog / Future Ideas](backlog.md)

**Suggested next focus:** Phase 9 (SEO files are quick wins and currently zero) and
Phase 12 (the resources page has safety-critical content — helpline accuracy — that
shouldn't sit undocumented), then Phase 11 (drop in real music content) before launch.

---

## What was added during this reorg (beyond splitting the file)

- **Phase 12** — two real, shipped pages (`garden-of-memory`, `resources`) had no
  todo/plan entry at all. The resources page in particular needs a safety-critical
  accuracy check on crisis helpline info and is missing a Swedish helpline given the
  artist's background and the livslusths.se partnership.
- Every phase's checkboxes were **reconciled against the actual `app/`, `components/`,
  `content/`, and `lib/` directories** rather than left as originally written (the old
  file had zero boxes checked despite most features already existing).

## Related docs

- [README.md](../README.md) — tech stack, running locally, adding content, deployment
- [dancingsalamanders_V1_architecture.md](../dancingsalamanders_V1_architecture.md) —
  V1 architecture reference
