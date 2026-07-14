# Dancing Salamanders V1 — Architecture & Content Audit

> Live at: https://www.dancingsalamanders.com  
> Platform: Squarespace  
> Audited: July 2026

This document captures everything that exists in the live V1 site — pages, content, structure, design observations, and platform limitations — to inform the V2 build.

---

## 1. Site Identity

| Property | Value |
|---|---|
| Name | Dancing Salamanders |
| Primary tagline | *"Illuminating Hope Through Connection"* |
| Secondary tagline | *"Echoes of Hope, Harmonies of Heart"* |
| Core message | Music as a vehicle for processing grief, hope, and community |
| Geographic roots | Northern Sweden (origin) → Wales/Cornwall (transplanted) → Seoul (lived) |
| Cultural touchstones | Welsh/Celtic folklore, Valleys communities, Japanese aesthetics, Nordic landscapes |
| Partner organisation | [livslusths.se](https://www.livslusths.se/) — Swedish grief support community |

---

## 2. Navigation Structure

```
Dancing Salamanders (logo / home)
├── music
├── games
├── books
├── about
└── [footer links]
    ├── SoundCloud
    └── Spotify
```

Notable: there is **no explicit Blog link** in the main nav on V1 — blog content is linked from the homepage and from within content, but not a first-class nav item. This is a V2 improvement opportunity.

---

## 3. Pages — Detailed Breakdown

### 3.1 Home (`/`)

**Layout:** Full-width hero image + large text over it, followed by content sections  
**Content blocks:**
- Large atmospheric hero photo (dark textured, appears to be a nature/landscape shot)
- Tagline: *"Echoes of Hope, Harmonies of Heart"*
- Section: *"Illuminating Hope Through Connection"* — mission statement about grief and community
- Link to: [livslusths.se](https://www.livslusths.se/) grief support community
- **Featured blog post** — displayed prominently (currently: *Hiraeth*, Feb 2025)
- **Recent blog posts** — 2–3 post previews with title, date, excerpt, "Read more →"
- **Email subscribe form** — "Sign up to receive news and updates"
- Footer with navigation links

**V2 improvements needed:**
- Blog should have its own nav entry
- Newsletter should be handled in-house (currently likely Squarespace/Mailchimp)
- Hero section can be animated and thematic

---

### 3.2 Music (`/music`)

**Layout:** Grid of album thumbnails (click-through to individual album pages)  
**Albums listed (all with individual sub-pages):**

| # | Album slug | Display Title |
|---|---|---|
| 1 | `/music/ordain` | ordain |
| 2 | `/music/threads-between-the-stars` | threads between the stars |
| 3 | `/music/the-alchemists-estate` | The Alchemists estate |
| 4 | `/music/temperance` | Temperance |
| 5 | `/music/sundry` | sundry |
| 6 | `/music/garden-of-small-miracles` | garden of small miracles |
| 7 | `/music/liv-lust` | liv, lust |
| 8 | `/music/glitchwitch` | glitchwitch |
| 9 | `/music/super-nova` | Super Nova |
| 10 | `/music/aitho` | Aitho |
| (+ more) | ... | ... |

**Each album page** (`/music/[album]`) contains:
- Album cover art
- Prev/Next album navigation
- In V1: embedded Squarespace audio player (limited, no persistent playback)

**V1 limitations:**
- Music is not self-hosted — relies on Squarespace audio blocks or embeds
- No persistent music player across page navigation
- No track listing shown beyond what Squarespace embeds show
- No lyrics, liner notes, or album descriptions visible
- Mobile playback experience is basic

**V2 goals:**
- Self-hosted `.mp3` files in `public/music/[album]/`
- Persistent bottom player that survives page changes
- Auto-discovered albums/tracks from filesystem
- Track listing with titles, duration
- Album art displayed prominently
- Optional: lyrics per track

---

### 3.3 Games (`/games`)

**Layout:** Blog-style listing of devlog entries  
**Current game:** *Seren* — a narrative-driven visual novel

**Devlogs:**

| Title | Date | Key content |
|---|---|---|
| Seren - Devlog 2 - Blender | July 2026 | Building atmospheric Welsh street scene in Blender with AI-assisted 3D work |
| Seren - Devlog 1 - Canvas | May 2019 | Origin of Seren as a visual novel; Canvas rendering approach |

**Devlog content notes (from Devlog 1):**
- Seren evolved from Dancing Salamanders' concept albums
- Narrative-driven visual novel format
- Welsh mythos, the Mabinogion
- Technical: JavaScript Canvas-based renderer initially

**Devlog content notes (from Devlog 2):**
- Switched to Blender for 3D atmospheric scenes
- Welsh street at night: terraced cottages, fox with scarf, gas lamppost
- AI-assisted Blender workflow

**V1 limitations:**
- Basic blog layout, no game-specific features
- No screenshots/screenshots gallery properly integrated
- No "play" button or demo link

**V2 goals:**
- Dedicated devlog system (MDX)
- Screenshot gallery per devlog
- Per-game hub page showing all devlogs for that game

---

### 3.4 Books (`/books-1`)

**Layout:** Grid of book/poetry covers (click-through to individual entries)  
**Entries listed:**

| Slug | Title |
|---|---|
| `/books-1/foxes-in-the-garden` | Foxes in the garden |
| `/books-1/truecolours` | true colours |
| `/books-1/daffodil` | daffodil |
| `/books-1/an-old-refrain` | an old refrain |
| `/books-1/an-ebbw-song` | an Ebbw song |
| `/books-1/heimdal` | heimdal |
| `/books-1/a-path-to-home` | a path to home |
| `/books-1/a-place-called-home` | a place called home |
| `/books-1/kyoto-notebooks` | kyoto notebooks |
| (+ more) | ... |

**Each book page:** Shows cover art, may link to an external reader (e.g. Gifyu for *Foxes in the Garden* — "full story with cover"). No in-site reader.

**V1 limitations:**
- Books page URL is `/books-1` — awkward slug
- External links to Gifyu for reading (third-party dependency)
- No description, year, or genre metadata shown
- No in-site reading experience

**V2 goals:**
- Clean `/books` URL
- In-site reader option (or at least embedded PDF/image viewer)
- Proper metadata: title, year, description, format (poetry, prose, picture book)
- Cover gallery with hover previews

---

### 3.5 About (`/about`)

**Layout:** Multi-section page  
**Content sections:**

1. **Welcome - Croeso** — introduction to Dancing Salamanders' world
   > *"where music becomes a bridge to hope, connection, and understanding"*  
   > Describes musical style: acoustic guitar, violin, mandolin, cello, flute  
   > Genre: indie + folk traditions

2. **Our Message** — philosophy and purpose  
   > Music to reach others, offering solace and belonging  
   > Topics: complexities of life, family, philosophy, spirituality  
   > Acknowledgement of grief work, link to livslusths.se

3. **BIO**  
   > Born in northern Sweden  
   > Roots now in Wales, Cornwall and Seoul  
   > Photo included

4. **Contact Form**  
   > Fields: First Name, Last Name, Email, Message  
   > Submit button: "Send"

**V1 limitations:**
- Contact form handled by Squarespace (no control over submissions)
- No dedicated social links section beyond nav footer
- Photo gallery limited

**V2 goals:**
- Contact form via server action + Nodemailer
- Social links section with all platforms
- Timeline/journey section showing geographic roots
- Instruments section

---

### 3.6 Blog (`/blog`)

**Layout:** Listing page with post cards, individual post pages  
**Blog focus:** Grief, healing, community, memory, Welsh identity  

**Posts found:**

| Title | Date | Topics |
|---|---|---|
| Hiraeth | Feb 21, 2025 | Welsh longing, grief, memory, marking & rituals |
| Time in My Hands | Feb 21, 2025 | Grief and memory, quotes about loss |
| Strength in Community | Oct 17, 2024 | Sad Dads Club, grief communities, holding space |
| Support Grieving Parents | Oct 10, 2024 | Child loss, parental grief |
| Supporting Those Closest in Loss | Oct 4, 2024 | How to support grieving people |

**Post structure (from *Hiraeth* audit):**
- Long-form prose
- Sections with H2 headings (e.g. *The Untranslatable Ache*, *Remembering*, *Wandering*, *Doing*, *Resources*)
- Sub-sections with H3 headings (*Marking*, *Making*, *Connecting*)
- Inline lyrics block (from album tracks)
- Resources section at end (books, music, communities)
- Prev/Next post navigation

**V1 limitations:**
- Blog not in main nav
- No tags or categories
- No reading time estimate
- No author info block
- No sharing buttons

**V2 goals:**
- Blog as first-class nav item
- MDX posts for full content control
- Tags + category filtering
- Reading time estimate
- Featured post on homepage
- Prev/Next + related posts
- Email newsletter signup embedded in posts

---

## 4. Design & Visual Language

### Observed from V1

- **Dark, earthy aesthetic** — nature textures, deep shadows
- **Atmospheric photography** — landscapes, textured surfaces
- **Typography:** Mix of serif and sans-serif; titles feel editorial
- **Spacing:** Generous whitespace; content breathes
- **Squarespace limitations visible:** Generic grid layouts, standard embed blocks

### Color notes from V1
- Background: very dark (near-black) with warm undertones
- Accent: warm amber/gold tones for CTAs and highlights
- Text: near-white with warm tint
- Imagery leans toward greens, dark mossy tones, Welsh countryside

### V2 Design Theme: "Welsh Forest at Dusk"
A cohesive dark folk aesthetic — like entering a forest clearing at twilight, Welsh and Nordic in spirit, warm candlelight gold accents on deep moss backgrounds.

---

## 5. Third-Party Dependencies (V1) → V2 Replacements

| V1 Dependency | Purpose | V2 Replacement |
|---|---|---|
| Squarespace CMS | All content management | MDX files + filesystem |
| Squarespace audio blocks | Music playback | Self-hosted files + custom player |
| Squarespace forms | Contact form | Next.js Server Action + Nodemailer |
| Squarespace newsletter | Email capture | Self-hosted or Listmonk |
| Gifyu (external) | Book image hosting | Self-hosted in `/public/images/books/` |
| Squarespace blog | Blog CMS | MDX + frontmatter |
| SoundCloud embeds (possible) | Music streaming | Self-hosted |

---

## 6. Missing Features in V1 (V2 Must-Haves)

- [ ] Persistent music player across page navigation
- [ ] Blog in main navigation
- [ ] Search across blog posts
- [ ] Tag-based blog filtering
- [ ] Self-hosted music files
- [ ] Auto-discovery of albums from filesystem
- [ ] Reading time on blog posts
- [ ] Proper mobile music player UX
- [ ] Dark/light mode (or at minimum a fully intentional dark mode)
- [ ] Contact form that sends actual email
- [ ] Album descriptions and track listings
- [ ] Lyrics per track (optional)
- [ ] Devlog screenshot galleries

---

## 7. SEO & Metadata (V1 Observations)

- Page titles appear to be Squarespace defaults
- No visible OpenGraph / Twitter card meta
- No sitemap linked from robots.txt directly (Squarespace may generate one)
- Blog posts have clean URLs (`/blog/slug`)
- Music album URLs: `/music/slug`

**V2 goals:**
- Full OpenGraph + Twitter card metadata on all pages
- Sitemap generated automatically by Next.js
- Structured data (JSON-LD) for music, blog posts
- Canonical URLs

---

## 8. Performance (V1 Observations)

- Images served via Squarespace CDN (`images.squarespace-cdn.com`) — format `?format=500w`
- No obvious lazy loading patterns
- Squarespace JS bundle is heavy

**V2 goals:**
- Next.js `<Image>` with automatic optimisation
- Static generation where possible (blog, album pages)
- Music files served as static assets
- Lighthouse score target: 90+ on all metrics
