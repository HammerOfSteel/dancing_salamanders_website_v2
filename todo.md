# Dancing Salamanders V2 — Implementation Plan

> Living document. Check off tasks as you go. Phases build on each other but individual tasks within a phase can often be parallelised.

---

## Phase 1 — Project Foundation

Get a working Next.js project with the right tooling in place before touching any UI.

- [ ] `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"` to initialise the project
- [ ] Install core dependencies: `framer-motion`, `next-mdx-remote`, `gray-matter`, `sharp`, `nodemailer`, `zod`
- [ ] Install shadcn/ui: `npx shadcn@latest init` — select neutral theme (we override colors)
- [ ] Add initial shadcn components: `button`, `card`, `sheet`, `dialog`, `input`, `textarea`, `badge`, `separator`, `scroll-area`, `slider`
- [ ] Set up TypeScript path aliases (`@/components`, `@/lib`, `@/content`)
- [ ] Configure Tailwind with the Dancing Salamanders design token palette (colors, fonts, spacing)
- [ ] Add Google Fonts (or self-host): Crimson Pro (serif) + Inter (sans)
- [ ] Create `.env.example` with all required environment variables documented
- [ ] Create `lib/theme.ts` exporting the color palette as named constants
- [ ] Set up ESLint + Prettier config
- [ ] Write `docker-compose.yml` (Next.js app + Nginx)
- [ ] Write `Dockerfile` for the Next.js app (multi-stage: build → runner)
- [ ] Write `nginx.conf` (proxy to Next.js, serve `/public` as static, gzip, cache headers)
- [ ] Verify `docker compose up --build` works and serves the default Next.js page
- [ ] Create all content directories: `content/blog/`, `content/books/`, `content/games/`
- [ ] Create placeholder music folder structure: `public/music/README.md` explaining the folder convention

---

## Phase 2 — Design System & Layout Shell

Build the wrapper that every page lives inside before building any individual page.

- [ ] Define CSS custom properties in `globals.css` for all design tokens (colors, radii, shadows)
- [ ] Build `components/layout/Nav.tsx` — responsive nav with mobile hamburger menu
  - Logo (text or SVG salamander mark) + site name
  - Links: Home · Music · Blog · Books · Games · About
  - Active link indicator (current page highlighted)
  - Animated slide-in mobile drawer (shadcn `Sheet`)
- [ ] Build `components/layout/Footer.tsx`
  - Tagline *"Illuminating Hope Through Connection"*
  - Nav links
  - Social icons: SoundCloud · Spotify · (any others)
  - Copyright + year (auto)
- [ ] Build root `app/layout.tsx` — wraps every page with `<Nav>`, `<Footer>`, and a persistent `<MusicPlayerProvider>` context
- [ ] Build `components/shared/PageHero.tsx` — reusable full-width hero section (title, optional subtitle, optional background image with overlay)
- [ ] Build `components/shared/SectionHeading.tsx` — styled H2 with optional decorative element (leaf/wave motif)
- [ ] Build `components/shared/FadeInView.tsx` — Framer Motion wrapper that fades+slides children in on scroll
- [ ] Implement page transition animation (fade between routes using Framer Motion `AnimatePresence`)
- [ ] Verify layout renders correctly on mobile (320px), tablet (768px), and desktop (1280px+)
- [ ] Run Lighthouse on the shell — target 90+ performance

---

## Phase 3 — Music System (Self-Hosted Player)

This is the most technically unique feature of V2. Build it as a complete self-contained system.

### 3a — Filesystem Scanner (Back-end)

- [ ] Write `lib/music.ts` — `getAlbums()` function that:
  - Reads `public/music/` directory
  - For each subdirectory: reads album name (slug → display title), cover art path, and sorted track list
  - Returns typed `Album[]` with `{ slug, title, coverArt, tracks: Track[] }`
  - Each `Track`: `{ title, src, duration?, trackNumber }`
  - Gracefully handles missing cover art (falls back to placeholder)
  - Sorts tracks by numeric prefix in filename (e.g. `01 -`, `02 -`)
- [ ] Write `app/api/music/route.ts` — GET endpoint returning `getAlbums()` as JSON (used by client-side player)
- [ ] Write unit tests for the album scanner (test with mock filesystem)

### 3b — Player State

- [ ] Create `lib/music-context.tsx` — React context `MusicPlayerContext` with:
  - `currentAlbum`, `currentTrack`, `isPlaying`, `progress`, `volume`
  - Actions: `play(album, trackIndex)`, `pause()`, `resume()`, `next()`, `prev()`, `seek(time)`, `setVolume(n)`
  - Persists volume to `localStorage`
  - Persists last-played album + track to `localStorage` (restored on page load)
- [ ] Wrap `app/layout.tsx` with `<MusicPlayerProvider>`

### 3c — Player UI (Persistent Bottom Bar)

- [ ] Build `components/music/PlayerBar.tsx` — sticky bottom bar visible site-wide when a track is loaded:
  - Album cover art thumbnail (small)
  - Track title + album name
  - Play/Pause button
  - Previous / Next track buttons
  - Progress scrubber (shadcn `Slider`) — shows elapsed / total time
  - Volume control (slider, mutable on desktop; hidden on mobile to save space)
  - Hide/Show toggle so it doesn't block footer content
  - Fully accessible: ARIA labels, keyboard navigable
  - Mobile: compact single-row layout; desktop: full bar with all controls
- [ ] Build `components/music/MiniPlayer.tsx` — even more compact variant for use inside album cards

### 3d — Music Page

- [ ] Build `app/music/page.tsx` — album browser page:
  - Page hero: *"Music"* with atmospheric background
  - Album grid: responsive grid of `AlbumCard` components
  - Each `AlbumCard` shows cover art, album title, track count
  - Clicking an album expands/navigates to show track listing (decide: drawer vs. dedicated route vs. inline expand)
- [ ] Build `components/music/AlbumCard.tsx` — card with cover art, title, hover effects, play icon overlay
- [ ] Build `components/music/AlbumDetail.tsx` — full album view:
  - Large cover art (left on desktop, top on mobile)
  - Album title, year (if detected from metadata or folder convention)
  - Track listing with track number, title, duration
  - "Play All" button
  - Individual track play buttons
  - Currently playing track highlighted
- [ ] Build `components/music/TrackList.tsx` — ordered track list component used by `AlbumDetail`
- [ ] Test the full play flow: select album → play track → navigate to blog → player continues → come back
- [ ] Test mobile UX for the full music page end-to-end

---

## Phase 4 — Blog System

- [ ] Write `lib/mdx.ts`:
  - `getAllPosts()` — reads all `.mdx` from `content/blog/`, returns sorted list with frontmatter
  - `getPostBySlug(slug)` — returns compiled MDX + frontmatter for a single post
  - `getFeaturedPost()` — returns the post with `featured: true` (or most recent)
  - `getPostsByTag(tag)` — filter by tag
  - Define and export `PostFrontmatter` TypeScript type
- [ ] Build `app/blog/page.tsx` — blog listing:
  - Page hero
  - Tag filter bar (all tags as clickable badges)
  - Grid of `BlogCard` components sorted by date descending
- [ ] Build `components/blog/BlogCard.tsx` — card with title, date, excerpt, tags, "Read more →"
- [ ] Build `app/blog/[slug]/page.tsx` — individual post:
  - `generateStaticParams()` for SSG
  - `generateMetadata()` for OpenGraph
  - Post header: title, date, reading time, tags
  - MDX content rendered with custom components (headings, blockquotes, links)
  - Prev/Next post navigation
  - "Back to blog" link
  - Optional: inline newsletter signup at end of post
- [ ] Build `components/blog/PostHeader.tsx` — title block with date, reading time, tag badges
- [ ] Build `components/blog/MDXComponents.tsx` — custom renderers for `h2`, `h3`, `blockquote`, `a`, `ul`, `code`
- [ ] Migrate V1 blog posts to MDX files in `content/blog/`:
  - Hiraeth
  - Time in My Hands
  - Strength in Community
  - Support Grieving Parents
  - Supporting Those Closest in Loss
- [ ] Add OpenGraph image generation for blog posts (`app/blog/[slug]/opengraph-image.tsx`)

---

## Phase 5 — Books Page

- [ ] Write `lib/books.ts` — `getAllBooks()`, `getBookBySlug()` (MDX-based, mirrors blog lib)
- [ ] Build `app/books/page.tsx` — gallery of book covers in a responsive grid
- [ ] Build `components/books/BookCard.tsx` — cover art, title, year, genre badge, short excerpt
- [ ] Build `app/books/[slug]/page.tsx` — book detail page:
  - Cover art
  - Title, year, format (poetry / prose / picture book)
  - Full description from MDX
  - External link button if applicable (e.g. to read the full work)
  - Optional: embedded image gallery for picture books
- [ ] Create MDX stubs for all V1 books in `content/books/`
- [ ] Add book cover images to `public/images/books/`

---

## Phase 6 — Games Page

- [ ] Write `lib/games.ts` — `getAllDevlogs()`, `getDevlogBySlug()`, `getDevlogsByGame(game)` (MDX-based)
- [ ] Build `app/games/page.tsx` — listing with game hub sections (one section per game, listing its devlogs)
- [ ] Build `components/games/DevlogCard.tsx` — card with title, date, game tag, excerpt, cover image
- [ ] Build `app/games/[slug]/page.tsx` — devlog post page (same structure as blog post)
- [ ] Migrate V1 devlogs to MDX:
  - Seren Devlog 1 — Canvas
  - Seren Devlog 2 — Blender
- [ ] Add screenshot images for devlogs in `public/images/games/`

---

## Phase 7 — Home Page

Build last so it can pull in real content from all other systems.

- [ ] Build `app/page.tsx` — homepage:
  - **Hero section:** Full-viewport atmospheric image, logo, tagline *"Echoes of Hope, Harmonies of Heart"*, subtle animated particle or leaf/firefly effect (Framer Motion)
  - **Mission section:** Short *"Illuminating Hope Through Connection"* block, link to livslusths.se
  - **Featured blog post:** Pull `getFeaturedPost()` — large card with image, title, excerpt
  - **Recent posts:** 3 recent blog post cards in a row
  - **Music teaser:** Featured album — cover art, album name, "Play" button that starts the persistent player
  - **Newsletter signup:** Simple email input + subscribe button (server action → store email or forward to Listmonk)
  - **Social links:** SoundCloud, Spotify, any others
- [ ] Source and optimise the hero background image (atmospheric, nature-based, dark)
- [ ] Ensure homepage is fully responsive
- [ ] Lighthouse score check: target 90+ on all metrics

---

## Phase 8 — About Page

- [ ] Build `app/about/page.tsx`:
  - **Welcome / Croeso section** — intro to the artist's world, musical style, instruments
  - **Our Message section** — philosophy, grief and hope, link to livslusths.se
  - **Bio section** — geographical journey (Sweden → Wales/Cornwall → Seoul), photo
  - **Contact form** — fields: Name, Email, Message
- [ ] Build `components/about/ContactForm.tsx` — controlled form with Zod validation
- [ ] Build `app/api/contact/route.ts` — server action that:
  - Validates input with Zod
  - Sends email via Nodemailer using SMTP env vars
  - Returns success/error JSON
- [ ] Test contact form end-to-end (requires SMTP config in `.env`)

---

## Phase 9 — Polish, Accessibility & SEO

- [ ] Add `app/sitemap.ts` — Next.js auto-generated sitemap including all blog, music, books, games routes
- [ ] Add `app/robots.ts` — sensible robots.txt
- [ ] Add `app/manifest.ts` — PWA manifest (icon, theme color, name)
- [ ] Add global `generateMetadata` defaults in `app/layout.tsx`
- [ ] Add per-page `generateMetadata` with OpenGraph + Twitter card for all page types
- [ ] Audit all interactive elements for keyboard navigability
- [ ] Audit all images for `alt` text
- [ ] Audit all icon-only buttons for ARIA labels
- [ ] Test with VoiceOver (macOS) — nav, music player, blog posts
- [ ] Run `axe` accessibility audit — fix all critical issues
- [ ] Lighthouse audit all pages: target 90+ Performance, 100 Accessibility, 100 Best Practices, 90+ SEO
- [ ] Add `<meta name="theme-color">` matching the dark background
- [ ] Test all pages at 320px (iPhone SE), 375px, 768px (iPad), 1024px, 1440px

---

## Phase 10 — Docker & Deployment

- [ ] Finalise `Dockerfile`:
  - Stage 1: `node:20-alpine` — install deps + build (`next build`)
  - Stage 2: `node:20-alpine` runner — copy `.next/standalone`, `public/`, serve with `node server.js`
  - `.dockerignore` excludes `node_modules`, `.git`, `public/music` (music mapped as volume)
- [ ] Finalise `docker-compose.yml`:
  - Service `app`: Next.js app, internal port 3000
  - Service `nginx`: Nginx reverse proxy, external port 80 (and 443 for SSL later)
  - Volume: `./public/music:/app/public/music` — music files mounted from host, not baked into image
  - Optional: Certbot/Let's Encrypt sidecar for HTTPS
- [ ] Write `nginx.conf`:
  - Proxy `/` → Next.js app
  - Cache headers for `/music/` static files (long TTL)
  - Gzip compression enabled
  - Max upload size raised for large audio files
- [ ] Test `docker compose up --build` from a clean environment
- [ ] Test that adding a new album to `public/music/` is reflected after `docker compose restart app`
- [ ] Write deployment guide section in README (already scaffolded in Phase 1)

---

## Phase 11 — Content & Launch

- [ ] Write `content/blog/` MDX files for all V1 posts (full text from site)
- [ ] Write `content/books/` MDX stubs for all V1 books
- [ ] Write `content/games/` MDX stubs for V1 devlogs
- [ ] Add real album cover images to `public/music/[album]/cover.jpg` for each album
- [ ] Drop actual `.mp3` files into `public/music/[album]/` for at least one full album to test
- [ ] Final cross-browser test: Chrome, Firefox, Safari, Safari iOS, Chrome Android
- [ ] Final performance pass: optimise any images above 200KB, check bundle size
- [ ] DNS + hosting decision: VPS provider, domain transfer (or CNAME from existing domain)
- [ ] SSL certificate setup (Nginx + Certbot or Cloudflare proxy)
- [ ] Go live 🎉

---

## Backlog / Future Ideas

- [ ] **Lyrics page per track** — MDX file per song, linked from the track listing
- [ ] **Search** — full-text search across blog + books using a client-side index (Fuse.js or Pagefind)
- [ ] **Newsletter system** — self-host [Listmonk](https://listmonk.app/) as a Docker sidecar
- [ ] **Music visualiser** — canvas-based waveform animation in the player bar
- [ ] **Dark/light mode toggle** — the design system supports it; add a toggle
- [ ] **RSS feed** — `/feed.xml` for the blog
- [ ] **Welsh language toggle** — key pages available in Welsh (Cymraeg)
- [ ] **Grief resources directory** — standalone section linking to livslusths.se, Sad Dads Club, etc.
- [ ] **Concert/events page** — if live shows happen
- [ ] **Merch integration** — link to external shop
- [ ] **Music metadata from ID3 tags** — read track title, duration from `.mp3` headers instead of filenames
