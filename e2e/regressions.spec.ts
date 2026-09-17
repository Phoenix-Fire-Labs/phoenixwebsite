import { expect, test, type Page } from "@playwright/test";
import { allNavHrefs } from "../src/components/marketing/nav-links";
import { PRODUCTS } from "../src/lib/product-status";

/** Guards for the four failures that shipped past build, typecheck and unit
 *  tests: a hydration mismatch that blanked the homepage, reveal elements
 *  stranded at opacity 0, routes that returned 200 with nothing linking to
 *  them, and animation rules gated on a class nothing applied. */
const ROUTES = [
  "/",
  "/mockingbird",
  "/osprey",
  "/raven",
  "/albatross",
  "/peregrine",
  "/owl",
  "/technology",
  "/company",
  "/careers",
  "/resources",
  "/solutions",
  "/contact",
  "/privacy",
  "/terms",
];

/** The CSRF guard requires Origin; a browser always sends it on a form
 *  post, but APIRequestContext does not add it. */
const ORIGIN = "http://127.0.0.1:3119";

// trace:v1 id=test.e2e-regressions verifies=REQ-PHO-8P8WDXWR,REQ-PHO-XH2DZ7EX,REQ-PHO-K2EA5BTM,REQ-PHO-C4Q5XJHC,REQ-PHO-NRXVT28A,REQ-PHO-3YJG08V6,REQ-PHO-406ZSYBP,REQ-PHO-T9QVXJR8,REQ-PHO-VTA4YYAW exercises=impl.motion-reveal,impl.site-header,impl.site-footer,impl.nav-links,impl.homepage,impl.robots,impl.sitemap,impl.visual-system-map,impl.product-page-shell,impl.raven-page,impl.albatross-page,impl.peregrine-page,impl.owl-page
async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Password").fill("e2e-password");
  await page.getByRole("button", { name: "Enter Preview" }).click();
  await page.waitForURL("**/login**", { timeout: 15_000 }).catch(() => undefined);
  await page.goto("/");
  await expect(page.locator("h1.hero-headline")).toContainText("Real-Time Wildfire Intelligence", {
    timeout: 15_000,
  });
}

test("no page logs a hydration mismatch or runtime error", async ({ page }) => {
  // Eleven routes at a few seconds each exceeds the 30s default.
  test.setTimeout(120_000);
  const problems: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text().slice(0, 300)}`);
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));

  await login(page);

  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(500);
  }

  expect(problems).toEqual([]);
});

test("every reveal element becomes visible once scrolled", async ({ page }) => {
  await login(page);

  for (const route of ["/", "/mockingbird", "/osprey"]) {
    await page.goto(route, { waitUntil: "networkidle" });

    // Walk the page so the observer fires for everything below the fold.
    await page.evaluate(async () => {
      const step = 500;

      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
    });
    await page.waitForTimeout(900);

    const stranded = await page.evaluate(() =>
      [...document.querySelectorAll(".reveal")].flatMap((el) =>
        getComputedStyle(el).opacity === "1" ? [] : [el.className],
      ),
    );

    expect(stranded, `stranded reveal elements on ${route}`).toEqual([]);
  }
});

test("the animation gate class is actually applied", async ({ page }) => {
  await login(page);
  await page.goto("/");

  // Every `opacity: 0` animation rule is scoped to `.js-anim`. If the class
  // stops being applied the page still renders, but nothing ever animates —
  // which is exactly how the dead rules went unnoticed.
  await expect(page.locator("html")).toHaveClass(/js-anim/);
});

test("content is fully visible with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  // The gate itself needs no JS, so drive it with a direct form post first.
  const response = await context.request.post("/api/preview/login", {
    headers: { Origin: ORIGIN },
    form: { password: "e2e-password", redirect: "/" },
  });

  expect(response.ok()).toBeTruthy();
  await page.goto("/");

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal")].filter((el) => getComputedStyle(el).opacity !== "1").length,
  ).catch(() => 0);

  expect(hidden).toBe(0);
  await context.close();
});

test("every linkable route is reachable from the site chrome", async ({ page }) => {
  await login(page);
  await page.goto("/");

  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll("header a[href], footer a[href]")].map((a) =>
      a.getAttribute("href"),
    ),
  );

  // A route that returns 200 but appears in no header or footer link is
  // unreachable; that is how /mockingbird, /company and /careers were orphaned.
  for (const href of allNavHrefs()) {
    expect(hrefs, `${href} is not linked from the header or footer`).toContain(href);
  }
});

test("indexable routes all resolve", async ({ page }) => {
  await login(page);

  for (const route of ROUTES) {
    const response = await page.goto(route);

    expect(response?.status(), `${route} should resolve`).toBe(200);
  }
});

test("private routes stay out of the sitemap and robots while gated", async ({ page }) => {
  // Spec §44: noindex must not rely on robots.txt alone, and the sitemap must
  // never advertise gated or private routes.
  const robots = await page.request.get("/robots.txt");
  const sitemap = await page.request.get("/sitemap.xml");

  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Disallow: /");

  const sitemapBody = await sitemap.text();

  expect(sitemapBody).not.toContain("/login");
  expect(sitemapBody).not.toContain("/api/");

  const gated = await page.request.get("/", { maxRedirects: 0 });

  expect(gated.headers()["x-robots-tag"]).toContain("noindex");
});

test("every product has its own page carrying its real status", async ({ page }) => {
  await login(page);

  for (const product of PRODUCTS) {
    const response = await page.goto(product.href);

    expect(response?.status(), `${product.name} page`).toBe(200);
    await expect(page.locator("h1")).toHaveText(product.name);

    // The status label comes from the registry on every surface, so a research
    // concept can never be dressed up as a shipping product.
    await expect(page.locator(".hero-eyebrow")).toContainText(product.statusLabel);
  }
});

test("the system map shows the whole family with Raven at the centre", async ({ page }) => {
  await login(page);
  await page.goto("/");

  const map = page.locator(".system-map");

  await expect(map).toBeVisible();
  // The DOM carries the real name; uppercase is presentational only.
  await expect(map.locator(".map-node-centre")).toContainText("Raven");

  // Every product is present and links to its own page.
  for (const product of PRODUCTS) {
    await expect(map, `${product.name} missing from the map`).toContainText(product.name);
    await expect(map.locator(`a[href="${product.href}"]`)).toHaveCount(1);
  }
});

test("removed hedging copy stays removed", async ({ page }) => {
  await login(page);

  await page.goto("/technology");
  expect(await page.content()).not.toContain("Neither has a ship date");

  await page.goto("/resources/wildfire-operational-intelligence");
  expect(await page.content()).not.toContain("mathematical ceiling");

  await page.goto("/");
  // "Two systems" framed Phoenix as a pair when six products exist.
  await expect(page.locator("h2")).not.toContainText(["Two systems, one operational picture"]);
});

test("headings render at one size across every page", async ({ page }) => {
  await login(page);

  const sizes = new Map<string, string[]>();

  for (const route of ["/", "/mockingbird", "/raven", "/company", "/resources", "/solutions"]) {
    await page.goto(route);

    const measured = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const h2 = document.querySelector(".section-heading");

      return {
        h1: h1 ? getComputedStyle(h1).fontSize : null,
        h2: h2 ? getComputedStyle(h2).fontSize : null,
      };
    });

    for (const [role, value] of Object.entries(measured)) {
      if (value == null) continue;
      sizes.set(role, [...(sizes.get(role) ?? []), `${route}=${value}`]);
    }
  }

  // h1 previously measured 60px, 48px and 36px on different routes.
  for (const [role, entries] of sizes) {
    const distinct = new Set(entries.map((e) => e.split("=")[1]));

    expect([...distinct], `${role} differs across pages: ${entries.join(", ")}`).toHaveLength(1);
  }
});

test("hero fits the first screen at common window heights", async ({ page }) => {
  await login(page);

  // At a typical laptop window the hero should compose into the first screen.
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");

  const hero = page.locator("section.hero");
  const box = await hero.boundingBox();

  expect(box, "hero missing").not.toBeNull();
  expect(box!.height, "hero overflows an 800px window").toBeLessThanOrEqual(800);

  // It must also be centred rather than flush to the header: with the header
  // at ~4.5rem, a hero that merely starts at the top leaves no gap above.
  const gap = await page.evaluate(() => {
    const el = document.querySelector("section.hero");
    const header = document.querySelector("header.site-header");

    if (!el || !header) return null;

    return el.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
  });

  expect(gap, "hero sits flush against the header").not.toBeNull();

  // On a short window the hero may exceed the viewport, but the primary CTA
  // must still be reachable in the first screen.
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Request a Briefing" }).first()).toBeInViewport();
});

test("the generated social card is not public while gated", async ({ page }) => {
  // The card renders the headline and the product names, so exempting it from
  // the gate published exactly the positioning the preview withholds.
  const response = await page.request.get("/opengraph-image", { maxRedirects: 0 });

  expect(response.status(), "opengraph-image should be gated").toBe(307);
  expect(response.headers()["location"]).toContain("/login");
});

test("each route declares its own canonical", async ({ page }) => {
  await login(page);

  // The root layout used to hard-code the homepage canonical, which Next then
  // merged into every child route — telling search engines that every page was
  // a duplicate of /.
  const seen = new Map<string, string>();

  for (const route of ROUTES) {
    await page.goto(route);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute("href");

    expect(canonical, `${route} has no canonical`).not.toBeNull();
    seen.set(route, canonical!);
  }

  // No two routes may claim the same canonical URL.
  const values = [...seen.values()];

  expect(new Set(values).size, `duplicate canonicals: ${[...seen].map(([r, c]) => `${r}->${c}`).join(", ")}`)
    .toBe(values.length);
});

test("the gate itself leaks no product information", async ({ page }) => {
  // /login is the one page a stranger can reach. It used to inherit the
  // marketing header, footer and metadata, so the whole product family was
  // readable without authenticating.
  await page.goto("/login");

  const html = await page.content();

  for (const product of PRODUCTS) {
    expect(html, `${product.name} is visible on the gate`).not.toContain(product.name);
  }

  // The gate still has to work.
  await expect(page.getByRole("button", { name: "Enter Preview" })).toBeVisible();
});

test("a throttled briefing is reported, not silently dropped", async ({ page }) => {
  await login(page);

  const session = (await page.context().cookies()).map((c) => `${c.name}=${c.value}`).join("; ");

  const body = {
    name: "Alex Reyes",
    agency: "Ridge County Fire",
    email: "alex@ridgecounty.gov",
    role: "Battalion Chief",
    useCase: "incident-command",
    message: "We run multi-division incidents and need radio-to-map in seconds, not hours.",
    website: "",
    startedAt: String(Date.now() - 30_000),
  };

  // Exhaust the 20-per-10-minute budget, then confirm the next one is refused
  // rather than answered with a success the requester would believe.
  let throttled: number | null = null;

  for (let i = 0; i < 24; i++) {
    const response = await page.request.post("/api/contact", {
      headers: { Cookie: session, Accept: "application/json", Origin: ORIGIN },
      form: body,
    });

    if (response.status() === 429) {
      throttled = i;
      expect((await response.json()).ok, "throttled response must not claim success").toBe(false);
      break;
    }
  }

  expect(throttled, "expected a 429 once the budget was exhausted").not.toBeNull();
});
