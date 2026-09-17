# Run the BugHunt defense suite in CI

<!-- trace:v1 id=WORK-PHO-JG8WSYBA type=work request=REQUEST-PHO-68WT3T10 -->

## Status

Active

## Summary

BugHunt only ever ran on a developer machine, so its 61 analysis defenses never gated a pull request and a broken analyzer would go unnoticed. Run it in CI, publish its reports, and fail the build when a defense cannot execute.

## Originating request

REQUEST-PHO-68WT3T10

## Context

BugHunt only ever ran on a developer machine, so its 61 analysis defenses never gated a pull request and a broken analyzer would go unnoticed. Run it in CI, publish its reports, and fail the build when a defense cannot execute.

## Governing specification

SPEC-PHO-KECSTSCJ

## Progress

Work started.
