import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./same-origin";

// trace:exempt reason=test-helper
function req(headers: Record<string, string>): Request {
  // request.url deliberately disagrees with the Host header: that is exactly
  // what Next does in production and what broke the first implementation.
  return new Request("http://localhost:3119/api/contact", { method: "POST", headers });
}

describe("isSameOrigin", () => {
  it("accepts an Origin matching the Host the client addressed", () => {
    expect(isSameOrigin(req({ host: "127.0.0.1:3119", origin: "http://127.0.0.1:3119" }))).toBe(true);
  });

  it("accepts the real production host", () => {
    expect(
      isSameOrigin(req({ host: "www.phoenixfirelabs.com", origin: "https://www.phoenixfirelabs.com" })),
    ).toBe(true);
  });

  it("prefers x-forwarded-host when the platform sets it", () => {
    expect(
      isSameOrigin(
        req({
          host: "internal.vercel.app",
          "x-forwarded-host": "www.phoenixfirelabs.com",
          origin: "https://www.phoenixfirelabs.com",
        }),
      ),
    ).toBe(true);
  });

  it("rejects a foreign Origin", () => {
    expect(
      isSameOrigin(req({ host: "www.phoenixfirelabs.com", origin: "https://evil.example" })),
    ).toBe(false);
  });

  it("rejects a suffix-matching host", () => {
    expect(
      isSameOrigin(
        req({ host: "www.phoenixfirelabs.com", origin: "https://www.phoenixfirelabs.com.evil.example" }),
      ),
    ).toBe(false);
  });

  it("rejects an opaque Origin", () => {
    expect(isSameOrigin(req({ host: "www.phoenixfirelabs.com", origin: "null" }))).toBe(false);
  });

  it("falls back to Referer when Origin is absent", () => {
    expect(
      isSameOrigin(req({ host: "www.phoenixfirelabs.com", referer: "https://www.phoenixfirelabs.com/contact" })),
    ).toBe(true);
    expect(
      isSameOrigin(req({ host: "www.phoenixfirelabs.com", referer: "https://evil.example/attack" })),
    ).toBe(false);
  });

  it("rejects a request carrying neither header", () => {
    expect(isSameOrigin(req({ host: "www.phoenixfirelabs.com" }))).toBe(false);
  });

  it("rejects an unparseable Referer", () => {
    expect(isSameOrigin(req({ host: "www.phoenixfirelabs.com", referer: "not a url" }))).toBe(false);
  });

  it("rejects when no Host can be determined", () => {
    const bare = new Request("http://localhost:3119/api/contact", { method: "POST" });

    bare.headers.delete("host");
    expect(isSameOrigin(bare)).toBe(false);
  });
});
