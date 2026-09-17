import { PRODUCTS, productsByStatus } from "@/lib/product-status";

/** Single source of truth for site navigation.
 *
 *  The Products group is generated from the product registry, grouped by
 *  maturity. That is how the nav can list all six products without implying
 *  six mature ones: the reader sees "Flagship", "Intelligence layer",
 *  "In development" and "Long-term research" as headings, not a flat list of
 *  six bird names.
 *
 *  Every indexable route reachable by link lives here, and e2e checks the
 *  sitemap against it, so a page can never ship with a 200 and no way in. */
// trace:v1 id=impl.nav-links work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export interface NavLink {
  href: string;
  label: string;
  detail?: string;
}

// trace:v1 id=impl.nav-group-shape work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export interface NavGroup {
  label: string;
  href: string;
  sections: { heading?: string; links: NavLink[] }[];
}

// trace:exempt reason=internal-helper
function productLinks(status: Parameters<typeof productsByStatus>[0]): NavLink[] {
  return productsByStatus(status).map((p) => ({
    href: p.href,
    label: p.name,
    detail: p.tagline,
  }));
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Products",
    href: "/#system",
    sections: [
      { heading: "Flagship", links: productLinks("flagship") },
      { heading: "Intelligence layer", links: productLinks("platform") },
      { heading: "In development", links: productLinks("in-development") },
      { heading: "Long-term research", links: productLinks("research") },
    ],
  },
  {
    label: "Technology",
    href: "/technology",
    sections: [
      {
        links: [
          { href: "/technology", label: "How Phoenix fits together", detail: "Architecture and the shared model" },
          { href: "/#system", label: "System map", detail: "Every product in one view" },
        ],
      },
    ],
  },
  {
    label: "Company",
    href: "/company",
    sections: [
      {
        links: [
          { href: "/company", label: "Company", detail: "Why Phoenix exists" },
          { href: "/careers", label: "Careers", detail: "Build on the fireground" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    sections: [
      {
        links: [
          { href: "/resources", label: "Resources", detail: "Research and evidence" },
          { href: "/solutions", label: "Solutions", detail: "By operational role" },
        ],
      },
    ],
  },
];

export const FOOTER_LEGAL: NavLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export const BRIEFING_CTA: NavLink = { href: "/contact", label: "Request a Briefing" };

/** Flattened destinations, used by the navigation-coverage e2e check. */
// trace:exempt reason=internal-helper
export function allNavHrefs(): string[] {
  const fromGroups = NAV_GROUPS.flatMap((g) => g.sections.flatMap((s) => s.links.map((l) => l.href)));

  return [...new Set([...fromGroups, ...FOOTER_LEGAL.map((l) => l.href), BRIEFING_CTA.href])];
}

/** Every product route, for the sitemap and route coverage checks. */
// trace:exempt reason=internal-helper
export function productHrefs(): string[] {
  return PRODUCTS.map((p) => p.href);
}
