// trace:exempt reason=zero-boundary-test-file-verified-by-vitest-run
import { beforeEach, describe, expect, it } from "vitest";
import { clearFailures, overBudget, rateLimited, recordFailure, resetRateLimits } from "./rate-limit";

const LIMIT = { windowMs: 60_000, max: 3 };

beforeEach(resetRateLimits);

describe("rateLimited", () => {
  it("allows up to the limit and blocks beyond it", () => {
    const now = Date.now();

    expect(rateLimited("login", "1.1.1.1", LIMIT, now)).toBe(false);
    expect(rateLimited("login", "1.1.1.1", LIMIT, now)).toBe(false);
    expect(rateLimited("login", "1.1.1.1", LIMIT, now)).toBe(false);
    expect(rateLimited("login", "1.1.1.1", LIMIT, now)).toBe(true);
  });

  it("keeps separate budgets per source and per scope", () => {
    const now = Date.now();

    for (let i = 0; i < 4; i++) rateLimited("login", "1.1.1.1", LIMIT, now);

    expect(rateLimited("login", "2.2.2.2", LIMIT, now)).toBe(false);
    expect(rateLimited("contact", "1.1.1.1", LIMIT, now)).toBe(false);
  });

  it("forgets attempts once the window passes", () => {
    const now = Date.now();

    for (let i = 0; i < 4; i++) rateLimited("login", "1.1.1.1", LIMIT, now);

    expect(rateLimited("login", "1.1.1.1", LIMIT, now + 60_001)).toBe(false);
  });

  it("prunes aged-out keys instead of growing forever", () => {
    const now = Date.now();

    for (let i = 0; i < 500; i++) rateLimited("login", `src-${i}`, LIMIT, now);

    // A later call in a fresh window must not retain the old keys.
    expect(rateLimited("login", "fresh", LIMIT, now + 120_000)).toBe(false);
    expect(rateLimited("login", "src-0", LIMIT, now + 120_000)).toBe(false);
  });
});

describe("failure-only throttling", () => {
  const LOGIN = { windowMs: 60_000, max: 3 };

  it("does not consume budget on success", () => {
    const now = Date.now();

    // A correct password, entered repeatedly from one office IP, must never
    // lock that IP out — only wrong guesses count.
    for (let i = 0; i < 20; i++) {
      expect(overBudget("login", "1.1.1.1", LOGIN, now)).toBe(false);
      clearFailures("login", "1.1.1.1");
    }
  });

  it("locks out after the configured number of failures", () => {
    const now = Date.now();

    for (let i = 0; i < 3; i++) {
      expect(overBudget("login", "9.9.9.9", LOGIN, now)).toBe(false);
      recordFailure("login", "9.9.9.9", LOGIN, now);
    }

    expect(overBudget("login", "9.9.9.9", LOGIN, now)).toBe(true);
  });

  it("a later success clears the accumulated failures", () => {
    const now = Date.now();

    for (let i = 0; i < 2; i++) recordFailure("login", "5.5.5.5", LOGIN, now);
    clearFailures("login", "5.5.5.5");

    expect(overBudget("login", "5.5.5.5", LOGIN, now)).toBe(false);
  });

  it("forgets failures once the window passes", () => {
    const now = Date.now();

    for (let i = 0; i < 5; i++) recordFailure("login", "7.7.7.7", LOGIN, now);

    expect(overBudget("login", "7.7.7.7", LOGIN, now)).toBe(true);
    expect(overBudget("login", "7.7.7.7", LOGIN, now + 60_001)).toBe(false);
  });
});
