import { ADJACENT_MARKETS } from "@/content/resources";
import { parseMagnitude, proportionOf } from "@/lib/figure-scale";

/** Adjacent market projections, each drawn as its own span.
 *
 *  A dumbbell per market rather than stacked or grouped bars, because the page
 *  states these overlap and must never be added together. Stacking would draw a
 *  combined total that nobody published and that the text explicitly warns
 *  against; separate spans on a shared axis compare them without implying a sum.
 *
 *  Start and end are parsed from the estimate string, so the drawing cannot
 *  disagree with the figure printed beside it. */
// trace:v1 id=impl.visual-market-spans work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-CC5YAZK2
export function MarketSpans() {
  const rows = ADJACENT_MARKETS.map((row) => {
    // "$19.3B (2024) → $35.7B (2030), 10.8% CAGR"
    const [startText, endText] = row.estimate.split("→");

    return {
      row,
      start: parseMagnitude(startText ?? ""),
      end: parseMagnitude((endText ?? "").trim()),
    };
  }).filter((entry) => entry.start !== null && entry.end !== null);

  const ceiling = Math.max(...rows.map((entry) => entry.end!.high));
  const ceilingLabel = `$${Math.round(ceiling / 1e9)}B`;

  return (
    <figure className="spans">
      <div className="spans-axis" aria-hidden="true">
        <span>$0</span>
        <span>{ceilingLabel}</span>
      </div>
      <ul className="spans-rows">
        {rows.map(({ row, start, end }) => {
          const from = proportionOf(start!.high, ceiling) * 100;
          const to = proportionOf(end!.high, ceiling) * 100;

          return (
            <li key={row.market} className="spans-row">
              <p className="spans-market">{row.market}</p>
              <div className="spans-track">
                <span className="spans-line" style={{ left: `${from}%`, width: `${Math.max(to - from, 0.5)}%` }} />
                <span className="spans-dot spans-dot-start" style={{ left: `${from}%` }} />
                <span className="spans-dot spans-dot-end" style={{ left: `${to}%` }} />
                {to - from < 2 ? <span className="spans-cramped">small relative to the axis</span> : null}
              </div>
              <p className="spans-estimate">{row.estimate}</p>
              <p className="spans-relevance">{row.relevance}</p>
            </li>
          );
        })}
      </ul>
      <figcaption className="spans-caption">
        Commercial market-research projections, drawn on one axis for comparison.
        They overlap and are not additive, so each is its own span rather than a
        segment of a total.
      </figcaption>
    </figure>
  );
}
