# Migration: `tur_secondhand` (Kamatera → one.com VPS)

## Overview — what this is and why

Four **Tur Second Hand** pitch-prototype demos (repo `HammerOfSteel/tur`, local clone at
`../tur_secondhand`) are running in production-like fashion on the same Kamatera box
(`45.248.37.221`) as `dancingsalamanders.com`/`livslusths.se`, exposed as subdomains under
`dancingsalamanders.com`:

| Subdomain | Stack | Kamatera ports | Container prefix |
|---|---|---|---|
| `tur.dancingsalamanders.com` | WordPress + WooCommerce, Design A "Skogsstig Classic" | `3008` | `tur-secondhand-wordpress-design-a` |
| `tur2.dancingsalamanders.com` | WordPress + WooCommerce, Design B "Skogsstig Varm" | `3009` | `tur-secondhand-wordpress-design-b` |
| `tur3.dancingsalamanders.com` | Next.js headless storefront + its own WP/WooCommerce backend, Design A | `3010` (nextjs) / `3011` (wp backend) | `tur-secondhand-react-design-a` |
| `tur4.dancingsalamanders.com` | Next.js headless storefront + its own WP/WooCommerce backend, Design B | `3012` (nextjs) / `3013` (wp backend) | `tur-secondhand-react-design-b` |

This is the **last thing still running on Kamatera** once the main site migration's Phase 7
happens — after this, Kamatera can be fully decommissioned (coordinate with livlust's own
timeline, same as noted in [migration_to_one.com_host_todo.md](migration_to_one.com_host_todo.md)).

**DNS status (checked 2026-09-20 via `dig` against 1.1.1.1 and 8.8.8.8):**
- `tur`, `tur2`, `tur3` → already point to the new host `85.190.107.67`. ✅
- `tur4` → still points to the old Kamatera IP `45.248.37.221`. ⚠️ **User needs to flip this one
  too** — the plan below still stands up tur4's app on the new host so it's ready the moment DNS
  catches up, but the TLS cert step for tur4 has to wait until it resolves correctly (Let's
  Encrypt's HTTP-01 challenge validates against whatever IP the domain currently resolves to).

**Key decision — fresh reseed, not a stateful data migration:**
Unlike the main site, this project has **no media to migrate and (per its own `OVERVIEW.md`)
no real business/customer data** — it's an in-person pitch prototype with mocked checkout, no
real payments, and an **idempotent WP-CLI seed script** that fully reconstructs every demo
(WooCommerce install, 12 products, all content pages, theme activation) from scratch on every
`docker compose up`. So instead of dumping/restoring 4 MySQL databases and rsyncing 4
`wp_data` volumes (extra complexity, and old-WP-version dump/restore quirks), this plan just
does a **fresh `git clone` + `docker compose up -d --build` on the new host** — identical to
spinning the demos up locally for the first time. This reconstructs all 4 demos byte-for-byte
equivalent to what's live today.
**Flag this assumption before running Phase 3**: if the shop owner has made any real manual
edits in one of the four `wp-admin` dashboards since the Aug 27 seed (e.g. during an actual
pitch meeting) that are worth keeping, say so and we'll do a proper DB dump + `wp-content`
rsync migration instead. Default assumption: no such edits exist, since this was built and
described purely as a demoable pitch prototype.

**New host port assignment** (the new host already uses `3005`-`3009`, `8055`, `9010` for
livlust/dancing-salamanders/music-visualizer — confirmed via `ss -tlnp` on 2026-09-20 — so
Kamatera's `3008`-`3013` can't be reused verbatim):

| Subdomain | New port(s) |
|---|---|
| `tur` (wp design-a) | `3020` |
| `tur2` (wp design-b) | `3021` |
| `tur3` (react design-a) | `3022` (nextjs) / `3023` (wp backend) |
| `tur4` (react design-b) | `3024` (nextjs) / `3025` (wp backend) |

These require editing the hardcoded `127.0.0.1:PORT:80` / `:3000` lines in each demo's
`docker-compose.prod.yml` (Kamatera's copies hardcode the old ports directly, no `${VAR:-...}`
parametrization like the main site uses). Since Kamatera is being fully decommissioned right
after this, there's no need to keep the old ports working there too — just change them in
place and redeploy.

**Existing deploy pipeline**: `.github/workflows/deploy.yml` already exists in this repo and
already deploys all 4 stacks on every push to `main` (`git pull`/`clone` + per-stack
`docker compose -f .../docker-compose.prod.yml up -d --build --remove-orphans`). Unlike the
main site's workflow, host/user are **hardcoded literals** in the workflow file (`root@
45.248.37.221`), not GitHub secrets — only `DEPLOY_SSH_KEY` is a secret (already set, currently
holds the shared Kamatera root key). This needs updating to the new host's `administrator`
user (passwordless sudo, password-only SSH auth — same as the main site's new-host setup) plus
a dedicated new deploy keypair.

**TLS**: Kamatera issued a **single SAN certificate** covering all four domains in one
`certbot --nginx -d tur... -d tur2... -d tur3... -d tur4...` call (confirmed via
`openssl x509 -text` on the live cert). Reuse this pattern on the new host — but see the tur4
DNS caveat above; may need to issue for 3 domains first and `--expand` to add tur4 later.

---

## Phase 1 — Edit compose files for new ports (local repo, `tur_secondhand`)

- [x] `wordpress/design-a/docker-compose.prod.yml`: `127.0.0.1:3008:80` → `127.0.0.1:3020:80`
      (also update the file's header comment mentioning `:3008`)
- [x] `wordpress/design-b/docker-compose.prod.yml`: `127.0.0.1:3009:80` → `127.0.0.1:3021:80`
      (+ header comment)
- [x] `react/design-a/docker-compose.prod.yml`: `127.0.0.1:3011:80` → `127.0.0.1:3023:80`,
      `127.0.0.1:3010:3000` → `127.0.0.1:3022:3000` (+ header comments)
- [x] `react/design-b/docker-compose.prod.yml`: `127.0.0.1:3013:80` → `127.0.0.1:3025:80`,
      `127.0.0.1:3012:3000` → `127.0.0.1:3024:3000` (+ header comments)
- [x] Commit + push to `main`.

## Phase 2 — Point deploy.yml at the new host

- [x] Generate a new dedicated ed25519 deploy keypair (don't reuse another repo's key):
      `ssh-keygen -t ed25519 -f ~/.ssh/tur_secondhand_onecom_ci_deploy -N "" -C "tur-secondhand-ci-deploy@onecom"`
- [x] Install the public half into `administrator`'s `~/.ssh/authorized_keys` on `85.190.107.67`
- [x] `gh secret set DEPLOY_SSH_KEY --repo HammerOfSteel/tur < ~/.ssh/tur_secondhand_onecom_ci_deploy`
- [x] Edit `.github/workflows/deploy.yml`: `host: 45.248.37.221` → `host: 85.190.107.67`,
      `username: root` → `username: administrator`, and prefix each `docker compose`/`git`
      command in the script with `sudo` (administrator has passwordless sudo; docker requires
      root or docker-group membership on this host, same pattern as the main site's deploy.yml)
- [x] Commit + push

### Unplanned issue hit here — WooCommerce requires WP core ≥7.0, image tag pinned to 6.9

The first real deploy to the new host succeeded (containers up, correct ports) but all 4
`wpcli` seed containers crash-looped with:
`Warning: woocommerce: This plugin does not work with your version of WordPress. Minimum
WordPress requirement is 7.0` / `Error: No plugins installed.`

Root cause: all 4 `docker-compose.prod.yml` files pinned `image: wordpress:6.9-php8.2-apache`.
That pin only governs what gets copied into a **freshly empty** volume — it does **not**
retroactively upgrade an already-populated volume. Kamatera's live containers had been running
for 3+ weeks and WordPress's own built-in core auto-update mechanism had silently bumped their
*actual* running core version to **7.1.1** (confirmed via
`grep "wp_version =" /var/www/html/wp-includes/version.php` inside the live Kamatera container) —
completely decoupled from the Docker image tag. So a genuinely fresh volume on the new host
started from the image's baked-in 6.9 files, and the now-current WooCommerce release (which
Kamatera's *already-upgraded* install could run fine) refused to install.

**Fix applied**: bumped `image:` in all 4 compose files to `wordpress:7.1-php8.2-apache`
(verified via `docker run --rm wordpress:7.1-php8.2-apache grep "wp_version ="
/usr/src/wordpress/wp-includes/version.php` → bundles `$wp_version = '7.1.1';`, matching
Kamatera's live version exactly). Also kept the `--version=11.0.1` WooCommerce pin added to
all 4 `seed.sh` scripts (matches the exact version verified live on Kamatera; not sufficient
alone, but harmless/parity-preserving now that the core version is fixed).

**Caveat hit while applying the fix**: an image-tag bump alone doesn't touch **existing**
(broken, partially-seeded) volumes from the earlier failed attempts. Had to fully
`docker compose -p <project> -f <file> down -v` all 4 stacks to force truly fresh volumes
against the new image. One volume (`tur-secondhand-wordpress-design-a_wp_data`) got stuck
"still in use" mid-teardown because an auto-triggered `deploy.yml` run (fired by the very push
that contained the fix) raced with the manual teardown and recreated the container against the
stale volume before it could be removed. Resolved by re-running `down -v` for that one stack a
second time once the auto-deploy had finished, which then removed cleanly. After that, a fresh
`gh workflow run deploy.yml` produced healthy `Exited (0)` wpcli containers for all 4 stacks,
confirmed via their logs (WooCommerce install → product import → "Step 6: Product import" ...
completing without error).

## Phase 3 — nginx stubs on the new host (pre-cert, HTTP-only first)

- [x] Created 4 vhost files under `/etc/nginx/sites-available/` on `85.190.107.67` (HTTP-only,
      `listen 80`, no certbot block), pointed at the new ports from the table above, mirroring
      Kamatera's routing including the react tracks' `wp-admin|wp-login.php|wp-content|
      wp-includes|wp-json|wp-cron.php` regex location for the wp backend.
- [x] Symlinked into `/etc/nginx/sites-enabled/`, `nginx -t` passed, reloaded cleanly.

## Phase 4 — First deploy on the new host

- [x] Deployed via `gh workflow run deploy.yml --repo HammerOfSteel/tur` (after the Phase-2
      WooCommerce/WP-7.1 fix commit landed and all 4 stacks' volumes were torn down for a
      genuinely fresh reseed — see note above).
- [x] All 8+ containers (4× wordpress/nextjs, 4× db, 2× wpcli for the react stacks, 2× wpcli
      for the wordpress stacks — 14 containers total) came up healthy.
- [x] All 4 wpcli seed containers exited `(0)` — confirmed via `docker ps -a` and by tailing
      logs (WooCommerce install → Swedish locale/currency/payment gateway config → category
      creation → 12-product import, no errors).
- [x] Confirmed each app responds internally: ports 3020/3021/3022/3024 → `200`; 3023/3025
      (wp backends) → `301` (expected — WP redirecting bare `/` to its configured home URL,
      not an error since these ports only need to serve `/wp-admin`+`/wp-json`).

## Phase 5 — TLS certs

- [x] `tur4` DNS was **still** pointing at the old Kamatera IP (`45.248.37.221`) when this
      phase ran (re-checked via `dig` against both 1.1.1.1 and 8.8.8.8) — so issued the cert
      for the 3 ready domains only:
      `sudo certbot --nginx -d tur.dancingsalamanders.com -d tur2.dancingsalamanders.com -d tur3.dancingsalamanders.com`
      → succeeded, certbot deployed the cert into all 3 vhost files automatically.
- [x] User fixed `tur4`'s DNS A-record. DNS was mid-propagation (some resolvers returned the
      new IP, others still cached the old Kamatera IP) when checked, but the HTTP-01 challenge
      succeeded anyway. Ran:
      `sudo certbot --nginx --cert-name tur.dancingsalamanders.com -d tur.dancingsalamanders.com -d tur2.dancingsalamanders.com -d tur3.dancingsalamanders.com -d tur4.dancingsalamanders.com --expand`
      → renewed the cert to cover all 4 domains, deployed into all 4 vhost files automatically.
      Verified via `curl --resolve tur4.dancingsalamanders.com:443:85.190.107.67 https://tur4.dancingsalamanders.com/`
      (bypassing any locally-cached stale DNS) → 200, wp-admin 302, 12 products via Store API.

## Phase 6 — Smoke test (3 of 4 live domains; tur4 pending DNS)

- [x] `tur.dancingsalamanders.com`: HTTPS 200, `<title>Tur Second Hand</title>`, wp-admin
      reachable (`/wp-admin/` → 302 redirect to login, as expected when logged out).
- [x] `tur2.dancingsalamanders.com`: HTTPS 200, wp-admin reachable (302), Varm variant deployed
      (not visually diffed pixel-by-pixel, but seed logs confirm correct theme's product/page
      set was created for this stack).
- [x] `tur3.dancingsalamanders.com`: HTTPS 200, Next.js storefront live, own WooCommerce Store
      API backend confirmed reachable and returning the full 12-product catalog at
      `/wp-json/wc/store/v1/products?per_page=100`, `/wp-admin/` on the same domain also
      reachable via the regex location block (302).
- [x] `tur4.dancingsalamanders.com`: HTTPS 200 (verified with `--resolve` against
      `85.190.107.67` directly, since DNS was still propagating at check time), wp-admin
      reachable (302), Store API returns the full 12-product catalog.
- [ ] One full cart → checkout → order-confirmation walkthrough — not yet done on either a
      WordPress or React demo (recommended before calling this fully signed off, though the
      mocked payment gateway config was confirmed present in the seed logs for all 4 stacks).

## Phase 7 — Cleanup / decommission notes

- [x] Left the Kamatera copy (`/opt/tur-secondhand`, containers, nginx configs) completely
      untouched and running — nothing stopped/removed there.
- [x] All 4 domains (tur/tur2/tur3/tur4) are now fully live on the new host with valid TLS.
      Kamatera's tur-secondhand containers now join the same Phase 7 ("Decommission
      Kamatera") already tracked in
      [migration_to_one.com_host_todo.md](migration_to_one.com_host_todo.md) — **that phase can
      now proceed for the whole box**, not just the main site (still recommend a short grace
      period + a manual cart→checkout walkthrough on the new host before fully decommissioning).
- [x] Updated `/memories/repo/kamatera-deployment.md` with the new host's tur-secondhand port
      layout, deploy-key name, and the WooCommerce/WP-core-auto-update + CI-race gotchas.
