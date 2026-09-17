// trace:v1 id=impl.seo-canonical work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export interface RouteAlternates {
  canonical: string;
}

/** Canonical URL helper.
 *
 *  The root layout used to hard-code `alternates.canonical` to the homepage.
 *  Next merges parent metadata into child metadata, and no route page
 *  overrode it, so every page told search engines its content was a duplicate
 *  of `/`. Each page now declares its own path.
 *
 *  The return type is named rather than anonymous so the shape is a contract
 *  callers can rely on. */
const SITE_ORIGIN = "https://www.phoenixfirelabs.com";

/** `canonicalFor("/raven")` -> metadata.alternates for that route. */
// trace:exempt reason=internal-helper
export function canonicalFor(path: string): RouteAlternates {
  return { canonical: path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}` };
}
