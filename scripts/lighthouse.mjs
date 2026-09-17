// trace:exempt reason=local-dev-script
// Runs Lighthouse against the gated homepage with a real preview session.
//
// The session is seeded into a persistent Chromium profile that Lighthouse
// then reuses. An earlier version called context.storageState() and handed the
// containing directory to chrome-launcher as a userDataDir — but storageState
// writes Playwright's own cookie JSON, which is not a Chromium profile, so
// Lighthouse launched unauthenticated and silently audited the login page.
//
// Usage: node scripts/lighthouse.mjs [port]
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const port = Number(process.argv[2] ?? 3119);

const base = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;

const password = process.env.E2E_PASSWORD ?? "e2e-password";

const profile = mkdtempSync(join(tmpdir(), "phoenix-lh-"));

const gated = process.env.SITE_PREVIEW_GATED !== "false";

if (gated) {
  // Persistent context: the session cookie is written into `profile` as a real
  // Chromium profile, which chrome-launcher can then open.
  const context = await chromium.launchPersistentContext(profile, { headless: true });

  try {
    const page = await context.newPage();

    await page.goto(`${base}/login`);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Enter Preview" }).click();
    await page.waitForLoadState("networkidle");
    await page.goto(`${base}/`);

    // A failed login previously fell through and Lighthouse audited whatever
    // it happened to land on. Prove the session works before auditing.
    const authenticated = await page
      .locator("h1.hero-headline")
      .first()
      .textContent()
      .catch(() => null);

    if (authenticated == null || !authenticated.includes("Real-Time Wildfire Intelligence")) {
      throw new Error(
        `preview login failed: ${base}/ did not render the homepage. ` +
          "Check E2E_PASSWORD against PREVIEW_PASSWORD_HASH.",
      );
    }
  } finally {
    await context.close();
  }
}

const chrome = await launch({
  chromeFlags: ["--headless", "--no-sandbox"],
  chromePath: process.env.CHROME_PATH,
  userDataDir: profile,
});

try {
  const result = await lighthouse(`${base}/`, { port: chrome.port, output: "json" });
  const categories = result?.lhr?.categories ?? {};

  const summary = Object.fromEntries(
    Object.entries(categories).map(([name, entry]) => [name, entry.score]),
  );

  console.log(JSON.stringify({ url: `${base}/`, summary }, null, 2));

  // The gated preview is intentionally noindex, so the SEO floor only applies
  // once the gate is lifted.
  const floor = gated
    ? { performance: 0.8, accessibility: 0.9, "best-practices": 0.9 }
    : { performance: 0.8, accessibility: 0.9, "best-practices": 0.9, seo: 0.9 };

  const failures = Object.entries(floor).filter(([name, minimum]) => (summary[name] ?? 0) < minimum);

  if (failures.length > 0) {
    console.error(`below floor: ${failures.map(([name]) => name).join(", ")}`);
    process.exit(1);
  }
} finally {
  chrome.kill();
}
