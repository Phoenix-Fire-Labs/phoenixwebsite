// trace:exempt reason=local-dev-script
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("usage: node scripts/preview-hash.mjs <password>");
  process.exit(1);
}

const salt = randomBytes(16);

const key = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });

const phc = `scrypt$16384$8$1$${salt.toString("hex")}$${key.toString("hex")}`;

// Emit the raw hash when piped, so callers can capture it. When a human is
// watching, also print the env line with `$` backslash-escaped: dotenv expands
// `$16384` and `$8` as variable references — quoting does not stop it, only a
// backslash does — and the stored value silently becomes "scrypt6384".
console.log(phc);

if (process.stdout.isTTY) {
  console.error("\nPaste into .env.local exactly as written, backslashes included:");
  console.error(`PREVIEW_PASSWORD_HASH=${phc.replaceAll("$", "\\$")}`);
}
