import { after, NextResponse } from "next/server";
import { validateBriefing, type BriefingInput } from "@/lib/briefing";
import { clientKey, rateLimited } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/same-origin";

const CONTACT_LIMIT = { windowMs: 10 * 60 * 1000, max: 20 };

/** Exactly what this route sends outward. Naming the three shapes keeps the
 *  fan-out honest: the CRM and analytics sinks receive a deliberate subset,
 *  never the whole submission, and the honeypot field is always stripped. */
// trace:exempt reason=internal-detail -- webhook payload shapes
type WebhookPayload =
  | (Omit<BriefingInput, "website"> & { website: undefined })
  | { email: string; agency: string; useCase: string; source: string }
  | { event: string; useCase: string };

const WEBHOOK_TIMEOUT_MS = 5_000;

/** POST JSON to a server-configured webhook. Returns whether it was accepted.
 *  Never throws: an unreachable CRM or analytics sink must not take down the
 *  briefing intake, and the primary inbox failure is handled by the caller. */
// trace:exempt reason=internal-helper
async function postJson(url: string, body: WebhookPayload): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    return response.ok;
  } catch {
    return false;
  }
}

// trace:exempt reason=internal-detail -- content negotiation
function wantsJson(request: Request): boolean {
  return (request.headers.get("accept") ?? "").includes("application/json");
}

/** Bounce back to the contact page on whatever host served the form.
 *
 *  A relative Location is deliberate: hardcoding the production host sent every
 *  localhost and preview-deploy submission to www.phoenixfirelabs.com, and
 *  deriving one from `request.url` is no better because Next normalizes that
 *  URL's hostname. RFC 7231 allows a relative reference, and the browser
 *  resolves it against the host it actually asked. */
// trace:exempt reason=internal-detail -- form redirect target
function contactRedirect(success: boolean): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: success ? "/contact?sent=1" : "/contact?error=1" },
  });
}

/** Briefing intake: validate, silently accept bot-like, route humans to inbox. */
// trace:v1 id=impl.briefing-route work=WORK-PHO-18KENMFK satisfies=REQ-PHO-9Q311JSZ
export async function POST(request: Request) {
  const now = Date.now();

  // Cross-site form POSTs need no preflight; reject them before any work.
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, fields: { form: "Request origin rejected." } }, { status: 403 });
  }

  // Tell a throttled requester the truth. Returning success and dropping the
  // submission meant someone on a shared address was told "Received" while
  // their briefing went nowhere — the worst possible outcome for the audience
  // this form exists to serve. Bots can infer throttling anyway.
  if (rateLimited("contact", clientKey(request), CONTACT_LIMIT, now)) {
    if (wantsJson(request)) {
      return NextResponse.json(
        { ok: false, fields: { form: "Too many requests from this network. Try again shortly." } },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    }

    return new Response(null, {
      status: 303,
      headers: { Location: "/contact?error=throttled", "Retry-After": "600" },
    });
  }

  const form = await request.formData();

  const result = validateBriefing(
    {
      name: form.get("name"),
      agency: form.get("agency"),
      email: form.get("email"),
      role: form.get("role"),
      useCase: form.get("useCase"),
      message: form.get("message"),
      website: form.get("website") ?? "",
      startedAt: form.get("startedAt"),
    },
    now,
  );

  if (!result.ok) {
    if (wantsJson(request)) return NextResponse.json({ ok: false, fields: result.fields }, { status: 400 });

    // Carry the field names back so the page can mark them, rather than
    // showing one generic banner for every possible failure.
    const invalid = Object.keys(result.fields).join(",");

    return new Response(null, {
      status: 303,
      headers: { Location: `/contact?error=1&fields=${encodeURIComponent(invalid)}` },
    });
  }

  // Bot-like submissions get the same success response but are never routed.
  if (!result.botLike) {
    const inbox = process.env.BRIEFING_INBOX;

    if (!inbox) {
      if (wantsJson(request)) {
        return NextResponse.json({ ok: false, fields: { form: "Briefing inbox is not configured." } }, { status: 500 });
      }

      return contactRedirect(false);
    }

    // A hung webhook must not hold the request open indefinitely, and a failed
    // one must be reported rather than swallowed: the requester needs to know
    // their briefing did not land.
    const delivered = await postJson(inbox, { ...result.input, website: undefined });

    if (!delivered) {
      if (wantsJson(request)) {
        return NextResponse.json(
          { ok: false, fields: { form: "Could not route the request. Please email us directly." } },
          { status: 502 },
        );
      }

      return contactRedirect(false);
    }

    // The inbox has accepted the briefing, so the requester is done. CRM and
    // analytics ran serially before this, each able to consume the full 5s
    // timeout, which meant two optional sinks could add 10s to a response
    // that was already successful. `after` runs them once the response has
    // been sent, and keeps the work alive on serverless rather than having it
    // cancelled with the invocation.
    after(async () => {
      // trace:exempt reason=internal-detail -- CRM fan-out
      const crm = process.env.BRIEFING_CRM_URL;

      // trace:exempt reason=internal-detail -- analytics event
      const analytics = process.env.BRIEFING_ANALYTICS_URL;

      await Promise.allSettled([
        crm
          ? postJson(crm, {
              email: result.input.email,
              agency: result.input.agency,
              useCase: result.input.useCase,
              source: "phoenix-briefing",
            })
          : Promise.resolve(true),
        analytics
          ? postJson(analytics, { event: "briefing_request", useCase: result.input.useCase })
          : Promise.resolve(true),
      ]);
    });

  }

  if (wantsJson(request)) return NextResponse.json({ ok: true }, { status: 200 });

  return contactRedirect(true);
}
