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

New findings do not block a merge, so triage stays a human or agent decision informed by the published queue. The risk is that real findings accumulate unreviewed; the mitigation is that the report is attached to every run rather than needing a local invocation. If a signal class proves consistently actionable it should graduate to its own gate rather than being folded into a count.
