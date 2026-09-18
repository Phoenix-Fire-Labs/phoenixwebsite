import { describe, expect, it } from "vitest";
import { GOVERNMENT_SPEND, NATIONAL, PALISADES } from "@/content/resources";
import { parseMagnitude, proportionOf } from "@/lib/figure-scale";

/** Every sourced figure a visual draws from, so the parser is tested against
 *  the real content rather than against examples chosen to suit it. */
// trace:v1 id=test.figure-scale verifies=REQ-PHO-CC5YAZK2,REQ-PHO-HS2JV1A4 exercises=impl.figure-magnitude,impl.figure-parse,impl.figure-proportion
function sourcedFigures() {
  return [...GOVERNMENT_SPEND, ...NATIONAL, ...PALISADES];
}

describe("parseMagnitude", () => {
  it("reads a plain count with separators", () => {
    expect(parseMagnitude("77,850")).toEqual({ low: 77850, high: 77850, isRange: false });
  });

  it("applies the magnitude suffix", () => {
    expect(parseMagnitude("$4.5B")?.low).toBe(4.5e9);
    expect(parseMagnitude("$37.1M/yr")?.low).toBe(37.1e6);
    expect(parseMagnitude("5.13M acres")?.low).toBe(5.13e6);
  });

  it("keeps a stated range as a range rather than a point estimate", () => {
    const parsed = parseMagnitude("$76–131B");

    expect(parsed).toEqual({ low: 76e9, high: 131e9, isRange: true });
  });

  it("tolerates the approximate marker", () => {
    expect(parseMagnitude("~$40B")).toEqual({ low: 40e9, high: 40e9, isRange: false });
  });

  it("returns null when there is no leading quantity", () => {
    expect(parseMagnitude("no number here")).toBeNull();
  });

  it("parses every sourced figure the visuals draw from", () => {
    for (const figure of sourcedFigures()) {
      expect(parseMagnitude(figure.value), figure.value).not.toBeNull();
    }
  });
});

describe("proportionOf", () => {
  it("is the ratio when the part is smaller", () => {
    expect(proportionOf(37.1e6, 4.5e9)).toBeCloseTo(0.00824, 5);
  });

  it("clamps above one", () => {
    expect(proportionOf(10, 5)).toBe(1);
  });

  it("returns zero rather than dividing by zero", () => {
    expect(proportionOf(5, 0)).toBe(0);
    expect(proportionOf(5, -1)).toBe(0);
  });
});
