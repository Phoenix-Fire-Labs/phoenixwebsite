# Run BugHunt's individual analyzers as CI steps, not BugHunt itself

<!-- trace:v1 id=ADR-PHO-EB0ZJGD5 type=decision work=WORK-PHO-JG8WSYBA -->

## Status

Accepted

## Context

BugHunt only ever ran on a developer machine, so none of the 61 analyzers it
wraps gated a pull request.

The first instinct was to add `bughunt` itself as a CI job. That is the wrong
shape. BugHunt is a triage harness: it runs every analyzer at maximum
strictness, exits 0 regardless of findings, and reports roughly 2,600 on this
repository — about 1,750 of them from rules that contradict the stack
(`react-in-jsx-scope` against the automatic JSX runtime, `no-default-export`
against the App Router). A job wrapping it would either never fail, or fail
permanently, and it would install a large Python analysis stack on every run.

## Decision

Wire the individual analyzers that apply to this repository as their own CI
steps, each gating on its own exit code, and do not run BugHunt in CI.

BugHunt stays a local triage tool. Its value is discovering which analyzers are
worth having; once one is worth having, it belongs in CI on its own terms where
its failure is specific and actionable rather than one line in a 2,600-finding
report.

Every analyzer added must be green before it is wired. A gate that is red on
arrival teaches the team to ignore it.

## Consequences

A finding anywhere in the tree fails its job. `-filter-mode=nofilter` is
deliberate: restricting comments to changed lines would let an existing
violation survive indefinitely as long as nobody touched its line.

Each analyzer fails on its own terms, so a red check names the tool and the
finding rather than contributing one line to a 2,600-entry report.

Two constraints surfaced while wiring this and are recorded in AGENTS.md:

- typescript-eslint throws on import when `typescript` reports major >= 7, and
  this project is pinned to TypeScript 7.0.2, so the type-aware rules run
  through oxlint's tsgolint backend instead. A stale `node_modules` hides this
  until the next clean install.
- An analyzer that writes its report into the checkout can overwrite a config
  file of the same name. `knip --reporter json > knip.json` destroyed knip's own
  configuration. Reports go to `$RUNNER_TEMP`.

The cost is that CI now depends on more external tooling, and an analyzer that
changes its output format breaks a gate rather than silently reporting nothing.
`scripts/lint.mjs` exists for exactly that failure mode on oxlint.
