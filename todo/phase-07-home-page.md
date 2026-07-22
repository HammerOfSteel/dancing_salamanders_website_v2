# Phase 7 — Home Page

**Status: matches the live site.** Verified against the current dancingsalamanders.com
during this reorg — the live homepage is a hero + a short mission blurb, nothing more.
The V2 `app/page.tsx` already reproduces that (hero + mission section with the
"Find support" link to livslusths.se). The extra sections listed in the original
`todo.md` (featured post, recent posts, music teaser, newsletter) were aspirational
ideas from early planning that were never part of the real site — not missing work.

- [x] Hero section (`PageHero` used)
- [x] Mission section with link to livslusths.se

## Optional future enhancements (not gaps — only pursue if actually wanted)

- [ ] Featured blog post section (pulling from `lib/blog.ts`)
- [ ] Recent posts section (3 recent cards)
- [ ] Music teaser section (featured album + play button)
- [ ] Newsletter signup (server action)
- [ ] Social links section
- [ ] Responsive check + Lighthouse pass (target 90+)
