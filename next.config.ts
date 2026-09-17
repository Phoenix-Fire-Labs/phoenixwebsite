import type { NextConfig } from "next";

// Preview gate: the whole site sits behind the login until launch.
const gated = process.env.SITE_PREVIEW_GATED !== "false";

// Note: script-src intentionally allows Next.js hydration ('unsafe-inline' +
// 'unsafe-eval'); a per-script hash allowlist is incompatible because browsers
// ignore 'unsafe-inline' when any hash/nonce is listed. The JSON-LD block stays
// byte-stable via HOMEPAGE_JSONLD so it can be re-pinned under a nonce scheme.

const nextConfig: NextConfig = {
  // trace:v1 id=ops.next-config work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Fonts are self-hosted by next/font, so no third-party font
              // origin needs to be allowed any more.
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              // 'self' only: listing http:/https: here permits posting the
              // login and briefing forms to any origin, which is the exact
              // exfiltration this directive exists to prevent.
              "form-action 'self'",
            ].join("; "),
          },
          ...(gated
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
