/** What Raven holds, as the categories the page names.
 *
 *  Reads the list the section already prints rather than inventing a schema:
 *  the four entity groups sit on the plane, and the two that are not entities
 *  at all -- provenance and time -- are drawn as the axes they actually are,
 *  because "every claim carries its origin" and "state is a history, not a
 *  snapshot" are properties of every row rather than more boxes. */
// trace:v1 id=impl.visual-entity-model work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-TQ5N9DVW
export function EntityModel({ groups }: { groups: string[] }) {
  const cols = 2;

  return (
    <figure className="entity">
      <svg
        className="entity-svg"
        viewBox="0 0 400 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Raven holds ${groups.join(", ")}, each carrying provenance and time.`}
      >
        <line x1="54" y1="34" x2="54" y2="196" stroke="var(--color-rule)" strokeWidth="1" />
        <text x="46" y="118" className="entity-axis" textAnchor="middle" transform="rotate(-90 46 118)">PROVENANCE</text>

        <line x1="54" y1="204" x2="386" y2="204" stroke="var(--color-rule)" strokeWidth="1" />
        <text x="220" y="222" className="entity-axis" textAnchor="middle">TIME</text>

        {groups.slice(0, 4).map((group, i) => {
          const x = 76 + (i % cols) * 160;
          const y = 44 + Math.floor(i / cols) * 74;

          return (
            <g key={group}>
              <rect x={x} y={y} width="140" height="50" rx="3" stroke="var(--color-accent)" strokeWidth="1.3" />
              <text x={x + 70} y={y + 30} className="entity-label" textAnchor="middle">{group}</text>
            </g>
          );
        })}

        <path className="entity-link" d="M 216 69 L 236 69" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3" />
        <path className="entity-link" d="M 216 143 L 236 143" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3" />
        <path className="entity-link" d="M 146 94 L 146 118" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3" />
        <path className="entity-link" d="M 306 94 L 306 118" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3" />
      </svg>
      <figcaption className="entity-caption">
        Provenance and time are not more entities. They are properties every
        claim in the model carries, which is what lets two sources disagree
        legibly instead of silently overwriting each other.
      </figcaption>
    </figure>
  );
}
