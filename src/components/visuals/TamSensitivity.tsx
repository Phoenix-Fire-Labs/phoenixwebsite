import { TAM_SENSITIVITY } from "@/content/resources";
import { parseMagnitude, proportionOf } from "@/lib/figure-scale";

/** Implied ceiling at three hypothetical contract values.
 *
 *  The heading on this section is "TAM sensitivity, not a TAM claim", and the
 *  visual has to carry that distinction rather than undercut it. So the three
 *  cases are drawn as separate rows at equal visual weight with no case
 *  highlighted, no midpoint implied and nothing marked as expected — the shape
 *  of a sensitivity analysis, not of a forecast with a preferred answer. */
// trace:v1 id=impl.visual-tam-sensitivity work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-HS2JV1A4
export function TamSensitivity() {
  const rows = TAM_SENSITIVITY.rows.map((row) => ({
    ...row,
    magnitude: parseMagnitude(row.ceiling),
  })).filter((row) => row.magnitude !== null);

  const ceiling = Math.max(...rows.map((row) => row.magnitude!.high));

  return (
    <figure className="tam">
      <ul className="tam-rows">
        {rows.map((row) => (
          <li key={row.contract} className="tam-row">
            <span className="tam-contract">{row.contract}</span>
            <span className="tam-track">
              <span
                className="tam-bar"
                style={{ width: `${proportionOf(row.magnitude!.high, ceiling) * 100}%` }}
              />
            </span>
            <span className="tam-ceiling">{row.ceiling}</span>
          </li>
        ))}
      </ul>
      <figcaption className="tam-caption">
        Each row is an independent hypothetical, not a range around an expected
        value. Base: {TAM_SENSITIVITY.base}
      </figcaption>
    </figure>
  );
}
