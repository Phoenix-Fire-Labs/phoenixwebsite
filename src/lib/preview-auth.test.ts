// trace:exempt reason=zero-boundary-test-file-verified-by-vitest-run
import { describe, expect, it } from "vitest";
import {
  buildSessionCookie,
  createSessionToken,
  hashPreviewPassword,
  PREVIEW_COOKIE_NAME,
  PREVIEW_COOKIE_NAME_HTTP,
  previewCookieName,
  verifyPreviewPassword,
  verifySessionToken,
} from "./preview-auth";

describe("preview gate", () => {
  it("accepts the right password and rejects the wrong one", async () => {
    const hash = await hashPreviewPassword("correct horse");
    await expect(verifyPreviewPassword("correct horse", hash)).resolves.toBe(true);
    await expect(verifyPreviewPassword("wrong horse", hash)).resolves.toBe(false);
  });

  it("issues 24h sessions and rejects tampered or foreign tokens", () => {
    const secret = "a".repeat(64);
    const token = createSessionToken(secret);
    expect(verifySessionToken(token, secret)).toBe(true);
    expect(verifySessionToken(`${token}x`, secret)).toBe(false);
    expect(verifySessionToken(token, "b".repeat(64))).toBe(false);
  });

  it("sets a host-bound strict cookie", () => {
    const cookie = buildSessionCookie("tok", "https://www.phoenixfirelabs.com/login");
    expect(cookie.startsWith(`${PREVIEW_COOKIE_NAME}=tok;`)).toBe(true);

    for (const flag of ["Path=/", "HttpOnly", "Secure", "SameSite=Strict", "Max-Age=86400"]) {
      expect(cookie).toContain(flag);
    }

    expect(cookie).not.toContain("Domain=");
  });

  it("uses a non-secure cookie on http dev origins", () => {
    const cookie = buildSessionCookie("tok", "http://localhost:3000/login");
    expect(cookie.startsWith(`${PREVIEW_COOKIE_NAME_HTTP}=tok;`)).toBe(true);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).not.toContain("Secure");
  });
});

describe("cookie name is scheme-exclusive", () => {
  it("uses the __Host- name on https and the plain name on http", () => {
    expect(previewCookieName("https://www.phoenixfirelabs.com/")).toBe(PREVIEW_COOKIE_NAME);
    expect(previewCookieName("http://localhost:3000/")).toBe(PREVIEW_COOKIE_NAME_HTTP);
  });

  it("never offers the plain name on https", () => {
    // Accepting both on https would make the __Host- prefix decorative.
    expect(previewCookieName("https://www.phoenixfirelabs.com/")).not.toBe(PREVIEW_COOKIE_NAME_HTTP);
  });

  it("builds a Secure __Host- cookie on https only", () => {
    const https = buildSessionCookie("t", "https://www.phoenixfirelabs.com/");
    const http = buildSessionCookie("t", "http://localhost:3000/");

    expect(https).toContain(PREVIEW_COOKIE_NAME);
    expect(https).toContain("Secure");
    expect(http).toContain(PREVIEW_COOKIE_NAME_HTTP);
    expect(http).not.toContain("Secure");
  });
});
