import { Fragment } from "react";
import { SOLUTIONS } from "@/content/solutions";
import { PRODUCTS } from "@/lib/product-status";

/** Which systems each solution engages.
 *
 *  The page's claim is that these are not three separate offerings but one
 *  family entered from different roles, and the shape of the grid is the
 *  argument: the same columns light up across every row. Drawn as bars per
 *  solution rather than ticks in a table so the overlap is visible at a glance
 *  rather than requiring the reader to compare rows cell by cell.
 *
 *  Derived from the solution definitions and the product registry, so it
 *  cannot fall out of step with either. A real table still carries the data
 *  for assistive technology; the bars are marked decorative. */
// trace:v1 id=impl.visual-solution-matrix work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-TQ5N9DVW
export function SolutionMatrix() {
  const engaged = PRODUCTS.filter((product) =>
    SOLUTIONS.some((solution) => solution.systems.some((system) => system.slug === product.slug)),
  );

  return (
    <figure className="matrix">
      {/* One flat grid rather than nested rows: subgrid support is still
          uneven, and a flat track list needs no alignment trickery. */}
      <div
        className="matrix-grid"
        aria-hidden="true"
        style={{ gridTemplateColumns: `minmax(7rem, 1.4fr) repeat(${engaged.length}, 1fr)` }}
      >
        <div />
        {engaged.map((product) => (
          <div key={product.slug} className="matrix-col">{product.name}</div>
        ))}

        {SOLUTIONS.map((solution) => (
          <Fragment key={solution.slug}>
            <div className="matrix-row-name">{solution.title}</div>
            {engaged.map((product) => {
              const on = solution.systems.some((system) => system.slug === product.slug);

              return (
                <div key={product.slug} className={on ? "matrix-cell matrix-cell-on" : "matrix-cell"}>
                  <span className="matrix-mark" />
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>

      <table className="sr-only">
        <caption>Systems each solution engages</caption>
        <thead>
          <tr>
            <th scope="col">Solution</th>
            {engaged.map((product) => <th key={product.slug} scope="col">{product.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {SOLUTIONS.map((solution) => (
            <tr key={solution.slug}>
              <th scope="row">{solution.title}</th>
              {engaged.map((product) => (
                <td key={product.slug}>
                  {solution.systems.some((system) => system.slug === product.slug) ? "engaged" : "not engaged"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <figcaption className="matrix-caption">
        The same family, entered from a different role. Where a column is filled
        across every row, that system is doing work in all three.
      </figcaption>
    </figure>
  );
}
