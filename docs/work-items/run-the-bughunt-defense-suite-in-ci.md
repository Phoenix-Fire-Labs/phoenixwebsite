# Run the BugHunt defense suite in CI

<!-- trace:v1 id=WORK-PHO-JG8WSYBA type=work request=REQUEST-PHO-68WT3T10 -->

## Status

Done

## Summary

BugHunt only ever ran on a developer machine, so the analyzers it wraps never gated a pull request. Run those analyzers in CI on their own terms -- not BugHunt itself, which exits 0 by design -- and report every finding as an inline review comment.

## Originating request

REQUEST-PHO-68WT3T10

## Context

BugHunt only ever ran on a developer machine, so the analyzers it wraps never
gated a pull request.

The original framing was to add `bughunt` as a CI job. That was redirected
during the work: BugHunt is a triage harness that exits 0 regardless of
findings, so wrapping it would never fail a build. ADR-PHO-EB0ZJGD5 records
the decision to wire the individual analyzers instead.

## Governing specification

SPEC-PHO-KECSTSCJ

## Progress

Delivered. `.github/workflows/analyzers.yml` runs two jobs: `javascript`
(oxlint with its type-aware rules, knip, react-doctor, madge) and `config`
(actionlint, shellcheck, yamllint, taplo, check-jsonschema, dotenv-linter).
Each reports through reviewdog with `-filter-mode=nofilter -fail-level=any`.
`scripts/rdjson.mjs` converts the tools that have no official reviewdog action.

Two findings came out of the work itself and are recorded in AGENTS.md:
typescript-eslint cannot run on this repository at all (it throws on import
against TypeScript 7), so type-aware linting goes through oxlint's tsgolint
backend; and an analyzer writing its report into the checkout can overwrite a
config file of the same name, so every report is written to `$RUNNER_TEMP`.
