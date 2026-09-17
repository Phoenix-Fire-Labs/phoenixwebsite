// trace:exempt reason=local-dev-script
import { randomBytes, scryptSync } from "node:crypto";

// argv is visible in `ps` output and lands in shell history, so the password
// is read from stdin by default. An explicit argv value is still accepted for
// non-interactive callers (the e2e harness) that use a throwaway secret.
const fromArgv = process.argv[2];

// trace:exempt reason=local-dev-script
async function readStdin() {
  if (process.stdin.isTTY) {
    process.stderr.write("Preview password (input hidden is not supported here): ");
  }

  const chunks = [];

  for await (const chunk of process.stdin) chunks.push(chunk);

  return Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
}

const password = fromArgv ?? (await readStdin());

if (!password) {
  console.error("usage: node scripts/preview-hash.mjs            # reads the password from stdin");
  console.error("       printf %s 'secret' | node scripts/preview-hash.mjs");
  console.error("       node scripts/preview-hash.mjs <password>  # argv is visible in ps output");
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
