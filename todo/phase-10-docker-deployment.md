# Phase 10 — Docker & Deployment

**Status: scaffolded, not verified/live.** `Dockerfile`, `docker-compose.yml`, and
`nginx.conf` all exist at the repo root, but a clean build/deploy hasn't been
re-verified since — treat as needing a fresh end-to-end check rather than assumed
working.

- [ ] Verify `Dockerfile` multi-stage build (deps → `next build` → standalone runner)
      still works with the current dependency set
- [ ] Verify `docker-compose.yml` service wiring (app + nginx, music volume mount)
- [ ] Verify `nginx.conf` (proxy, cache headers for `/music/`, gzip, upload size)
- [ ] Test `docker compose up --build` from a clean environment
- [ ] Test that adding a new album to `public/music/` is reflected after
      `docker compose restart app`
- [ ] Confirm deployment guide section in README matches the actual current process
