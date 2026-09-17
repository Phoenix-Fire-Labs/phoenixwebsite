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
    const prior = results.get(traceId);
    const outcome = failed > 0 ? "fail" : "pass";

    // A trace node stays "pass" only if every suite mapped to it passed.
    results.set(traceId, {
      framework_id: name,
      outcome: prior?.outcome === "fail" ? "fail" : outcome,
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
