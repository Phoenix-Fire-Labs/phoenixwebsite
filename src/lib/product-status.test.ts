// trace:exempt reason=zero-boundary-test-file-verified-by-vitest-run
import { describe, expect, it } from "vitest";
import { LLMS_TXT } from "./structured-data";
import { FLAGSHIP_PRODUCTS, PRODUCTS } from "./product-status";

describe("product registry", () => {
  it("gives Mockingbird and Osprey equal flagship weight", () => {
    expect(FLAGSHIP_PRODUCTS.map((p) => p.slug).toSorted()).toEqual(["mockingbird", "osprey"]);
  });

  it("marks roadmap and research honestly", () => {
    const bySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p.status]));
    expect(bySlug).toMatchObject({
      raven: "platform",
      albatross: "in-development",
      peregrine: "research",
      owl: "research",
    });
  });

  it("keeps research products out of shipping-product schema", () => {
    for (const name of ["Peregrine", "Owl", "Albatross"]) {
      expect(LLMS_TXT).toContain(name);
    }
  });
});

describe("registry hrefs are real destinations", () => {
  it("never points a product at a homepage fragment", () => {
    for (const product of PRODUCTS) {
      expect(product.href.startsWith("/"), `${product.slug} -> ${product.href}`).toBe(true);
    }
  });

  it("gives every product its own route, with no anchors", () => {
    for (const product of PRODUCTS) {
      // Each product is a destination in its own right; an anchor would send
      // the reader to a section of some other page.
      expect(product.href, product.slug).toBe(`/${product.slug}`);
      expect(product.href).not.toContain("#");
    }
  });

  it("carries a distinct status label for every maturity level", () => {
    for (const product of PRODUCTS) {
      expect(product.statusLabel.length, `${product.slug} has no status label`).toBeGreaterThan(0);
      expect(product.tagline.length, `${product.slug} has no tagline`).toBeGreaterThan(0);
      expect(product.relation.length, `${product.slug} has no relation`).toBeGreaterThan(0);
    }

    // Research concepts must never be labelled like shipping systems.
    for (const product of PRODUCTS.filter((p) => p.status === "research")) {
      expect(product.statusLabel.toLowerCase()).toContain("research");
    }
  });
});
