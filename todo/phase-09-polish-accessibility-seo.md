# Phase 9 — Polish, Accessibility & SEO

**Status: not started.** None of `app/sitemap.ts`, `app/robots.ts`, or
`app/manifest.ts` exist yet — confirmed missing during this reorg. This is the
biggest concrete gap for a public-facing artist site that depends on discoverability.

- [ ] `app/sitemap.ts` — auto-generated sitemap covering blog/music/books/games routes
- [ ] `app/robots.ts`
- [ ] `app/manifest.ts` — PWA manifest (icon, theme color, name)
- [ ] Global `generateMetadata` defaults in `app/layout.tsx`
- [ ] Per-page `generateMetadata` with OpenGraph + Twitter cards
- [ ] Keyboard navigability audit for all interactive elements
- [ ] `alt` text audit for all images
- [ ] ARIA labels audit for icon-only buttons
- [ ] VoiceOver (macOS) test — nav, music player, blog posts
- [ ] `axe` accessibility audit — fix critical issues
- [ ] Lighthouse audit on all pages (target 90+ Performance, 100 Accessibility, 100
      Best Practices, 90+ SEO)
- [ ] `<meta name="theme-color">` matching the dark background
- [ ] Responsive test at 320px, 375px, 768px, 1024px, 1440px
