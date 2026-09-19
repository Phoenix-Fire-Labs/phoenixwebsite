// trace:exempt reason=local-dev-script
// Builds a tracelayer-evidence/v1 record from the JUnit reports the suites
// actually produced, so linked-test outcomes come from real runs rather than
// being asserted by hand. Maps each test file to the trace node that claims it.
import { readFileSync, writeFileSync } from "node:fs";

const TRACE_IDS = {
  "e2e/gate-story.spec.ts": "test.e2e-gate-story",
  "e2e/a11y.spec.ts": "test.e2e-a11y",
  "e2e/regressions.spec.ts": "test.e2e-regressions",
  "src/proxy.test.ts": "test.preview-gate-fail-closed",
  "src/lib/figure-scale.test.ts": "test.figure-scale",
};

// Playwright writes the basename; vitest writes the repo-relative path.
const byBasename = new Map(
  Object.entries(TRACE_IDS).map(([path, id]) => [path.split("/").pop(), id]),
);

// trace:exempt reason=local-dev-script
function suites(xml) {
  return [...xml.matchAll(/<testsuite\b[^>]*>/g)].map((m) => m[0]);
}

// trace:exempt reason=local-dev-script
function attr(tag, name) {
  return new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];
}

const results = new Map();

for (const file of process.argv.slice(3)) {
  const xml = readFileSync(file, "utf8");

  for (const tag of suites(xml)) {
    const name = attr(tag, "name");

    if (name == null) continue;

    const traceId = TRACE_IDS[name] ?? byBasename.get(name.split("/").pop());

    if (traceId == null) continue;

    const failed = Number(attr(tag, "failures") ?? 0) + Number(attr(tag, "errors") ?? 0);
    const skipped = Number(attr(tag, "skipped") ?? 0);
    const total = Number(attr(tag, "tests") ?? 0);
    const prior = results.get(traceId);

    // A suite that ran nothing, or whose tests were all skipped, is not
    // evidence of anything. Reporting it as `pass` would let trace record a
    // verification that never happened.
    let outcome = "pass";

    if (failed > 0) outcome = "fail";
    else if (total === 0 || skipped >= total) outcome = "skip";

    // A trace node stays "pass" only if every suite mapped to it passed; a
    // failure wins over everything, and a skip beats a pass.
    const merged =
      prior?.outcome === "fail" || outcome === "fail"
        ? "fail"
        : prior?.outcome === "skip" || outcome === "skip"
          ? "skip"
          : "pass";

    results.set(traceId, {
      framework_id: name,
      outcome: merged,
      trace_id: traceId,
      duration_ms: Math.round(Number(attr(tag, "time") ?? 0) * 1000),
    });
  }
}

const tests = [...results.values()];

if (tests.length === 0) throw new Error("no JUnit suites matched a trace id");

const record = {
  schema: "tracelayer-evidence/v1",
  run_id: `local-${Date.now()}`,
  revision: process.argv[2],
  provider: "local",
  status: tests.some((t) => t.outcome !== "pass") ? "fail" : "pass",
  tests,
};

writeFileSync("evidence.json", JSON.stringify(record, null, 2) + "\n");

console.log(`${record.status}: ${tests.map((t) => `${t.trace_id}=${t.outcome}`).join(" ")}`);
