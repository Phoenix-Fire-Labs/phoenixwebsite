import type { MetadataRoute } from "next";

// trace:v1 id=impl.robots work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export default function robots(): MetadataRoute.Robots {
  const gated = process.env.SITE_PREVIEW_GATED !== "false";

  if (gated) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/login", "/api/"] },
    sitemap: "https://www.phoenixfirelabs.com/sitemap.xml",
  };
}
