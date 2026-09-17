import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";
import { createSessionToken, PREVIEW_COOKIE_NAME_HTTP } from "@/lib/preview-auth";
import { proxy } from "./proxy";

const SECRET = "test-secret-0123456789abcdef0123456789abcdef";

// trace:exempt reason=test-helper
// trace:v1 id=test.preview-gate-fail-closed verifies=REQ-PHO-EM6MDMQA exercises=impl.preview-gate
function request(cookie?: string): NextRequest {
  const headers = new Headers();

  if (cookie != null) headers.set("cookie", cookie);

  return new NextRequest("http://localhost:3000/mockingbird", { headers });
}

afterEach(() => {
  delete process.env.PREVIEW_SESSION_SECRET;
  delete process.env.SITE_PREVIEW_GATED;
});

describe("preview gate", () => {
  it("fails CLOSED when the session secret is missing", () => {
    process.env.SITE_PREVIEW_GATED = "true";

    const response = proxy(request());

    // The original bug: this returned next(), publishing the entire private
    // site on any deploy where PREVIEW_SESSION_SECRET was not set.
    expect(response.status).toBe(503);
    expect(response.headers.get("x-middleware-next")).toBeNull();
  });

  it("redirects an unauthenticated request to the login page", () => {
    process.env.SITE_PREVIEW_GATED = "true";
    process.env.PREVIEW_SESSION_SECRET = SECRET;

    const response = proxy(request());

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login?redirect=%2Fmockingbird");
  });

  it("rejects a token signed with a different secret", () => {
    process.env.SITE_PREVIEW_GATED = "true";
    process.env.PREVIEW_SESSION_SECRET = SECRET;

    const forged = createSessionToken("some-other-secret");
    const response = proxy(request(`${PREVIEW_COOKIE_NAME_HTTP}=${forged}`));

    expect(response.status).toBe(307);
  });

  it("admits a request carrying a valid token", () => {
    process.env.SITE_PREVIEW_GATED = "true";
    process.env.PREVIEW_SESSION_SECRET = SECRET;

    const token = createSessionToken(SECRET);
    const response = proxy(request(`${PREVIEW_COOKIE_NAME_HTTP}=${token}`));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("passes everything through once the gate is lifted", () => {
    process.env.SITE_PREVIEW_GATED = "false";

    expect(proxy(request()).headers.get("x-middleware-next")).toBe("1");
  });
});
