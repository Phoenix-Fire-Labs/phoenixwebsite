import { SOLUTIONS } from "@/content/solutions";
import { PRODUCTS } from "@/lib/product-status";

/** Which systems each solution engages.
 *
 *  The index page previously described three solutions in prose that each named
 *  the same three systems, which reads as three unrelated offerings. As a grid
 *  the actual shape is visible at once: one system family, entered from
 *  different roles — which is the claim the page is making.
 *
 *  Derived from the solution definitions and the product registry, so it cannot
 *  fall out of step with either. */
// trace:v1 id=impl.visual-solution-matrix work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-TQ5N9DVW
export function SolutionMatrix() {
  const engaged = PRODUCTS.filter((product) =>
    SOLUTIONS.some((solution) => solution.systems.some((system) => system.slug === product.slug)),
  );

  return (
    <figure className="matrix">
      <div className="matrix-scroll">
        <table className="matrix-table">
          <caption className="figure-source">
            Systems each solution engages today. The same family, entered from a
            different role.
          </caption>
          <thead>
            <tr>
              <th scope="col">Solution</th>
              {engaged.map((product) => (
                <th key={product.slug} scope="col">{product.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOLUTIONS.map((solution) => (
              <tr key={solution.slug}>
                <th scope="row">{solution.title}</th>
                {engaged.map((product) => {
                  const on = solution.systems.some((system) => system.slug === product.slug);

                  return (
                    <td key={product.slug} className={on ? "matrix-on" : "matrix-off"}>
                      <span aria-hidden="true">{on ? "●" : "·"}</span>
                      <span className="sr-only">{on ? "engaged" : "not engaged"}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
