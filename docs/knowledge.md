# Engineering knowledge

<!-- trace:v1 id=doc.knowledge -->

## Next env files mangle $ in values; only backslash-escaping survives

<!-- trace:v1 id=CONSTRAINT-PHO-4Z4S5RG7 type=constraint state=ACTIVE work=WORK-PHO-18KENMFK applies_to=impl.preview-auth -->

<!-- trace:inherit CONSTRAINT-PHO-4Z4S5RG7 reason="template section" -->
### Constraint

A secret containing `$` cannot be stored unescaped in any Next `.env*` file. Escape every `$` as `\$`.

<!-- trace:inherit CONSTRAINT-PHO-4Z4S5RG7 reason="template section" -->
### Rationale

`@next/env` runs dotenv-expand over `.env*` files, so `$16384` and `$8` inside a scrypt PHC string (`scrypt$16384$8$1$salt$key`) expand as variable references and the value loads as `scrypt6384` (10 chars). The preview password could not work at all locally.

Verified against `@next/env` directly, one variant per process because `loadEnvConfig` caches:

- bare `scrypt$16384$...` -> "scrypt6384"
- single-quoted -> "scrypt6384"
- double-quoted -> "scrypt6384"
- `$$` doubled -> "scrypt6384"
- backslash `scrypt\$16384\$...` -> correct

Quoting does NOT protect the value; only `\$` does. `scripts/preview-hash.mjs` prints the escaped env line when run on a TTY.

<!-- trace:inherit CONSTRAINT-PHO-4Z4S5RG7 reason="template section" -->
### Consequence

The gate silently compares against a 10-character string. Nothing errors: login just always fails, and the stored hash looks plausible in `grep` output.

<!-- trace:inherit CONSTRAINT-PHO-4Z4S5RG7 reason="template section" -->
### Applies to

`PREVIEW_PASSWORD_HASH` in `.env.local`, `.env.example`, and any env file an e2e run writes.

Second, separate trap: values in `.env*` files OVERRIDE the process environment for `next start`. Passing a value via a shell prefix or Playwright `webServer.env` loses to whatever `.env.local` contains. Precedence for `next start` is `.env.production.local` > `.env.local` > `.env.production` > `.env`, so pinning credentials for a test run requires writing `.env.production.local`.

## Applying reveal classes before hydration strands elements at opacity 0

<!-- trace:v1 id=ANTI-PHO-CZB57TRX type=anti_pattern state=ACTIVE work=WORK-PHO-18KENMFK applies_to=impl.motion-reveal -->

<!-- trace:inherit ANTI-PHO-CZB57TRX reason="template section" -->
### Pattern

A streaming inline `<script>` in the body walks `.reveal` elements, adds `.visible`, and calls `observer.unobserve(target)`.

<!-- trace:inherit ANTI-PHO-CZB57TRX reason="template section" -->
### Why

It looks correct — SSR markup gets the class immediately, so the first paint is right.

<!-- trace:inherit ANTI-PHO-CZB57TRX reason="template section" -->
### Consequence

React hydrates afterwards, sees markup that disagrees with what it rendered, and reconciles `.visible` away. The observer has already unobserved those elements, so nothing ever re-adds it and `.reveal { opacity: 0 }` becomes permanent. About 70% of the homepage rendered blank. The only console signal was a hydration-mismatch warning naming a `className` diff; `next build`, `tsc` and the unit suite were all green.

A second instance of the same class of bug: the observer effect ran only on mount. Next keeps the root layout mounted across client-side navigation, so every in-app `<Link>` produced a page whose `.reveal` nodes were never observed — clicking the logo back to home showed a blank page.

<!-- trace:inherit ANTI-PHO-CZB57TRX reason="template section" -->
### Correct approach

Never mutate hydrated markup before hydration completes. Add `.visible` from a `useEffect` in a client component, and key that effect on `usePathname()` so it re-arms on every navigation.

Gate the hiding rules on a class stamped pre-paint from `<head>` (`js-anim` on `<html>`, with `suppressHydrationWarning` on that element). React does not reconcile script-added attributes on `<html>`, and a script-blocked or reduced-motion visit then renders the page fully visible instead of blank.

<!-- trace:inherit ANTI-PHO-CZB57TRX reason="template section" -->
### Applies to

Any scroll-reveal, theme, or animation system in the Next App Router that starts elements hidden.

## Playwright webServer runs before globalSetup and does not rebuild

<!-- trace:v1 id=FIND-PHO-CV73FEN2 type=finding state=ACTIVE work=WORK-PHO-18KENMFK -->

<!-- trace:inherit FIND-PHO-CV73FEN2 reason="template section" -->
### Context

The e2e suite was red for reasons unrelated to the code under test, and fixes appeared not to work.

<!-- trace:inherit FIND-PHO-CV73FEN2 reason="template section" -->
### Finding

Two independent traps in `playwright.config.ts`:

1. `webServer` is launched BEFORE `globalSetup` runs. Writing an env file from globalSetup is too late — the server has already read its environment. The write has to happen at config module load.
2. `webServer: { command: "yarn start" }` serves whatever is already in `.next`. Nothing rebuilds, so the suite silently tests a stale binary and code that was just fixed keeps failing.

Trap 2 cost the most time: a RadioToMap fix was verified correct in the browser while the e2e suite kept failing against a build from before the edit.

<!-- trace:inherit FIND-PHO-CV73FEN2 reason="template section" -->
### Evidence

Verified by probing a route that echoed `request.url`, `host` and the loaded env inside the running e2e server, and by observing the suite pass only after `command` became `yarn build && yarn start`.

<!-- trace:inherit FIND-PHO-CV73FEN2 reason="template section" -->
### Consequence

Green-looking local checks and a red suite that cannot be debugged by reading the source, because the source under test is not the source on disk.

<!-- trace:inherit FIND-PHO-CV73FEN2 reason="template section" -->
### Applies to

`playwright.config.ts` — keep `yarn build &&` in the webServer command and pin credentials at module load, not in globalSetup.

## request.url in Next route handlers normalizes the hostname

<!-- trace:v1 id=FIND-PHO-GPJ0HNCV type=finding state=ACTIVE work=WORK-PHO-18KENMFK applies_to=impl.same-origin -->

<!-- trace:inherit FIND-PHO-GPJ0HNCV reason="template section" -->
### Context

A CSRF origin check compared the `Origin` header against `new URL(request.url).origin` and rejected every legitimate login.

<!-- trace:inherit FIND-PHO-GPJ0HNCV reason="template section" -->
### Finding

Inside a Next route handler, `request.url` does not carry the host the client actually addressed. A request to `http://127.0.0.1:3119` arrives with `request.url` reading `http://localhost:3119`, while the `Host` header correctly reads `127.0.0.1:3119`.

<!-- trace:inherit FIND-PHO-GPJ0HNCV reason="template section" -->
### Evidence

Probe route returning both values:

```json
{"requestUrl":"http://localhost:3119/api/originprobe","host":"127.0.0.1:3119","origin":"http://127.0.0.1:3119"}
```

Login returned 403 on `127.0.0.1` and 303 on `localhost` — the same site, one alias apart.

<!-- trace:inherit FIND-PHO-GPJ0HNCV reason="template section" -->
### Consequence

Any same-origin comparison built on `request.url` rejects real traffic on whichever alias the framework does not normalize to, and redirects built from it can point at the wrong host.

<!-- trace:inherit FIND-PHO-GPJ0HNCV reason="template section" -->
### Applies to

Compare `Origin`/`Referer` against the `Host` header (preferring `x-forwarded-host`), which is the OWASP recommendation. For redirects, prefer a relative `Location` — RFC 7231 allows it and the browser resolves it against the host it actually asked.

## Login throttling must count failures, not attempts

<!-- trace:v1 id=LEARN-PHO-GRY2TCGV type=learning state=ACTIVE work=WORK-PHO-18KENMFK applies_to=impl.rate-limit -->

<!-- trace:inherit LEARN-PHO-GRY2TCGV reason="template section" -->
### Context

Added a 10/min/IP limiter to the preview login per spec §37. The e2e suite immediately went red with 429s.

<!-- trace:inherit LEARN-PHO-GRY2TCGV reason="template section" -->
### Finding

The limiter counted every attempt, including successful ones. Thirteen legitimate logins from one address exhausted the budget. That was not a test artifact: it would lock out any shared office IP, VPN exit, or NAT gateway for people entering the **correct** password — a denial of service against exactly the people the gate exists to admit.

Locally the effect is amplified because `x-forwarded-for` is absent, so every caller collapses into one `unknown` bucket.

<!-- trace:inherit LEARN-PHO-GRY2TCGV reason="template section" -->
### Correct approach

Check the budget before verifying, record only on failure, and clear the key on success. Brute-force protection is about slowing guessing, not about punishing someone who then authenticated correctly.

Refuse before the scrypt call so the 16 MiB derivation cannot be used as a remote CPU-burn primitive.

<!-- trace:inherit LEARN-PHO-GRY2TCGV reason="template section" -->
### Consequence

The failing e2e run was the signal that the security control was wrong, not that the tests were wrong. Worth pausing on when a new control makes legitimate traffic fail.

<!-- trace:inherit LEARN-PHO-GRY2TCGV reason="template section" -->
### Applies to

`src/lib/rate-limit.ts` and any future auth endpoint. Note the limiter is per-isolate memory — a tripwire, not a control; the durable rule is a platform WAF policy that is still not checked in.

Two further defects reviewers found in the same limiter, both worth checking in any implementation:

**The bucket grew while refusing.** Every request reached `recent.push(now)`, including requests already over budget, so a caller being actively refused could grow its own array without bound and make each later prune more expensive. Under attack the limiter amplified the attack. Stop recording once the bucket is full.

**Silent success is worse than an error.** The contact endpoint answered a throttled submission with `ok: true` and discarded it, on the theory that telling a bot it was throttled leaked information. For a human on a shared agency NAT that meant being told "Received" while the briefing went nowhere — the worst outcome for exactly the audience the form exists to serve. A bot can infer throttling anyway. Return 429 with a message and a direct-contact fallback.

Generalizing: never report success for work you dropped. If a request cannot be honoured, the caller has to be able to tell.

## Clearing trace hook obligations and binding test evidence

<!-- trace:v1 id=CONV-PHO-TP1RBRP1 type=convention state=ACTIVE work=WORK-PHO-18KENMFK -->

<!-- trace:inherit CONV-PHO-TP1RBRP1 reason="template section" -->
### Convention

Two trace operations that are not discoverable from the error text:

**Excluding files from enforcement.** Hand-editing `discovery.exclude` in `.trace/trace.toml` stops indexing but does NOT clear the stop hook obligation ledger — the hook kept blocking on a file that `trace verify` had stopped reporting. The command `trace ignore` writes to `.trace/policy.toml`, and its help is explicit that exclusions skip boundary enforcement "(TL012/TL013, hooks, Reviewdog)". Use it for anything a hook blocks on.

Caveat: `trace ignore --file .pyre_configuration` silently does nothing, because the tool strips leading dots (`.bughunt` is stored as `bughunt`). Use `--glob ".pyre_configuration"` for dotfiles and verify the entry landed in `policy.toml` rather than trusting the command output.

**Binding test evidence (TL021).** Ingesting JUnit XML alone reports "0 execution edges" — Playwright and vitest suite names do not map to trace node ids, so nothing binds and TL021 persists. The working path is a `tracelayer-evidence/v1` JSON file where each entry carries a `trace_id`:

```json
{"schema":"tracelayer-evidence/v1","run_id":"...","revision":"<git sha>","status":"pass",
 "tests":[{"framework_id":"e2e/regressions.spec.ts","outcome":"pass","trace_id":"test.e2e-regressions"}]}
```

`scripts/evidence.mjs` generates this from the JUnit reports so outcomes come from real runs. Then `trace evidence ingest --normalized evidence.json --revision $(git rev-parse HEAD)`.

<!-- trace:inherit CONV-PHO-TP1RBRP1 reason="template section" -->
### Rationale

Merge-grade verification needs `verifies=` edges (TL020), reviewed nodes (TL011/TL110), and bound evidence (TL021). Each has a different remedy and the diagnostics do not say which.

Two more steps the diagnostics do not name:

**Tasks block the merge gate.** `trace task bootstrap` turns each `plan.steps` entry into a TASK in `docs/implementation-plans/<slug>.md`, all `state=TODO`. They stay TODO until marked, and an unmarked task blocks finalization even when `trace verify` passes. Close each with `trace task state TASK-… --to DONE`, then `trace task finish` — **not** `trace task finish --auto`; the hook's wording names a flag this version does not have.

**Markers need a declaration to attach to.** In a TypeScript module whose `structural_attachment` is `file`, a `trace:v1` marker directly above a bare `export const` reports TL003 "detached or ambiguous", and adding a second marker for the second export does not help. It attaches to a declaration the parser recognises — an `interface`, `function` or `class`. `src/content/resources.ts` works because its first export is an interface; `src/content/transcript.ts` only passed once it exported a named `ExtractedField` interface for the marker to sit on. Naming the type was the right change anyway, so this is worth doing properly rather than working around.

Related: hand-authored section headings in this file must each be preceded by

```
<!-- trace:inherit <NODE-ID> reason="template section" -->
```

`knowledge-capture` emits that line for every body heading (`_nest_body_sections`), which is what makes sections read as parts of the captured node rather than untraced siblings. Adding a heading by hand without it leaves a pending stop-hook obligation per heading, while `trace verify` still reports pass — so verify cannot be used to check this.

`trace index` appears to clear it and does not: the obligation returns on the next edit to the file. Grep for `trace:inherit`, not `trace:v1`, when comparing against a tool-generated entry.

<!-- trace:inherit CONV-PHO-TP1RBRP1 reason="template section" -->
### Examples

Order that worked: add honest `verifies=` edges -> `trace review <node>` for each stale test node -> run the suites with JUnit reporters -> generate normalized evidence -> ingest -> gitignore the artifacts.

Two further details, learned by hitting them a second time:

**Evidence is bound to a revision, so ingest last.** `trace evidence ingest --revision <sha>` binds to that exact commit. Finalizing, then making one more commit, re-opens TL021 immediately -- the receipts no longer match HEAD and `trace task finish` blocks again with no new test failure. Do the ingest-and-finish sequence after the final commit of a change set, not in the middle of one.

**Stale nodes come from touching the file, not the node.** Appending a new entry to the end of this file staled three unrelated nodes near the top (`ANTI-`, `CONSTRAINT-`, `LEARN-`), because staleness is computed per file rather than per node. `trace review <id>` moves each STALE_REVIEW_REQUIRED node to REVIEWED_NEEDS_VERIFICATION and is a claim that the content is still correct, so read the node before reviewing it -- the whole point is defeated by acknowledging blind.

<!-- trace:inherit CONV-PHO-TP1RBRP1 reason="template section" -->
### Applies to

Any session that has to reach `verify: pass` at `--lifecycle merge`.

## Triaging BugHunt: which signal classes apply to this stack

<!-- trace:v1 id=FIND-PHO-Z5J6NS1S type=finding state=ACTIVE work=WORK-PHO-32N4ZH5K -->

<!-- trace:inherit FIND-PHO-Z5J6NS1S reason="template section" -->
### Context

`bughunt skipmutmut` reports ~2649 findings, 1799 of them in src/e2e/scripts. Re-triaging that volume from scratch every run is wasteful, and several of the largest classes would be actively harmful to "fix".

<!-- trace:inherit FIND-PHO-Z5J6NS1S reason="template section" -->
### Finding

BugHunt deliberately runs its own maximal analyzer config (`.bughunt/configs/oxlintrc.json` enables the `restriction`, `pedantic` and `nursery` categories), not the project’s curated `.oxlintrc.json` (24 explicit rules, no categories). It over-reports by design and expects an agent to triage.

Signal classes that do **not** apply here, with the evidence:

- `react(react-in-jsx-scope)` — 862 findings. `tsconfig.json` sets `"jsx": "react-jsx"`, the automatic runtime, and zero files import React. Adding the import would contradict the compiler setting.
- `react(jsx-no-literals)` — 299. Would require wrapping every piece of visible copy in braces on a marketing site.
- `import(no-default-export)` / `react(jsx-filename-extension)` — the Next.js App Router *requires* a default export per route file.
- `oxc(no-async-await)`, `oxc(no-optional-chaining)`, `oxc(no-rest-spread-properties)` — ES5-targeting restriction rules; this project targets modern browsers.
- `eslint(no-undef)` for `window` / `Response` — BugHunt’s generated eslint config lacks the browser/node env; the project’s own lint resolves these.

Classes that **were** real and have been fixed: FormData `String(File)` coercion in the login route, `Date.now()` during render, setState-in-effect in MobileMenu, an IntersectionObserver whose cleanup did not own its allocation, a deprecated `z.string().email()`, `Array.includes` inside a filter, index-based React keys, render-blocking Google Fonts `<link>`, the full `motion` import, duplicated transcript data across two pages, and dead exports that were never wired.

<!-- trace:inherit FIND-PHO-Z5J6NS1S reason="template section" -->
### Evidence

`grep -rl "^import React" src/` returns nothing; `grep \x27"jsx"\x27 tsconfig.json` returns `"jsx": "react-jsx"`.

<!-- trace:inherit FIND-PHO-Z5J6NS1S reason="template section" -->
### Consequence

Do not run `bughunt debt snapshot` to go green — it freezes every finding including the real ones, which is the baseline-freeze `ci-fix-dont-freeze` forbids. Triage by signal class instead: fix the correctness classes, and check a large class against the framework config before treating it as a defect.

<!-- trace:inherit FIND-PHO-Z5J6NS1S reason="template section" -->
### Applies to

Any future `bughunt` run on this repository.

## Auditing a design scale by measuring, not reading CSS

<!-- trace:v1 id=CONV-PHO-J2ZFNQKJ type=convention state=ACTIVE work=WORK-PHO-32N4ZH5K -->

<!-- trace:inherit CONV-PHO-J2ZFNQKJ reason="template section" -->
### Convention

To check whether spacing and type are actually standardized, measure computed styles across every route and count distinct values per property. Reading the stylesheet does not surface the problem, because the drift comes from *which* class each page reaches for, not from the declarations themselves.

The check that found it:

```js
for (const route of routes) {
  await page.goto(base + route);
  const m = await page.evaluate(() => ({
    h1: getComputedStyle(document.querySelector("h1")).fontSize,
    h2: getComputedStyle(document.querySelector(".section-heading")).fontSize,
  }));
}
// then: distinct values per property must be 1
```

Result on this repo before the fix: `h1` measured **60px, 48px and 36px** on different routes, `h2` two sizes. Three parallel heading systems had grown up — `.hero-headline`, `.page-hero h1`, and `.section-heading` used as an `h1` on `/terms`, `/privacy` and `/contact`. Every individual rule looked reasonable in isolation.

<!-- trace:inherit CONV-PHO-J2ZFNQKJ reason="template section" -->
### Rationale

A page that reaches for the wrong class renders a semantically correct `h1` at a visually subordinate size. Nothing in lint, typecheck or the build notices, and a human reading `globals.css` sees a tidy set of rules. Only measurement across routes exposes it.

The durable fix is a token scale (`--text-display`, `--text-h2`, `--text-lede`, `--text-body`, `--space-section-y`, `--space-gutter`) that every rule resolves to, so a new page cannot introduce a one-off size. `grep -c "font-size: clamp("` reaching zero is the signal that the migration is complete.

<!-- trace:inherit CONV-PHO-J2ZFNQKJ reason="template section" -->
### Examples

`e2e/regressions.spec.ts` keeps the invariant: "headings render at one size across every page" walks six routes and asserts one distinct computed size per heading role. It fails loudly if a future page invents its own heading class.

<!-- trace:inherit CONV-PHO-J2ZFNQKJ reason="template section" -->
### Applies to

Any claim that a site is visually consistent. Measure it.

## Self-hosting fonts with next/font removes a render block and two CSP origins

<!-- trace:v1 id=FIND-PHO-AEMQDNMC type=finding state=ACTIVE work=WORK-PHO-32N4ZH5K -->

<!-- trace:inherit FIND-PHO-AEMQDNMC reason="template section" -->
### Context

react-doctor flagged `layout.tsx` for loading Google Fonts through a `<link>`, which blocks first render on a third-party round-trip and shifts layout when the faces swap in.

<!-- trace:inherit FIND-PHO-AEMQDNMC reason="template section" -->
### Finding

Moving to `next/font/google` fixes three things at once, not one:

1. The faces are downloaded at build time and served from `/_next/static/media/*.woff2`, so there is no third-party request on the critical path and no swap-in shift.
2. The `<link rel="preconnect">` pair and the stylesheet `<link>` disappear from `<head>` entirely.
3. Because nothing loads from `fonts.googleapis.com` or `fonts.gstatic.com` any more, the CSP can drop both origins: `style-src` and `font-src` become `\x27self\x27`.

The third is easy to miss — the CSP keeps working with the origins listed, so nothing forces the cleanup, and a stale allowance stays in the header indefinitely.

<!-- trace:inherit FIND-PHO-AEMQDNMC reason="template section" -->
### Evidence

After the change, the served homepage contains no `fonts.googleapis.com` or `fonts.gstatic.com` reference, two local `.woff2` files, and the response header reads `style-src \x27self\x27 \x27unsafe-inline\x27; font-src \x27self\x27`.

<!-- trace:inherit FIND-PHO-AEMQDNMC reason="template section" -->
### Consequence

One gotcha: `axes` is only valid on a variable font when no static `weight` list is given. `Fraunces({ axes: ["opsz"], weight: [...] })` fails the build with "Axes can only be defined for variable fonts when the weight property is nonexistent or set to `variable`".

Expose each family with `variable: "--font-x"` and map it in CSS (`--font-display: var(--font-fraunces), "Fraunces", Georgia, serif`) so the literal name survives as a fallback.

<!-- trace:inherit FIND-PHO-AEMQDNMC reason="template section" -->
### Applies to

`src/app/layout.tsx`, `src/app/globals.css` font tokens, and the CSP in `next.config.ts` — when font delivery changes, re-check the CSP.

## Shared chrome in the root layout leaks the private site to the gate page

<!-- trace:v1 id=ANTI-PHO-ZJ1SB425 type=anti_pattern state=ACTIVE work=WORK-PHO-MB4M5AH6 applies_to=impl.app-shell -->

<!-- trace:inherit ANTI-PHO-ZJ1SB425 reason="template section" -->
### Pattern

Put `SiteHeader`, `SiteFooter` and the site-wide `metadata` in `src/app/layout.tsx`, then add an authentication or preview-gate route at `src/app/login/`.

<!-- trace:inherit ANTI-PHO-ZJ1SB425 reason="template section" -->
### Why

It looks like the obvious place: one layout, every page gets the chrome, and `metadata` inheritance means each route only overrides its `title`.

<!-- trace:inherit ANTI-PHO-ZJ1SB425 reason="template section" -->
### Consequence

The gate inherits all of it. On this repository an unauthenticated visitor to `/login` — the one page a stranger can reach — received **64 mentions of the six product names**, because the header dropdown, the footer sitemap and the inherited `description` / `keywords` / `og:description` / `twitter:description` all enumerate the product family. The gate existed specifically to withhold that positioning.

Overriding only `title` is not enough; `metadata` merges field by field, so the marketing `description` and social cards survive into the gated page unless each is overridden explicitly.

A reviewer caught this. It was invisible locally because every manual check was made while authenticated.

<!-- trace:inherit ANTI-PHO-ZJ1SB425 reason="template section" -->
### Correct approach

Move the marketing routes into a route group (`src/app/(site)/`) whose layout owns the chrome, and leave the gate outside it. The root layout keeps only the document shell — `html`, `body`, fonts, the pre-paint script. The gate then supplies its own minimal header and footer and overrides `description`, `keywords`, `openGraph` and `twitter`.

Verify by scraping the gate unauthenticated rather than by reading the code:

```
curl -s http://host/login | grep -oE "Product1|Product2|..." | sort | uniq -c
```

Expect no output. An e2e test asserts this over the whole product registry, so a new product cannot reintroduce the leak.

<!-- trace:inherit ANTI-PHO-ZJ1SB425 reason="template section" -->
### Applies to

Any Next.js App Router site with a login, paywall or preview gate and shared chrome. The same reasoning covers generated social images: a dynamic `opengraph-image` route renders the headline and product names, so exempting it from the gate publishes the same content.

## oxlint exits 0 when its config cannot be parsed

<!-- trace:v1 id=FIND-PHO-HYW0H29T type=finding state=ACTIVE work=WORK-PHO-MB4M5AH6 -->

<!-- trace:inherit FIND-PHO-HYW0H29T reason="template section" -->
### Context

A stray key was added to `.oxlintrc.json`. The next `yarn lint` reported zero errors, and a previously-reported error had disappeared.

<!-- trace:inherit FIND-PHO-HYW0H29T reason="template section" -->
### Finding

`oxlint` writes `Failed to parse oxlint configuration file` and then **exits 0, having linted nothing**. The lint gate becomes a silent no-op that CI reports as green.

This is worse than a normal failure because the signal inverts: a broken config looks exactly like a clean codebase. It was caught only because a real error vanished after a change that touched no TypeScript.

Related trap in the same file: `.oxlintrc.json` accepts JSONC comments, but an unknown top-level key is rejected outright. Record rationale as a comment, never as a `$note`-style key.

<!-- trace:inherit FIND-PHO-HYW0H29T reason="template section" -->
### Evidence

```
$ yarn lint            # with a bogus key
Failed to parse oxlint configuration file.
  x unknown field `$note_...`, expected one of `$schema`, `plugins`, ...
$ echo $?
0
```

<!-- trace:inherit FIND-PHO-HYW0H29T reason="template section" -->
### Consequence

Any check whose tool can fail silently needs its own assertion. `scripts/lint.mjs` now runs oxlint, forwards the output, and exits 1 if the parse-failure string appears. Verified against three cases: valid config passes, broken config fails, and a real lint error is still reported.

<!-- trace:inherit FIND-PHO-HYW0H29T reason="template section" -->
### Applies to

`yarn lint`. More generally: when wiring a quality gate, test that it **fails** when it should, not only that it passes. A gate never observed failing is not known to work.

## storageState is not a Chromium profile, so Lighthouse audited the login page

<!-- trace:v1 id=FIND-PHO-KWDMDNBT type=finding state=ACTIVE work=WORK-PHO-MB4M5AH6 -->

<!-- trace:inherit FIND-PHO-KWDMDNBT reason="template section" -->
### Context

`scripts/lighthouse.mjs` seeded a preview session with Playwright, then handed the directory to chrome-launcher as a `userDataDir` and ran Lighthouse against the homepage.

<!-- trace:inherit FIND-PHO-KWDMDNBT reason="template section" -->
### Finding

`context.storageState({ path: dir + "/state.json" })` writes **Playwright own cookie/origin JSON**. It does not turn the containing directory into a Chromium user-data profile. chrome-launcher therefore started a clean, unauthenticated browser, the gate redirected it to `/login`, and Lighthouse scored the login page while reporting the homepage URL.

Nothing failed. The scores looked plausible, which is why it survived review until a reviewer read the mechanism rather than the output.

A wrong password behaved the same way: the seeding step failed, the script continued, and the audit ran anyway.

<!-- trace:inherit FIND-PHO-KWDMDNBT reason="template section" -->
### Evidence

After switching to `chromium.launchPersistentContext(dir)` — which does write a real profile — and asserting the homepage rendered before auditing, the scores changed to 0.97 performance / 0.96 accessibility / 1.0 best-practices. A deliberately wrong password now exits with `preview login failed: ... did not render the homepage`.

<!-- trace:inherit FIND-PHO-KWDMDNBT reason="template section" -->
### Consequence

Any audit run behind an auth gate has to prove it is authenticated before measuring. Assert on page content, not on the absence of an error.

<!-- trace:inherit FIND-PHO-KWDMDNBT reason="template section" -->
### Applies to

`scripts/lighthouse.mjs`, and any tool handed a "profile" directory produced by something other than the browser itself.

## Redirecting an analyzer's report into the checkout can destroy its own config

<!-- trace:v1 id=FIND-PHO-RPTCLOB1 type=finding state=ACTIVE work=WORK-PHO-JG8WSYBA -->

<!-- trace:inherit FIND-PHO-RPTCLOB1 reason="template section" -->
### Context

Wiring knip into CI. The natural-looking form is `yarn knip --reporter json > knip.json`, because the tool is knip and the report is JSON.

<!-- trace:inherit FIND-PHO-RPTCLOB1 reason="template section" -->
### Finding

`knip.json` is knip's **configuration** file. The redirect truncated it before knip started, so knip read a zero-byte file and failed with `Error parsing /.../knip.json`. The report destroyed the config that produced it.

The shell opens the redirect target before the command runs, so this is not a race and cannot be fixed by ordering. The general shape: a tool named X, configured by `X.json`, asked to write its report to `X.json`.

This cannot reproduce when the report is consumed from a pipe, which is how it was exercised locally, so the tree stayed clean and the bug only appeared in CI.

<!-- trace:inherit FIND-PHO-RPTCLOB1 reason="template section" -->
### Evidence

```
ERROR: Error loading /home/runner/work/phoenixwebsite/phoenixwebsite/knip.json
Reason: Error parsing /home/runner/work/phoenixwebsite/phoenixwebsite/knip.json
```

<!-- trace:inherit FIND-PHO-RPTCLOB1 reason="template section" -->
### Consequence

Every analyzer in `.github/workflows/analyzers.yml` writes its report to `"$RUNNER_TEMP"`, never into the checkout. A report is build output; the checkout is input.

Corollary found in the same run: when a report file is missing, `cmd < missing.json` fails at the redirect and reviewdog receives empty input, reporting a confusing `proto: syntax error` rather than the real cause.

<!-- trace:inherit FIND-PHO-RPTCLOB1 reason="template section" -->
### Applies to

Any CI step redirecting tool output to a path inside the repository. Write reports outside the checkout, and prefer a pipe when the consumer can take one.

## typescript-eslint cannot run against TypeScript 7

<!-- trace:v1 id=FIND-PHO-TSE7BLCK type=finding state=ACTIVE work=WORK-PHO-JG8WSYBA -->

<!-- trace:inherit FIND-PHO-TSE7BLCK reason="template section" -->
### Context

Adding the type-aware lint rules oxlint could not express, via an `eslint.config.mjs` using `typescript-eslint`. It worked locally for an entire session: it linted, and it reported real `@typescript-eslint/require-await` findings.

<!-- trace:inherit FIND-PHO-TSE7BLCK reason="template section" -->
### Finding

`typescript-eslint` reads `ts.versionMajorMinor` at import time and **throws outright** when the major version is 7 or above. This project is pinned to TypeScript 7.0.2, so a clean install can never run it. Upstream tracking is typescript-eslint#10940.

It appeared to work because `node_modules` was stale. The first `yarn install --immutable` after a branch change repaired the tree to what the lockfile actually pins, and every ESLint invocation began throwing. CI installs from the lockfile every time, so CI would have failed on arrival.

oxlint's `--type-aware` mode (the `oxlint-tsgolint` package) covers the same rule family and is built on the typescript-go engine TypeScript 7 itself uses, so it has no such conflict. It found two genuine defects immediately: an `await` on chrome-launcher's `kill()`, which returns `void`, and an `async` function with no `await`.

<!-- trace:inherit FIND-PHO-TSE7BLCK reason="template section" -->
### Evidence

```
$ npx eslint .
typescript-eslint does not support TS 7.0.
Error: typescript-eslint does not support TS 7.0.
    at Object.<anonymous> (node_modules/typescript-eslint/dist/index.js:52:11)
$ node -e "console.log(require.resolve('typescript',{paths:['./node_modules/typescript-eslint']}))"
/Users/rocket/phoenixwebsite/node_modules/typescript/package.json 7.0.2
```

<!-- trace:inherit FIND-PHO-TSE7BLCK reason="template section" -->
### Consequence

Type-aware linting runs through `yarn lint` (`oxlint --type-aware`). AGENTS.md records this so the eslint route is not attempted again.

<!-- trace:inherit FIND-PHO-TSE7BLCK reason="template section" -->
### Applies to

Any tool that reaches into the TypeScript compiler API on this repository. More generally: a green local run proves nothing when `node_modules` has drifted from the lockfile. Before trusting a newly wired gate, reinstall from the lockfile and run it again -- that is what CI does.


## Vercel without Corepack runs Yarn 1, which silently discards --immutable

<!-- trace:v1 id=FIND-PHO-YRN1IMTB type=finding state=ACTIVE work=WORK-PHO-JG8WSYBA -->

<!-- trace:inherit FIND-PHO-YRN1IMTB reason="template section" -->
### Context

A production build log showed a 241-second install and a wall of peer-dependency warnings. `package.json` pins `"packageManager": "yarn@4.18.0"` and `vercel.json` ran `yarn install --immutable`, so both looked correct.

<!-- trace:inherit FIND-PHO-YRN1IMTB reason="template section" -->
### Finding

Vercel honours `packageManager` only when Corepack is enabled. Without it the builder runs its bundled **yarn 1.22.19**, which cannot read a Yarn 4 lockfile (`__metadata: version: 10`). It ignored `yarn.lock` entirely, re-resolved the whole tree from the registry, and wrote its own lockfile -- which is what the slow install and the warnings actually were.

The serious part is not the speed. **`--immutable` is not a Yarn 1 flag, and Yarn 1 ignores unknown flags without complaint.** So the deployed dependency tree was whatever the registry resolved at build time, not what the lockfile pinned, while the configuration read as though integrity were enforced. Nothing in the log says the flag was dropped.

`corepack yarn install --immutable` fixes it without depending on the `ENABLE_EXPERIMENTAL_COREPACK` project variable and without `corepack enable` mutating global shims. `COREPACK_ENABLE_DOWNLOAD_PROMPT=0` stops Corepack prompting before it fetches the pinned version on a non-TTY builder. `buildCommand` needs the same treatment or the build step falls back to Yarn 1 after a Yarn 4 install.

<!-- trace:inherit FIND-PHO-YRN1IMTB reason="template section" -->
### Evidence

Before:

```
Running "install" command: `yarn install --immutable`...
yarn install v1.22.19
warning package.json: No license field
[3/4] Linking dependencies...
success Saved lockfile.          <- rewrote the lockfile it could not read
Done in 241.54s.
```

After:

```
Running "install" command: `COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack yarn install --immutable`...
YN0000: · Yarn 4.18.0
YN0000: · Done with warnings in 11s 772ms
```

241.5s -> 11.8s, and the yarn-1 warning classes ("No license field", "Workspaces can only be enabled in private projects", the peer spam) disappear because they were artifacts of yarn 1 re-resolving.

<!-- trace:inherit FIND-PHO-YRN1IMTB reason="template section" -->
### Consequence

Check `yarn install --immutable` passes locally before enforcing it on a builder, so switching to a real immutable install cannot fail the deploy on pre-existing lockfile drift.

<!-- trace:inherit FIND-PHO-YRN1IMTB reason="template section" -->
### Applies to

`vercel.json`. Generally: confirm which package manager a hosted builder actually ran by reading its version line in the log, rather than inferring it from `packageManager`. A flag that the wrong tool silently drops is worse than one that errors -- the log looks like the guarantee is in force.
