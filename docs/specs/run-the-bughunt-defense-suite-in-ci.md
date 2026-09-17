# Run the BugHunt defense suite in CI

<!-- trace:v1 id=SPEC-PHO-KECSTSCJ type=spec work=WORK-PHO-JG8WSYBA -->

## Requirements

- Every analyzer BugHunt wraps that applies to this repository runs in CI as
  its own step, gating on its own result.
- BugHunt itself does not run in CI. It exits 0 regardless of findings, so it
  cannot gate anything.
- Findings are reported as inline review comments, not only as job logs.
- A finding anywhere in the tree fails the job, not only a finding on a line
  the pull request touched.
- An analyzer must be green before it is wired in. A gate that is red on
  arrival trains reviewers to ignore it.
- No analyzer writes its report inside the checkout, where it could overwrite
  a configuration file.
- A gate that cannot execute fails loudly rather than reporting success. The
  motivating case is oxlint, which exits 0 when its config cannot be parsed,
  having linted nothing.
