# Run the BugHunt defense suite in CI

<!-- trace:v1 id=PLAN-PHO-6D96QCEB type=plan work=WORK-PHO-JG8WSYBA -->

## Objective

Run the BugHunt defense suite in CI

## Tasks

### 1. Add a workflow installing bughunt and provisioning its analysis stack

Cancelled. Superseded by ADR-PHO-EB0ZJGD5: BugHunt exits 0 regardless of
findings, so a job wrapping it cannot gate anything. The analyzers it wraps are
wired individually instead, and none of them needs BugHunt's Python stack.

<!-- trace:v1 id=TASK-PHO-7Y60QRX3 type=task state=CANCELLED work=WORK-PHO-JG8WSYBA implements=PLAN-PHO-6D96QCEB -->

### 2. Run the pull-request profile on PRs and the full skipmutmut profile on main

Cancelled with task 1 -- profiles are a BugHunt concept. The equivalent
distinction is the reviewdog reporter: `github-pr-review` for inline comments on
a pull request, `github-check` on main. Both use `-filter-mode=nofilter`, so
neither narrows what is analysed.

<!-- trace:v1 id=TASK-PHO-A37RBR7M type=task state=CANCELLED work=WORK-PHO-JG8WSYBA implements=PLAN-PHO-6D96QCEB -->

### 3. Publish the human, machine and agent-queue reports as artifacts

Cancelled. Those three report formats are BugHunt outputs. Findings now arrive
as inline review comments on the exact line, which is what the artifacts were
meant to make reachable.

<!-- trace:v1 id=TASK-PHO-168YPWFK type=task state=CANCELLED work=WORK-PHO-JG8WSYBA implements=PLAN-PHO-6D96QCEB -->

### 4. Fail the job when any defense errors, and surface the summary in the job summary

Done. Every analyzer reports through reviewdog with `-fail-level=any`, and
`yarn lint` in ci.yml additionally fails when oxlint's config cannot be parsed
-- the case where an analyzer reports success having checked nothing.

<!-- trace:v1 id=TASK-PHO-G7HFHBQN type=task state=DONE work=WORK-PHO-JG8WSYBA implements=PLAN-PHO-6D96QCEB -->

### 5. Carry forward the knowledge entries the merge of PR 10 left behind

Done. The three entries plus the extended throttling entry were recovered onto
main; PR 10 merged at 0a85c3e without commit 122c9a7.

<!-- trace:v1 id=TASK-PHO-P8JA0VD0 type=task state=DONE work=WORK-PHO-JG8WSYBA implements=PLAN-PHO-6D96QCEB -->

## Current state

Delivered. `.github/workflows/analyzers.yml` runs ten analyzers across two
jobs. Tasks 1 through 3 were cancelled by ADR-PHO-EB0ZJGD5 rather than
completed; the objective they served is met by wiring the analyzers directly.
