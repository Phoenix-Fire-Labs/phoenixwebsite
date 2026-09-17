/** Cross-site request forgery guard for the state-changing form endpoints.
 *
 *  Both POST routes accept `application/x-www-form-urlencoded`, which a browser
 *  sends cross-site with no preflight, so the SameSite cookie alone does not
 *  settle it for the briefing intake.
 *
 *  The comparison is Origin against the request's own Host, not against
 *  `request.url`: Next normalizes the URL's hostname (a request to
 *  127.0.0.1:3119 arrives with `request.url` reading localhost:3119), so
 *  comparing origins rejects legitimate submissions. Host is what the client
 *  actually addressed. This is also the OWASP recommendation.
 *
 *  A forged Host or X-Forwarded-Host is not a CSRF bypass: a cross-site page
 *  cannot set either header on a form post. An attacker who can set them is
 *  issuing the request directly, which this guard was never the control for. */

// trace:exempt reason=internal-helper
function effectiveHost(request: Request): string | null {
  // Vercel sets both; the forwarded value is the externally addressed host.
  const forwarded = request.headers.get("x-forwarded-host");

  if (forwarded != null && forwarded !== "") return forwarded.split(",")[0].trim().toLowerCase();

  const host = request.headers.get("host");

  return host != null && host !== "" ? host.toLowerCase() : null;
}

// trace:v1 id=impl.same-origin work=WORK-PHO-18KENMFK satisfies=REQ-PHO-9Q311JSZ
export function isSameOrigin(request: Request): boolean {
  const host = effectiveHost(request);

  if (host == null) return false;

  // trace:exempt reason=internal-helper
  const hostOf = (value: string): string | null => {
    try {
      return new URL(value).host.toLowerCase();
    } catch {
      return null;
    }
  };

  const origin = request.headers.get("origin");

  if (origin != null && origin !== "" && origin !== "null") return hostOf(origin) === host;

  const referer = request.headers.get("referer");

  if (referer == null || referer === "") return false;

  return hostOf(referer) === host;
}
