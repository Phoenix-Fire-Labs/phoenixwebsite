// trace:exempt reason=local-dev-script
// Runs Lighthouse against the gated homepage with a valid preview session.
// Seeds the session with Playwright (HttpOnly cookie), then audits the
// persisted Chromium profile. Usage: node scripts/lighthouse.mjs [port]
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const port = Number(process.argv[2] ?? 3119);

const base = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;

const password = process.env.E2E_PASSWORD ?? "e2e-password";

const profile = mkdtempSync(join(tmpdir(), "phoenix-lh-"));

execFileSync(
  "node",
  [
    "-e",
    `const { chromium } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(process.env.BASE + "/login");
  await page.getByLabel("Password").fill(process.env.PASSWORD);
  await page.getByRole("button", { name: "Enter Preview" }).click();
  await page.goto(process.env.BASE + "/");
  await context.storageState({ path: process.env.PROFILE + "/state.json" });
  await browser.close();
})();`,
  ],
  {
    env: { ...process.env, BASE: base, PASSWORD: password, PROFILE: profile, PLAYWRIGHT_BROWSERS_PATH: "/tmp/pw-browsers" },
    stdio: "inherit",
  },
);

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

  // Note: the ungated launch state scores SEO 1.0; the gated preview state is
  // intentionally noindex (0.66 observed) so the floor only applies ungated.
  const gated = process.env.SITE_PREVIEW_GATED !== "false";

  const floor = gated
    ? { performance: 0.8, accessibility: 0.9, "best-practices": 0.9 }
    : { performance: 0.8, accessibility: 0.9, "best-practices": 0.9, seo: 0.9 };

  const failures = Object.entries(floor).filter(([name, minimum]) => (summary[name] ?? 0) < minimum);

  if (failures.length > 0) {
    console.error(`below floor: ${failures.map(([name]) => name).join(", ")}`);
    process.exit(1);
  }
} finally {
  await chrome.kill();
}
