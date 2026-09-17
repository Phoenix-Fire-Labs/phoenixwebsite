/** Canonical product registry: the single source of truth for what Phoenix
 *  makes and how mature each system is.
 *
 *  Every surface reads from here — navigation, the homepage system map,
 *  product pages, llms.txt and structured data — so no two places can
 *  describe the same product differently or imply a maturity it does not
 *  have. Adding a product means adding a row, not editing six files. */

// trace:v1 id=impl.product-status work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export type ProductStatus = "flagship" | "platform" | "in-development" | "research";

// trace:v1 id=impl.product-registry work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export interface Product {
  slug: string;
  name: string;
  category: string;
  status: ProductStatus;
  /** Shown verbatim wherever the product appears. Never soften or reword it
   *  per-surface: the label is how a reader tells a shipping system from a
   *  research concept. */
  statusLabel: string;
  /** One line for cards and nav. */
  tagline: string;
  blurb: string;
  href: string;
  /** How this product relates to Raven, used by the homepage system map. */
  relation: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "mockingbird",
    name: "Mockingbird",
    category: "Radio Intelligence",
    status: "flagship",
    statusLabel: "Flagship",
    tagline: "Radio intelligence",
    blurb:
      "Turns tactical VHF radio traffic into structured incident intelligence: locations, units, and events synchronized to command views.",
    href: "/mockingbird",
    relation: "writes what crews report into Raven",
  },
  {
    slug: "osprey",
    name: "Osprey",
    category: "Operational Geospatial Intelligence",
    status: "flagship",
    statusLabel: "Flagship",
    tagline: "Operational geospatial intelligence",
    blurb:
      "Assembles GIS, satellite imagery, fire perimeters, evacuations, infrastructure, and field updates into one live operational picture.",
    href: "/osprey",
    relation: "renders Raven as one incident geography",
  },
  {
    slug: "raven",
    name: "Raven",
    category: "Operational Knowledge Layer",
    status: "platform",
    statusLabel: "Intelligence layer",
    tagline: "The shared operational model",
    blurb:
      "The shared operational model beneath Phoenix: one world that radio reports and map layers both refer to, with provenance and time on every observation.",
    href: "/raven",
    relation: "the shared model every other system reads and writes",
  },
  {
    slug: "albatross",
    name: "Albatross",
    category: "Wildfire Prediction",
    status: "in-development",
    statusLabel: "In development",
    tagline: "Wildfire prediction modeling",
    blurb:
      "Extends the operational picture forward, from understanding what is happening now toward modeling what may happen next.",
    href: "/albatross",
    relation: "reads Raven to model what happens next",
  },
  {
    slug: "peregrine",
    name: "Peregrine",
    category: "Deployable Sensing",
    status: "research",
    statusLabel: "Long-term research",
    tagline: "Deployable field sensing",
    blurb:
      "Cheaper, more placeable field observation nodes that report directly into Raven. A research direction, not a product.",
    href: "/peregrine",
    relation: "would feed observations into Raven",
  },
  {
    slug: "owl",
    name: "Owl",
    category: "Augmented-Reality Field Interface",
    status: "research",
    statusLabel: "Long-term research",
    tagline: "Augmented-reality field interface",
    blurb:
      "An augmented-reality field interface reading from Raven, putting the operational picture in front of crews on the line. A research direction, not a product.",
    href: "/owl",
    relation: "would read Raven in the field",
  },
];

export const FLAGSHIP_PRODUCTS = PRODUCTS.filter((p) => p.status === "flagship");

export const RESEARCH_PRODUCTS = PRODUCTS.filter((p) => p.status === "research");

// trace:exempt reason=internal-helper
export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

// trace:exempt reason=internal-helper
export function productsByStatus(status: ProductStatus): Product[] {
  return PRODUCTS.filter((p) => p.status === status);
}
