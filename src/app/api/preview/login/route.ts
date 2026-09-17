import { NextResponse } from "next/server";
import {
  buildSessionCookie,
  createSessionToken,
  verifyPreviewPassword,
} from "@/lib/preview-auth";
import { clearFailures, clientKey, overBudget, recordFailure } from "@/lib/rate-limit";
import { safeRedirect } from "@/lib/safe-redirect";
import { isSameOrigin } from "@/lib/same-origin";

const LOGIN_LIMIT = { windowMs: 60_000, max: 10 };

// trace:v1 id=impl.preview-login-route work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export async function POST(request: Request) {
  // A cross-site POST here cannot be a real login attempt; refusing it also
  // keeps the scrypt work off the table as a remote CPU-burn primitive.
  if (!isSameOrigin(request)) {
    return new NextResponse("Request origin rejected.", { status: 403 });
  }

  // Spec §37 puts 10 attempts/min/IP on this endpoint. The durable rule is a
  // platform WAF policy, but none is checked in, so without this the shared
  // password is unthrottled. Refusing before scrypt also keeps the 16 MiB
  // derivation from being a remote CPU-burn primitive.
  //
  // Only failures count. Counting successes as well would lock out a shared
  // office or VPN address for people entering the correct password.
  const source = clientKey(request);

  if (overBudget("preview-login", source, LOGIN_LIMIT)) {
    return new NextResponse("Too many attempts. Try again shortly.", {
      status: 429,
      headers: { "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }

  const hash = process.env.PREVIEW_PASSWORD_HASH;
  const secret = process.env.PREVIEW_SESSION_SECRET;

  if (!hash || !secret) {
    return new NextResponse(
      "Server is missing PREVIEW_PASSWORD_HASH or PREVIEW_SESSION_SECRET configuration.",
      { status: 500 },
    );
  }

  const form = await request.formData();
  // A FormDataEntryValue is string | File and arrives unparsed from the request
  // boundary; the check below IS the decoder. String(File) would stringify to
  // "[object File]" and then be compared as if it were a password.
  const passwordField = form.get("password");
  // eslint-disable-next-line anti-slop/no-runtime-typeof -- this IS the I/O boundary decoder.
  const submitted = typeof passwordField === "string" ? passwordField : "";
  const redirectTo = safeRedirect(form.get("redirect"), "https://www.phoenixfirelabs.com");

  // Relative Location for the same reason as the briefing route: Next
  // normalizes request.url's hostname, so an absolute redirect built from it
  // can point at the wrong host.
  if (!(await verifyPreviewPassword(submitted, hash))) {
    recordFailure("preview-login", source, LOGIN_LIMIT);

    const query = new URLSearchParams({ error: "1", redirect: redirectTo });

    return new Response(null, { status: 303, headers: { Location: `/login?${query}` } });
  }

  clearFailures("preview-login", source);

  return new Response(null, {
    status: 303,
    headers: {
      Location: redirectTo,
      "Set-Cookie": buildSessionCookie(createSessionToken(secret), request.url),
    },
  });
}
