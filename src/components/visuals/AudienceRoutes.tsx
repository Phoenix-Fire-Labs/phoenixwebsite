import Link from "next/link";
import { SOLUTIONS } from "@/content/solutions";

/** Who the company builds for, and where each of them enters the product.
 *
 *  The section names three audiences in prose and then stops, which leaves a
 *  reader who recognises themselves in one of them with nowhere to go. Each row
 *  is that audience's actual entry point, with the roles read from the solution
 *  definitions rather than restated here -- so a solution that changes who it
 *  serves cannot leave this page describing the old audience. */
// trace:v1 id=impl.visual-audience-routes work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-TQ5N9DVW
export function AudienceRoutes() {
  return (
    <figure className="routes">
      <ul className="routes-list">
        {SOLUTIONS.map((solution) => (
          <li key={solution.slug} className="routes-row">
            <span className="routes-role">{solution.role}</span>
            <span className="routes-arrow" aria-hidden="true">→</span>
            <Link href={`/solutions/${solution.slug}`} className="routes-target">
              {solution.title}
            </Link>
          </li>
        ))}
      </ul>
    </figure>
  );
}
