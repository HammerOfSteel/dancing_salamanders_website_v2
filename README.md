# Dancing Salamanders — Website V2

> *Illuminating Hope Through Connection*

A fully self-hosted, locally developed website for Dancing Salamanders — the music, writing, and creative world of an indie folk artist whose work weaves together themes of hope, grief, belonging, and the Celtic landscapes of Wales and beyond.

---

## What this is

This is V2 of [dancingsalamanders.com](https://www.dancingsalamanders.com), rebuilt from the ground up to move away from Squarespace and into a fully owned, self-hosted stack. Everything — including music streaming — is hosted here. No third-party CMS. No platform lock-in.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) | SSG/SSR hybrid, file-based routing, great SEO |
| Language | TypeScript | Type safety across the whole codebase |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first, design-token driven |
| Components | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) | Accessible, unstyled, composable |
| Animations | [Framer Motion](https://www.framer.com/motion/) | Smooth page transitions and reveals |
| Content | MDX (`.mdx` files) | Write blog posts and book pages in Markdown + React |
| Music serving | Next.js API route + filesystem scanner | Auto-discovers albums/tracks from folder structure |
| Contact form | Server Action → email via Nodemailer | No third-party form services |
| Containerisation | Docker + Docker Compose | Run anywhere — local Mac, VPS, or cloud |
| Reverse proxy | Nginx (in compose) | Handles HTTPS termination and static caching |

---

## Design System

Colors, typography and motion are drawn from the existing V1 identity and refined into a cohesive Welsh/Celtic folk theme:

```
Background dark:   #0f1410   (deep forest night)
Background mid:    #1a2518   (moss shadow)
Surface:           #232d20   (evening fern)
Border:            #3a4f36   (dark ivy)
Accent gold:       #c8922a   (amber ember)
Accent warm:       #e8c06b   (morning light)
Text primary:      #f0ece3   (warm cream)
Text muted:        #9aab96   (pale sage)
Rust:              #8b3a3a   (heather red)
Slate:             #4a6b8a   (welsh sky)
```

Fonts: **Crimson Pro** (serif headlines) · **Inter** (UI body) · **Fira Code** (code/metadata)

---

## Running Locally

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for the full stack)

### Development (hot reload)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production (Docker)

```bash
docker compose up --build
```

The full site (Next.js + Nginx) will be available on `http://localhost:80`.

To run detached:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

---

## Adding Music

Music is **filesystem-driven** — no database entries, no hard-coded lists. The player auto-discovers albums and tracks from this folder structure:

```
public/music/
└── album-name/                  ← folder name becomes the album title (hyphens → spaces, title-cased)
    ├── cover.jpg                ← album artwork (also accepts cover.png or cover.webp)
    └── 01 - Track Name.mp3     ← tracks sorted by filename prefix number
    └── 02 - Another Track.mp3
    └── ...
```

### Example

```
public/music/
├── ordain/
│   ├── cover.jpg
│   ├── 01 - Opening.mp3
│   └── 02 - The Vow.mp3
└── threads-between-the-stars/
    ├── cover.jpg
    └── 01 - Stardrift.mp3
```

The music page will **automatically** show the new album on the next build (or instantly in dev mode). No code changes needed.

**Supported audio formats:** `.mp3`, `.flac`, `.wav`, `.ogg`, `.m4a`

---

## Adding Blog Posts

Create a new `.mdx` file in `content/blog/`:

```
content/blog/
└── my-new-post.mdx
```

Frontmatter schema:

```mdx
---
title: "My Post Title"
date: "2025-03-01"
excerpt: "A short description shown on the blog listing."
tags: ["grief", "music", "wales"]
featured: false
---

Your post content here in **Markdown**.
```

---

## Adding Books

Create a new `.mdx` file in `content/books/`:

```
content/books/
└── my-book-title.mdx
```

```mdx
---
title: "My Book Title"
cover: "/images/books/my-book-cover.jpg"
year: 2024
excerpt: "Short description."
externalLink: "https://..."   # optional — for external reads
---
```

---

## Adding Game Devlogs

Devlogs live in `content/games/`:

```mdx
---
title: "Seren - Devlog 3"
game: "seren"
date: "2025-06-01"
excerpt: "What happened this month."
---
```

---

## Project Structure

```
dancing_salamanders_website_v2/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (nav, footer)
│   ├── page.tsx                # Home
│   ├── music/
│   │   └── page.tsx            # Music browser + player
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/page.tsx     # Blog post
│   ├── books/
│   │   ├── page.tsx            # Books gallery
│   │   └── [slug]/page.tsx     # Book detail
│   ├── games/
│   │   ├── page.tsx            # Games / devlog listing
│   │   └── [slug]/page.tsx     # Devlog post
│   ├── about/
│   │   └── page.tsx            # About + contact form
│   └── api/
│       ├── music/route.ts      # Returns album/track list from filesystem
│       └── contact/route.ts    # Contact form handler
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   ├── music/
│   │   ├── MusicPlayer.tsx     # Persistent bottom player
│   │   ├── AlbumGrid.tsx
│   │   └── TrackList.tsx
│   ├── blog/
│   │   └── BlogCard.tsx
│   └── shared/
│       └── PageHero.tsx
├── content/
│   ├── blog/                   # .mdx blog posts
│   ├── books/                  # .mdx book entries
│   └── games/                  # .mdx devlog entries
├── lib/
│   ├── music.ts                # Filesystem scanner for albums
│   ├── mdx.ts                  # MDX loader helpers
│   └── theme.ts                # Design tokens
├── public/
│   ├── music/                  # Self-hosted audio files
│   │   └── [album-name]/
│   └── images/
│       ├── books/
│       └── games/
├── styles/
│   └── globals.css
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Deployment on a VPS / Remote Server

1. Copy the project to your server (or `git clone` it).
2. Place your music files in `public/music/`.
3. Set environment variables (copy `.env.example` → `.env`):

```env
CONTACT_EMAIL_TO=your@email.com
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

4. Run:

```bash
docker compose up --build -d
```

5. Point your domain's DNS A record to the server IP. Nginx handles the rest.

---

## Credits & Links

- Artist: Dancing Salamanders
- SoundCloud: [soundcloud.com/dancingsalamanders](https://soundcloud.com/dancingsalamanders)
- Spotify: [open.spotify.com/artist/1KGvM7M0K9mwqiKJiGBBst](https://open.spotify.com/artist/1KGvM7M0K9mwqiKJiGBBst)
- Support: [livslusths.se](https://www.livslusths.se/) — grief support community
- Sad Dads Club: [saddadsclub.org](https://saddadsclub.org/)
