# Launch runbook

## Gated (current)

- `SITE_PREVIEW_GATED=true` (or unset): `src/proxy.ts` redirects unauthenticated
  requests to `/login`; `X-Robots-Tag: noindex, nofollow` on all responses;
  layout metadata `noindex`; `robots.ts` disallows `/`; `sitemap.ts` returns `[]`.
- Required: `PREVIEW_SESSION_SECRET` (32+ random hex bytes),
  `PREVIEW_PASSWORD_HASH` (`yarn preview:hash`), `NEXT_PUBLIC_JSONLD_HASH`
  (`node scripts/jsonld-hash.mjs`), `BRIEFING_INBOX` webhook for qualified posts.

## Launch

1. Set `SITE_PREVIEW_GATED=false` in the Vercel project environment.
2. Redeploy. Verify: `/` returns 200 without a cookie; no `X-Robots-Tag` header;
   `/robots.txt` allows `/` and excludes `/login` + `/api/`; `/sitemap.xml`
   lists `/`, `/mockingbird`, `/osprey`, `/technology`, `/company`, `/careers`,
   `/resources`, `/resources/wildfire-operational-intelligence`, `/solutions`,
   `/solutions/incident-command`, `/solutions/operations-planning`,
   `/solutions/utility-wildfire`, `/contact`, `/privacy`, `/terms`.
3. Keep the preview auth code in place: `/login` and `/api/preview/login` remain
   for private sharing even after the site-wide gate opens.
4. Vercel WAF: keep `POST /api/preview/login` at 10 attempts/min/IP
   (observe-first, then enforce) and add the same envelope for
   `POST /api/contact` (start at 20/10min/IP, tune from logs).

## Rollback

Set `SITE_PREVIEW_GATED=true` and redeploy. The gate, noindex headers, and
empty sitemap return immediately; rotating `PREVIEW_SESSION_SECRET` revokes
all sessions.
