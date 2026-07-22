# Phase 2 — Design System & Layout Shell

**Status: mostly done.** Nav, Footer, layout shell, and the two shared building
blocks used across pages (`PageHero`, `FadeInView`) all exist and are used
throughout the site.

- [x] CSS custom properties for design tokens in `globals.css`
- [x] `components/layout/Nav.tsx` — responsive nav with links and social icons
- [x] `components/layout/Footer.tsx`
- [x] Root `app/layout.tsx` wraps every page with `<Nav>` / `<Footer>`
- [x] `components/shared/PageHero.tsx`
- [x] `components/shared/FadeInView.tsx`
- [ ] `components/shared/SectionHeading.tsx` — **not found in the codebase**; pages
      currently use plain `<h2>` elements directly instead of a shared component
- [ ] Page transition animation between routes (Framer Motion `AnimatePresence`) —
      not confirmed in `app/layout.tsx`; verify and add if missing
- [ ] Responsive check at 320px / 768px / 1280px+ — not verified during this reorg
- [ ] Lighthouse pass on the shell (target 90+ performance) — not run
