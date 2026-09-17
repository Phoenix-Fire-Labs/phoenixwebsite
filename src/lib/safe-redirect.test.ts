// trace:exempt reason=zero-boundary-test-file-verified-by-vitest-run
import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect";

const BASE = "https://www.phoenixfirelabs.com/login";

describe("safeRedirect", () => {
  it("passes same-origin paths with query and hash", () => {
    expect(safeRedirect("/?a=1#top", BASE)).toBe("/?a=1#top");
  });

  it("rejects open redirects and scheme tricks", () => {
    for (const evil of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "/%2fevil.example",
      "/%5cevil.example",
      "javascript:alert(1)",
      "data:text/html,hi",
      "/\n/evil.example",
    ]) {
      expect(safeRedirect(evil, BASE)).toBe("/");
    }
  });

  it("never bounces back into the login gate", () => {
    expect(safeRedirect("/login?redirect=/", BASE)).toBe("/");
  });

  it("falls back for missing or non-string input", () => {
    expect(safeRedirect(null, BASE)).toBe("/");
    expect(safeRedirect("", BASE)).toBe("/");
  });
});
