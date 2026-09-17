/** Raven graph: incident, unit, location, and connected operational entities.
 *  Edges draw in before the nodes settle, so the relationships read as the
 *  subject rather than the dots. Animation is `.js-anim`-scoped. */
// trace:v1 id=impl.visual-raven-graph work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function RavenGraph() {
  return (
    <svg className="raven-graph" viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Raven operational knowledge graph">
      <g className="raven-nodes" fontSize="10" fontWeight="600" textAnchor="middle">
        <circle cx="200" cy="40" r="9" fill="var(--color-accent)" />
        <text x="200" y="22" fill="var(--color-text-secondary)">INCIDENT</text>
        <circle cx="120" cy="100" r="8" fill="var(--color-text-mid)" />
        <text x="120" y="122" fill="var(--color-text-secondary)">UNIT</text>
        <circle cx="280" cy="100" r="8" fill="var(--color-text-mid)" />
        <text x="280" y="122" fill="var(--color-text-secondary)">LOCATION</text>
        <circle cx="70" cy="170" r="7" fill="var(--color-text-tertiary)" />
        <text x="70" y="192" fill="var(--color-text-tertiary)">PERSON</text>
        <circle cx="170" cy="180" r="7" fill="var(--color-text-tertiary)" />
        <text x="170" y="202" fill="var(--color-text-tertiary)">EVENT</text>
        <circle cx="250" cy="180" r="7" fill="var(--color-text-tertiary)" />
        <text x="250" y="202" fill="var(--color-text-tertiary)">ASSET</text>
        <circle cx="335" cy="170" r="7" fill="var(--color-text-tertiary)" />
        <text x="335" y="192" fill="var(--color-text-tertiary)">TERRAIN</text>
        <circle cx="200" cy="235" r="7" fill="var(--color-accent)" />
        <text x="200" y="253" fill="var(--color-accent)">INFRASTRUCTURE</text>
      </g>
      <path
        className="raven-edges"
        d="M 200 40 L 120 100 M 200 40 L 280 100 M 120 100 L 70 170 M 120 100 L 170 180 M 280 100 L 250 180 M 280 100 L 335 170 M 170 180 L 250 180 M 170 180 L 200 235"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
