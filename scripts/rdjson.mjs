// trace:exempt reason=local-dev-script
// Converts analyzer output into reviewdog's rdjson so findings land as inline
// PR comments. Only tools without an official reviewdog action need this.
//
// Usage: <tool> | node scripts/rdjson.mjs <knip|madge|dotenv|jsonschema|taplo|react-doctor>
import { readFileSync } from "node:fs";

const kind = process.argv[2];

const raw = readFileSync(0, "utf8");

// trace:exempt reason=internal-detail -- rdjson diagnostic shape
const at = (path, line = 1, column = 1) => ({
  path,
  range: { start: { line: Number(line) || 1, column: Number(column) || 1 } },
});

// trace:exempt reason=internal-detail -- tolerant JSON parse
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// trace:exempt reason=internal-detail -- per-tool extraction
function diagnostics() {
  if (kind === "knip") {
    const data = parseJson(raw);

    if (data == null) return [];

    // knip groups issues by file, with one bucket per issue type.
    return (data.issues ?? []).flatMap((issue) =>
      Object.entries(issue)
        .filter(([, value]) => Array.isArray(value))
        .flatMap(([type, entries]) =>
          entries.map((entry) => ({
            message: `${type}: ${entry.name ?? entry}`,
            location: at(issue.file, entry.line, entry.col),
            severity: "WARNING",
          })),
        ),
    );
  }

  if (kind === "react-doctor") {
    const data = parseJson(raw);

    if (data == null) return [];

    const all = [
      ...(data.diagnostics ?? []),
      ...(data.projects ?? []).flatMap((project) => project.diagnostics ?? []),
    ];

    return all.map((entry) => ({
      message: entry.message ?? entry.title ?? "react-doctor finding",
      location: at(entry.file ?? entry.path ?? "package.json", entry.line, entry.column),
      severity: (entry.severity ?? "warning").toUpperCase() === "ERROR" ? "ERROR" : "WARNING",
      code: entry.rule == null ? undefined : { value: entry.rule },
    }));
  }

  if (kind === "jsonschema") {
    const data = parseJson(raw);

    if (data == null) return [];

    // check-jsonschema emits `errors` as an array of
    // { filename, path, message }, not an object keyed by file.
    return (data.errors ?? []).map((error) => ({
      message: `${error.path ?? ""} ${error.message ?? "schema violation"}`.trim(),
      location: at(error.filename ?? "unknown"),
      severity: "ERROR",
    }));
  }

  if (kind === "dotenv") {
    // `.env.example:14 UnorderedKey: The X key should go before the Y key`
    return [...raw.matchAll(/^(\S+):(\d+)\s+(\w+):\s*(.+)$/gm)].map((m) => ({
      message: m[4],
      location: at(m[1], m[2]),
      severity: "ERROR",
      code: { value: m[3] },
    }));
  }

  if (kind === "madge") {
    // madge prints a numbered list of cycles; report each on its first file.
    return [...raw.matchAll(/^\s*\d+\)\s*(.+)$/gm)].map((m) => {
      const cycle = m[1].trim();

      return {
        message: `circular dependency: ${cycle}`,
        location: at(cycle.split(/\s*>\s*/)[0]),
        severity: "ERROR",
      };
    });
  }

  if (kind === "taplo") {
    // `error: ... at <file>:<line>:<col>`
    return [...raw.matchAll(/(\S+\.toml):(\d+):(\d+)\s*(.*)$/gm)].map((m) => ({
      message: m[4] || "TOML lint finding",
      location: at(m[1], m[2], m[3]),
      severity: "ERROR",
    }));
  }

  throw new Error(`unknown converter: ${kind}`);
}

process.stdout.write(
  JSON.stringify({
    source: { name: kind, url: "https://github.com/Phoenix-Fire-Labs/phoenixwebsite" },
    severity: "WARNING",
    diagnostics: diagnostics(),
  }),
);
