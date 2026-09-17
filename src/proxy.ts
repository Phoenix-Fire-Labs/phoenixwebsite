import { NextResponse, type NextRequest } from "next/server";
import { previewCookieName, verifySessionToken } from "@/lib/preview-auth";

/** Private-preview gate.
 *
 *  Fails CLOSED. A missing PREVIEW_SESSION_SECRET is a misconfiguration, not
 *  permission to serve: without it no token can be verified, so every request
 *  is unauthenticated by definition. Returning `next()` there would publish
 *  the entire private site on any deploy where the env var was forgotten. */
// trace:v1 id=impl.preview-gate work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export function proxy(request: NextRequest) {
  if (process.env.SITE_PREVIEW_GATED === "false") return NextResponse.next();

  const secret = process.env.PREVIEW_SESSION_SECRET;

  if (!secret) {
    return new NextResponse("Preview gate is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  // Only the name valid for this scheme is accepted. Reading either name on
  // either scheme let a plain cookie stand in for the `__Host-` one on HTTPS,
  // which silently voided that prefix's Secure/Path/Domain enforcement.
  const token = request.cookies.get(previewCookieName(request.url))?.value;

  if (verifySessionToken(token, secret)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "redirect",
    request.nextUrl.pathname + request.nextUrl.search,
  );

  const response = NextResponse.redirect(loginUrl);
  response.headers.set("Cache-Control", "no-store");

  return response;
}

export const config = {
  matcher: [
    // robots.txt and sitemap.xml are exempt on purpose: gating them served
    // crawlers the login page instead, which made robots.ts's `Disallow: /`
    // branch unreachable in the very state it exists for. Both are safe to
    // expose — while gated, robots disallows everything and the sitemap is
    // empty. noindex still rides on the X-Robots-Tag header for every route
    // (spec §44: do not rely on robots.txt alone).
    "/((?!api/preview/login|login|robots\\.txt|sitemap\\.xml|favicon\\.ico|apple-touch-icon\\.png|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js|map|woff2?)$).*)",
  ],
};
