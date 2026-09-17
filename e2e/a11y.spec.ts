import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// trace:v1 id=test.e2e-a11y verifies=REQ-PHO-8P8WDXWR exercises=impl.homepage
async function login(page: Page) {
  await page.goto("/login");

  await page.getByLabel("Password").fill("e2e-password");
  await page.getByRole("button", { name: "Enter Preview" }).click();
  await page.waitForURL("**/login**", { timeout: 15_000 }).catch(() => undefined);
  await page.goto("/");
  await expect(page.locator("h1.hero-headline")).toContainText("Real-Time Wildfire Intelligence", { timeout: 15_000 });
}

test("homepage has no critical axe violations", async ({ page }) => {
  await login(page);
  await page.goto("/");

  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();

  expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
});

test("contact form has no critical axe violations", async ({ page }) => {
  await login(page);
  await page.goto("/contact");

  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();

  expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
});
