# Run the BugHunt defense suite in CI

<!-- trace:v1 id=REQUEST-PHO-68WT3T10 type=request -->

## Requested outcome

BugHunt only ever ran on a developer machine, so its 61 analysis defenses never gated a pull request and a broken analyzer would go unnoticed. Run it in CI, publish its reports, and fail the build when a defense cannot execute.

## Original request

> BugHunt only ever ran on a developer machine, so its 61 analysis defenses never gated a pull request and a broken analyzer would go unnoticed. Run it in CI, publish its reports, and fail the build when a defense cannot execute.

## Derived work

- WORK-PHO-JG8WSYBA
