/** Magnitude parsing for the sourced figures in `src/content/resources.ts`.
 *
 *  Those figures are authored as display strings ("$4.5B", "5.13M acres",
 *  "$76–131B") because the source note and the formatting are the point. A
 *  visual that wants to draw them proportionally needs a number, and the only
 *  honest place to get one is the string itself — duplicating the values as
 *  numeric literals in a component is how a chart ends up disagreeing with the
 *  caption printed beside it. */

// trace:v1 id=impl.figure-magnitude work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-HS2JV1A4
export interface Magnitude {
  /** Low end. Equal to `high` unless the source states a range. */
  low: number;
  /** High end. Greater than `low` only for a stated range. */
  high: number;
  /** True when the source expressed a range ("$76–131B"), so a visual can
   *  render the span rather than implying a point estimate. */
  isRange: boolean;
}

const SUFFIX = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 } satisfies Record<string, number>;

/** Multiplier for a magnitude suffix; 1 when the figure carries none. */
// trace:exempt reason=internal-detail -- suffix lookup for parseMagnitude
function suffixScale(suffix: string | undefined): number {
  const key = (suffix ?? "").toLowerCase();

  // SAFETY: guarded by the `in` check on the line itself, so the key is one
  // of SUFFIX's own properties.
  return key in SUFFIX ? SUFFIX[key as keyof typeof SUFFIX] : 1;
}

/** Reads the leading quantity out of a figure string, following its suffix.
 *
 *  Returns null when there is no leading number, which is a legitimate outcome
 *  for a label-only figure rather than an error worth throwing over. */
// trace:v1 id=impl.figure-parse work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-HS2JV1A4
export function parseMagnitude(value: string): Magnitude | null {
  // En dash is what the content files use for ranges; hyphen is accepted so a
  // later edit typing "-" does not silently become a point estimate.
  const range = /^[~$]*\s*([\d,.]+)\s*[–-]\s*([\d,.]+)\s*([kmbt])?/i.exec(value.trim());

  if (range) {
    const scale = suffixScale(range[3]);
    const low = Number(range[1].replaceAll(",", "")) * scale;
    const high = Number(range[2].replaceAll(",", "")) * scale;

    if (!Number.isFinite(low) || !Number.isFinite(high)) return null;

    return { low, high, isRange: high !== low };
  }

  const single = /^[~$]*\s*([\d,.]+)\s*([kmbt])?/i.exec(value.trim());

  if (!single) return null;

  const scale = suffixScale(single[2]);
  const amount = Number(single[1].replaceAll(",", "")) * scale;

  if (!Number.isFinite(amount)) return null;

  return { low: amount, high: amount, isRange: false };
}

/** Fraction of `whole` that `part` occupies, clamped to 0..1.
 *
 *  Returns 0 for a non-positive whole rather than Infinity or NaN, so a
 *  mis-parsed figure renders as an empty bar instead of an unbounded one. */
// trace:v1 id=impl.figure-proportion work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-CC5YAZK2
export function proportionOf(part: number, whole: number): number {
  if (!(whole > 0) || !(part > 0)) return 0;

  return Math.min(part / whole, 1);
}
