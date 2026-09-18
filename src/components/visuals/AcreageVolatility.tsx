import { ACREAGE_BY_YEAR } from "@/content/resources";
import { parseMagnitude, proportionOf } from "@/lib/figure-scale";

/** Acres burned, the two years the note compares.
 *
 *  Drawn as two separated columns with no connecting line, on purpose. The
 *  accompanying text argues that activity is volatile rather than smoothly
 *  increasing and that any argument resting on a single year's trend line is
 *  the wrong argument — so a line through two points would illustrate exactly
 *  the reasoning the page rejects. The drop is stated as a computed figure
 *  instead. */
// trace:v1 id=impl.visual-acreage-volatility work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-QFMRA2KE
export function AcreageVolatility() {
  const bars = ACREAGE_BY_YEAR.map((entry) => ({
    ...entry,
    magnitude: parseMagnitude(entry.value),
  })).filter((bar) => bar.magnitude !== null);

  const peak = Math.max(...bars.map((bar) => bar.magnitude!.high));
  const [earlier, later] = bars;

  const change =
    earlier && later
      ? (1 - proportionOf(later.magnitude!.high, earlier.magnitude!.high)) * 100
      : 0;

  return (
    <figure className="acreage">
      <div className="acreage-plot">
        {bars.map((bar) => (
          <div key={bar.year} className="acreage-col">
            <span className="acreage-value">{bar.value}</span>
            <div
              className="acreage-bar"
              style={{ height: `${proportionOf(bar.magnitude!.high, peak) * 100}%` }}
            />
            <span className="acreage-year">{bar.year}</span>
          </div>
        ))}
      </div>
      <figcaption className="acreage-caption">
        {change > 0 ? `${change.toFixed(0)}% fewer acres than the year before. ` : null}
        Two years, deliberately not joined into a trend line.
        <span className="figure-source">Source: {bars[0]?.source}</span>
      </figcaption>
    </figure>
  );
}
