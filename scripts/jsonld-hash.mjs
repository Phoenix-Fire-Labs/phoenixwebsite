// trace:exempt reason=local-dev-script
// Prints the base64 SHA-256 of the exact HOMEPAGE_JSONLD bytes for NEXT_PUBLIC_JSONLD_HASH.
import { createHash } from "node:crypto";
import { readFileSync as read } from "node:fs";

const source = read("src/lib/structured-data.ts", "utf8");

const match = source.match(/HOMEPAGE_JSONLD: string =\n {2}'([\s\S]*?)';/u);

if (!match) {
  console.error("HOMEPAGE_JSONLD not found in src/lib/structured-data.ts");
  process.exit(1);
}

console.log(createHash("sha256").update(match[1], "utf8").digest("base64"));
