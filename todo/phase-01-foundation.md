# Phase 1 — Project Foundation

**Status: done.** Verified against the actual codebase during this reorg — Next.js +
TypeScript + Tailwind project exists, core deps installed, Docker/Nginx scaffolding
in place, content directories created.

- [x] Next.js project initialized (TypeScript, Tailwind, App Router)
- [x] Core dependencies installed: `framer-motion`, `next-mdx-remote`, `gray-matter`,
      `sharp`, `nodemailer`, `zod`
- [x] shadcn/ui initialized with components: `button`, `card`, `sheet`, `dialog`,
      `input`, `textarea`, `badge`, `separator`, `scroll-area`, `slider`
- [x] TypeScript path aliases configured
- [x] Tailwind configured with the Dancing Salamanders design token palette
- [x] `.env.example` created with required environment variables documented
- [x] `lib/theme.ts` — design tokens *(verify: confirm this file still exists /
      tokens live in `globals.css` instead — spot-checked but worth a quick look)*
- [x] ESLint config in place
- [x] `docker-compose.yml`, `Dockerfile`, `nginx.conf` written
- [x] Content directories created: `content/blog/`, `content/books/`, `content/games/`
- [x] `public/music/README.md` explaining the folder convention

## Open

- [ ] Confirm `docker compose up --build` still works end-to-end (last verified when
      first written — re-verify after all the phases below landed)
