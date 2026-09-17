# Anti-slop provenance

Vendored Oxlint plugin owned by this repository. Local edits here are policy, not drift.

## Source identity

- Skill bundle: `.agents/skills/install-anti-slop` (skills-lock.json: source `dmmulroy/anti-slop`, sourceType `github`, skillPath `skills/install-anti-slop/SKILL.md`, computedHash `4031728fbe75bdcad6ee3208fd52b5d66e167b056fefee1fa9758e9a6cb9c0c8`).
- Installed with: `node .agents/skills/install-anti-slop/scripts/install.mjs` (default destination `tools/oxlint/anti-slop/`).
- Exact upstream rule-source commit: unknown. The skill bundle carries no commit or version identifier for the rule source, so none is claimed. Verified pristine copy at install time: `diff -r` of skill assets vs installed tree reported identical.

## Installed plugin paths

- `tools/oxlint/anti-slop/index.ts` — generic plugin (`anti-slop`, 18 rules).
- `tools/oxlint/anti-slop/effect/index.ts` — opt-in Effect plugin (`anti-slop-effect`, 5 rules).
- Nested vendored dependency preserved untouched: `vendor/eslint-stylistic/{LICENSE,UPSTREAM.md,...}`.

## Dependencies and configuration

- `oxlint@1.83.0` and `@oxlint/plugins@1.83.0`, exact-pinned devDependencies (repository had no prior oxlint dependency; versions were npm current at install time).
- New `.oxlintrc.json`: all 18 generic rules plus native companion `oxc/no-accumulating-spread` at `error`; all 5 Effect rules at `error`, enabled per explicit request despite no direct `effect` dependency in package.json.
- Ignore patterns: skill list plus repo-local agent tooling dirs `.hermes/**` and `.omp/**`.
- `package.json`: added `"lint": "oxlint"` script. No other dependency ranges touched.

## Intentional deviations

None to the vendored source. Future updates follow the skill's update procedure (stage incoming, three-way merge against a recoverable base, preserve local policy).
