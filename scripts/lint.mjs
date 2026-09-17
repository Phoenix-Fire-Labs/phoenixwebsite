// trace:exempt reason=local-dev-script
// Runs oxlint and fails on a malformed config as well as on lint errors.
//
// oxlint exits 0 when .oxlintrc.json cannot be parsed, having linted nothing.
// A stray key therefore turns the whole lint gate into a silent no-op that CI
// reports as green. This wrapper treats that as a failure.
import { spawnSync } from "node:child_process";

const CONFIG_PARSE_FAILURE = "Failed to parse oxlint configuration";

const result = spawnSync("oxlint", process.argv.slice(2), { encoding: "utf8" });

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

process.stdout.write(output);

if (output.includes(CONFIG_PARSE_FAILURE)) {
  process.stderr.write("\nlint: .oxlintrc.json is invalid, so no rules ran. Fix the config.\n");
  process.exit(1);
}

process.exit(result.status ?? 1);
