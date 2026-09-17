// trace:exempt reason=zero-boundary-test-file-verified-by-vitest-run
import { describe, expect, it } from "vitest";
import { validateBriefing } from "./briefing";

const GOOD = {
  name: "Alex Reyes",
  agency: "Ridge County Fire",
  email: "alex@ridgecounty.gov",
  role: "Battalion Chief",
  useCase: "incident-command",
  message: "We run multi-division incidents and need radio-to-map in seconds, not hours.",
  website: "",
  startedAt: 1_000_000,
};

describe("briefing validation", () => {
  it("accepts a qualified human-speed submission", () => {
    const result = validateBriefing(GOOD, 1_000_000 + 30_000);

    expect(result.ok).toBe(true);

    if (result.ok) expect(result.botLike).toBe(false);
  });

  it("returns field errors without sending on bad input", () => {
    const result = validateBriefing({ ...GOOD, email: "not-an-email" }, 1_000_000 + 30_000);

    expect(result.ok).toBe(false);

    if (!result.ok) expect(result.fields.email).toBeTruthy();
  });

  it("flags honeypot and instant submits as bot-like but valid", () => {
    const honeypot = validateBriefing({ ...GOOD, website: "bot" }, 1_000_000 + 30_000);
    const instant = validateBriefing(GOOD, 1_000_000 + 500);

    expect(honeypot.ok && honeypot.botLike).toBe(true);
    expect(instant.ok && instant.botLike).toBe(true);
  });
});
