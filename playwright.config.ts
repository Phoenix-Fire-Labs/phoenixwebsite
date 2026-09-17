import { defineConfig } from "@playwright/test";
import { writePreviewEnv } from "./e2e/preview-env";

// Runs at module load, which is before Playwright launches `webServer`.
// globalSetup would be too late: the server has already read its environment
// by the time it runs.
writePreviewEnv();

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  globalTeardown: "./e2e/global-teardown.ts",
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3119" },
  webServer: {
    // Build first: `yarn start` serves whatever is already in .next, so
    // without this the suite silently tests a stale binary and "fixed" code
    // keeps failing.
    command: "yarn build && yarn start --port 3119",
    port: 3119,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
