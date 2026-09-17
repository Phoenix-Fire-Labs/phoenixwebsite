import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const E2E_ENV_FILE = resolve(process.cwd(), ".env.production.local");

export const E2E_PASSWORD = "e2e-password";

/** Pins the preview credentials for the run.
 *
 *  Two things force this shape:
 *
 *  1. `next start` lets env files override the process environment, and
 *     resolves `.env.production.local` ahead of `.env.local`. Passing values
 *     through `webServer.env` loses to a developer's own `.env.local`, so the
 *     suite would authenticate against their real password.
 *  2. Playwright launches `webServer` *before* `globalSetup`, so writing the
 *     file from globalSetup is too late — the server has already read env.
 *     This runs at config module load, which is earlier than both.
 *
 *  The scrypt hash has its `$` backslash-escaped: dotenv expands `$16384` and
 *  `$8` as variable references, quoting does not prevent it, and an unescaped
 *  value silently loads as "scrypt6384". */
const MARKER = "# Written by e2e/preview-env.ts for the Playwright run. Removed in teardown.";

// trace:exempt reason=test-harness
export function writePreviewEnv() {

  const hash = execFileSync("node", ["scripts/preview-hash.mjs", E2E_PASSWORD]).toString().trim();
  const jsonld = execFileSync("node", ["scripts/jsonld-hash.mjs"]).toString().trim();
  // trace:exempt reason=internal-detail -- dotenv escaping
  const escape = (value: string) => value.replaceAll("$", "\\$");

  const contents = [
    MARKER,
    "SITE_PREVIEW_GATED=true",
    "PREVIEW_SESSION_SECRET=e2e0123456789abcdef0123456789abcdef",
    `PREVIEW_PASSWORD_HASH=${escape(hash)}`,
    `NEXT_PUBLIC_JSONLD_HASH=${escape(jsonld)}`,
    "BRIEFING_INBOX=",
    "",
  ].join("\n");

  try {
    // "wx" creates or fails atomically. Checking existsSync() first left a
    // window in which the file could appear between the check and the write,
    // and a developer's real .env.production.local would be clobbered.
    writeFileSync(E2E_ENV_FILE, contents, { flag: "wx" });

    return;
  } catch (error) {
    // SAFETY: writeFileSync rejects with a Node system error, which always
    // carries `code`; anything else is rethrown untouched on the next line.
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }

  // The path existed. Playwright loads this config once per worker as well as
  // in the runner, so re-seeing our own file is expected; anything else is a
  // real file we must not touch.
  if (!readFileSync(E2E_ENV_FILE, "utf8").startsWith(MARKER)) {
    throw new Error(
      `${E2E_ENV_FILE} already exists. The e2e run needs to own that file; move it aside first.`,
    );
  }
}

// trace:exempt reason=test-harness
export function removePreviewEnv() {
  rmSync(E2E_ENV_FILE, { force: true });
}
