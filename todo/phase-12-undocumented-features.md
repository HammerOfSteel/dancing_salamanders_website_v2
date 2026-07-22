# Phase 12 — Undocumented Existing Features

*Added during this reorg.* Two full pages exist in the codebase that were never
part of the original plan and aren't tracked anywhere:

## `app/garden-of-memory/page.tsx`

A memorial photo gallery (currently pulling images directly from the old
Squarespace CDN URLs rather than self-hosted assets).

- [ ] Migrate the memorial photos to self-hosted storage (`public/images/` or
      similar) — currently hot-linking to `images.squarespace-cdn.com`, which
      contradicts the project's stated goal of "no third-party CMS, no platform
      lock-in" and is fragile (the old Squarespace site could remove these anytime)
- [ ] Add this page to the main nav / sitemap if it's meant to be publicly
      discoverable (confirm whether it currently is)
- [ ] Document its purpose/context in the README alongside the other content types

## `app/resources/page.tsx`

A grief/crisis support resources directory (e.g. "988 Suicide & Crisis Lifeline").

- [ ] **Safety-critical accuracy check**: verify all helpline numbers, URLs, and
      availability info are current and correct — this is exactly the kind of
      content where a stale phone number is actively harmful. Already covers US,
      UK/ROI (Samaritans), Canada, Australia, and Befrienders Worldwide/IASP.
- [ ] Add a Swedish helpline (e.g. Mind Självmordslinjen 90101) given the artist's
      Swedish background and the livslusths.se partner link — currently missing
- [ ] Link this page from the About page / footer, not just as a standalone route,
      given its importance to the site's stated mission (grief support, links to
      livslusths.se and Sad Dads Club)
- [ ] Add this page to the main nav / sitemap
