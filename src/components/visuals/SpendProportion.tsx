import { GOVERNMENT_SPEND } from "@/content/resources";
import { parseMagnitude, proportionOf } from "@/lib/figure-scale";

/** Government spend at proportional width, against the largest line.
 *
 *  The page argues that agencies already fund this problem and that Phoenix has
 *  to earn part of existing spend. Rendered as four equal cards, that argument
 *  is invisible: the AI-intelligence line reads at the same visual weight as
 *  the budget it comes out of. At proportional width it reads as what it is,
 *  and the percentage is computed rather than asserted.
 *
 *  These are deliberately drawn as magnitudes on a shared axis, NOT as a
 *  stacked breakdown of one budget — a state budget and a federal request are
 *  not parts of the same whole, and stacking them would invent a total nobody
 *  published. */
// trace:v1 id=impl.visual-spend-proportion work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-CC5YAZK2
export function SpendProportion() {
  const rows = GOVERNMENT_SPEND.map((figure) => ({
    figure,
    magnitude: parseMagnitude(figure.value),
  })).filter((row) => row.magnitude !== null);

  const largest = Math.max(...rows.map((row) => row.magnitude!.high));
  const reference = rows[0];

  return (
    <figure className="spend-proportion">
      <ul className="spend-rows">
        {rows.map(({ figure, magnitude }) => {
          const share = proportionOf(magnitude!.high, largest);
          // Below this width a bar is a sliver no label can sit inside, which
          // is exactly the finding worth stating in words instead.
          const tiny = share < 0.05;

          return (
            <li key={figure.label} className="spend-row">
              <div className="spend-head">
                <span className="spend-value">{figure.value}</span>
                <span className="spend-label">{figure.label}</span>
              </div>
              <div className="spend-track">
                <div
                  className={tiny ? "spend-bar spend-bar-tiny" : "spend-bar"}
                  style={{ width: `${Math.max(share * 100, 0.35)}%` }}
                />
              </div>
              <p className="spend-note">
                {tiny && reference
                  ? `${(proportionOf(magnitude!.high, parseMagnitude(reference.figure.value)?.high ?? 0) * 100).toFixed(1)}% of the ${reference.figure.label}`
                  : null}
                <span className="figure-source">Source: {figure.source}</span>
              </p>
            </li>
          );
        })}
      </ul>
      <figcaption className="spend-caption">
        Magnitudes on a shared axis. A state budget and a federal request are not
        parts of one total, so these are compared, never summed.
      </figcaption>
    </figure>
  );
}
