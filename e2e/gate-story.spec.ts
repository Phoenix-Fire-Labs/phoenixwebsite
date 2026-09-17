import { expect, test, type Page } from "@playwright/test";

/** The CSRF guard requires Origin; a browser always sends it on a form
 *  post, but APIRequestContext does not add it. */
const ORIGIN = "http://127.0.0.1:3119";

// trace:v1 id=test.e2e-gate-story verifies=REQ-PHO-EM6MDMQA,REQ-PHO-W3J1V0YP,REQ-PHO-3KRYSF5K,REQ-PHO-9Q311JSZ exercises=impl.preview-gate,impl.visual-signature-story,impl.briefing-route,impl.resources-post
async function login(page: Page) {
  await page.goto("/login");

  await page.getByLabel("Password").fill("e2e-password");
  await page.getByRole("button", { name: "Enter Preview" }).click();
  await page.waitForURL("**/login**", { timeout: 15_000 }).catch(() => undefined);
  await page.goto("/");
  await expect(page.locator("h1.hero-headline")).toContainText("Real-Time Wildfire Intelligence", { timeout: 15_000 });
}

test("gate redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/");

  await page.waitForURL(/\/login\?redirect=%2F/);
  await expect(page.getByRole("heading", { name: "You found us." })).toBeVisible();
});

test("safeRedirect rejects open redirects on login", async ({ page }) => {
  const response = await page.request.post("/api/preview/login", {
    headers: { Origin: ORIGIN },
    form: { password: "e2e-password", redirect: "https://evil.example" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(303);
  expect(response.headers()["location"]).toMatch(/\/$/);
  expect(response.headers()["location"]).not.toContain("evil.example");
});

test("signature story advances through four stages", async ({ page }) => {
  await login(page);
  // The sequence moved to /technology, where "how it fits together" lives;
  // the homepage shows the static field-report strip instead.
  await page.goto("/technology");

  const story = page.locator("#story");

  await expect(story.getByText("One field report")).toBeVisible();

  await story.getByRole("button", { name: "Raven", exact: true }).click();

  // The label is a leaf node, so a chained getByText (which searches
  // descendants) never matches it; assert on the element's own text.
  await expect(story.locator("[aria-live] p.section-label")).toHaveText("Raven");
  await expect(story.locator("p.hero-sub")).toContainText("located-at");

  // Choosing a stage has to stick: the carousel used to advance past it.
  await page.waitForTimeout(4_000);
  await expect(story.locator("[aria-live] p.section-label")).toHaveText("Raven");
});

test("contact validates and silently accepts bots", async ({ page }) => {
  await login(page);
  await page.goto("/contact");

  await expect(page.getByRole("heading", { name: "Tell us about your operation." })).toBeVisible();

  await page.getByLabel("Name").fill("A");
  await page.getByRole("button", { name: "Request a Briefing" }).click();

  const session = (await page.context().cookies()).map((c) => `${c.name}=${c.value}`).join("; ");

  const bad = await page.request.post("/api/contact", {
    headers: { Cookie: session, Accept: "application/json", Origin: ORIGIN },
    form: {
      name: "A",
      agency: "X",
      email: "bad",
      role: "Y",
      useCase: "incident-command",
      message: "short",
      website: "",
      startedAt: String(Date.now() - 30_000),
    },
  });

  expect(bad.status()).toBe(400);

  const bot = await page.request.post("/api/contact", {
    headers: { Cookie: session, Accept: "application/json", Origin: ORIGIN },
    form: {
      name: "Alex Reyes",
      agency: "Ridge County Fire",
      email: "alex@ridgecounty.gov",
      role: "Battalion Chief",
      useCase: "incident-command",
      message: "We run multi-division incidents and need radio-to-map in seconds, not hours.",
      website: "bot",
      startedAt: String(Date.now() - 30_000),
    },
  });

  expect(bot.status()).toBe(200);
  expect(await bot.json()).toEqual({ ok: true });
});

test("research page carries sourced figures, never a summed TAM", async ({ page }) => {
  await login(page);
  await page.goto("/resources/wildfire-operational-intelligence");

  await expect(page.getByText("23,448")).toBeVisible();
  await expect(page.getByText("Source: CAL FIRE damage assessment").first()).toBeVisible();

  const body = await page.content();

  expect(body).not.toMatch(/\$57\.54B TAM/);
});
