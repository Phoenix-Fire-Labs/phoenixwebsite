import type { MetadataRoute } from "next";
import { productHrefs } from "@/components/marketing/nav-links";

// trace:v1 id=impl.sitemap work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-K2EA5BTM
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.SITE_PREVIEW_GATED !== "false") return [];

  const now = new Date();

  return [
    { url: "https://www.phoenixfirelabs.com/", lastModified: now },
    // Generated from the product registry: a new product cannot be added
    // without appearing here.
    ...productHrefs().map((href) => ({
      url: `https://www.phoenixfirelabs.com${href}`,
      lastModified: now,
    })),
    { url: "https://www.phoenixfirelabs.com/technology", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/company", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/careers", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/resources", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/resources/wildfire-operational-intelligence", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/solutions", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/solutions/incident-command", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/solutions/operations-planning", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/solutions/utility-wildfire", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/contact", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/privacy", lastModified: now },
    { url: "https://www.phoenixfirelabs.com/terms", lastModified: now },
  ];
}
