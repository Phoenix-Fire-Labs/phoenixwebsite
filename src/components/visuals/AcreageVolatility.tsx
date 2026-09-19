import { ACREAGE_BY_YEAR } from "@/content/resources";
import { parseMagnitude, proportionOf } from "@/lib/figure-scale";

/** Acres burned, the two years the note compares.
 *
 *  Two separated columns with no connecting line, on purpose. The accompanying
 *  text argues that activity is volatile rather than smoothly increasing and
 *  that any argument resting on a single year's trend line is the wrong
 *  argument -- so a line through two points would illustrate exactly the
 *  reasoning the page rejects. The drop is stated as a computed figure
 *  spanning the gap instead, which reads as a comparison rather than a slope. */
// trace:v1 id=impl.visual-acreage-volatility work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-QFMRA2KE
export function AcreageVolatility() {
  const bars = ACREAGE_BY_YEAR.flatMap((entry) => {
    const magnitude = parseMagnitude(entry.value);

    return magnitude == null ? [] : [{ ...entry, magnitude }];
  });

  const peak = Math.max(...bars.map((bar) => bar.magnitude.high));
  const [earlier, later] = bars;

  const change =
    earlier && later ? (1 - proportionOf(later.magnitude.high, earlier.magnitude.high)) * 100 : 0;

  const PLOT_TOP = 46;
  const BASELINE = 196;
  const HEIGHT = BASELINE - PLOT_TOP;

  return (
    <figure className="acreage">
      <svg
        className="acreage-svg"
        viewBox="0 0 400 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={bars.map((bar) => `${bar.year}: ${bar.value}`).join("; ")}
      >
        {bars.map((bar, i) => {
          const h = proportionOf(bar.magnitude.high, peak) * HEIGHT;
          const x = 46 + i * 190;

          return (
            <g key={bar.year}>
              <text x={x + 62} y={PLOT_TOP + (HEIGHT - h) - 14} className="acreage-value" textAnchor="middle">
                {bar.value}
              </text>
              <rect
                className={i === bars.length - 1 ? "acreage-bar acreage-bar-latest" : "acreage-bar"}
                x={x}
                y={PLOT_TOP + (HEIGHT - h)}
                width="124"
                height={h}
                rx="2"
              />
              <text x={x + 62} y={BASELINE + 20} className="acreage-year" textAnchor="middle">{bar.year}</text>
            </g>
          );
        })}

        <line x1="20" y1={BASELINE} x2="380" y2={BASELINE} stroke="var(--color-rule)" strokeWidth="1" />

        {change > 0 ? (
          <g>
            <line x1="176" y1="92" x2="230" y2="92" stroke="var(--color-text-tertiary)" strokeWidth="1" strokeDasharray="2 3" />
            <text x="203" y="84" className="acreage-delta" textAnchor="middle">
              {change.toFixed(0)}% fewer
            </text>
          </g>
        ) : null}
      </svg>
      <figcaption className="acreage-caption">
        Two years, deliberately not joined into a trend line.
        <span className="figure-source">Source: {bars[0]?.source}</span>
      </figcaption>
    </figure>
  );
}
