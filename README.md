# Phoenix Fire Labs website

Next.js App Router marketing site for Phoenix Fire Labs. See DESIGN.md for the
product narrative and AGENTS.md repository memory for durable tooling lessons.

## Quickstart

Requires Node 20+ and Yarn 4.18.0 (pinned via `packageManager`; 4.13.0 cannot
install TypeScript 7).

```sh
yarn install
cp .env.example .env.local   # fill PREVIEW_SESSION_SECRET + PREVIEW_PASSWORD_HASH
node scripts/jsonld-hash.mjs # -> NEXT_PUBLIC_JSONLD_HASH in .env.local (computed, not yet CSP-enforced)
yarn dev
```

## Commands

```sh
yarn dev         # local dev
yarn typecheck   # tsc --noEmit
yarn test        # vitest run (safeRedirect, preview gate, product registry, briefing)
yarn build       # production build (set NEXT_PUBLIC_JSONLD_HASH first)
yarn lint        # oxlint (clean on src/scripts; golden-master archive excluded)
node scripts/preview-hash.mjs '<password>'  # mint PREVIEW_PASSWORD_HASH
node scripts/jsonld-hash.mjs                # recompute the JSON-LD hash after structured-data edits
#                                            (computed only; see AGENTS.md - it is not enforced in the CSP yet)
```

## Routes

- `/`, `/mockingbird`, `/osprey`, `/technology` — Phoenix system story
- `/contact` + `POST /api/contact` — briefing intake (zod validation, honeypot +
  4s dwell bot filter, silent accept, `BRIEFING_INBOX` webhook routing)
- `/resources`, `/resources/wildfire-operational-intelligence` — sourced figures
  with labeled commercial estimates and TAM-sensitivity ceiling (never a summed TAM)
- `/login` + `POST /api/preview/login` — private preview gate (kept after launch)
- `/llms.txt`, `/robots.txt`, `/sitemap.xml` — machine surfaces

## Preview gate

The site is gated until launch (`SITE_PREVIEW_GATED=true`). Password is stored
as scrypt hash (`PREVIEW_PASSWORD_HASH`); sessions are 24h HMAC tokens in a
`__Host-` cookie. Rotate `PREVIEW_SESSION_SECRET` to revoke all sessions.
`POST /api/contact` has an in-process allowance (20/10min/IP); `POST
/api/preview/login` needs the Vercel WAF rule (10 attempts/min/IP,
observe-first) because login has no in-process limiter by design.

## Launch

See `docs/launch-runbook.md`. One variable flip (`SITE_PREVIEW_GATED=false`) +
redeploy; verify the runbook's route/header checklist.

## Product truth

`src/lib/product-status.ts` is the canonical maturity registry. Copy,
navigation, `llms.txt`, and structured data all read from it.
