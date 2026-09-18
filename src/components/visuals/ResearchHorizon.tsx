/** A research direction drawn as open questions, not as progress.
 *
 *  These pages describe work with no hardware, no pricing and no date, so the
 *  usual product diagram vocabulary is off limits: no timeline, no phases, no
 *  percentage complete, no arrow marching toward a launch. Any of those would
 *  imply a commitment the page spends its copy explicitly refusing to make.
 *
 *  What is true is that one system already exists (Raven, drawn solid) and the
 *  direction reads from it (drawn dashed, because it does not exist yet), and
 *  that a set of stated constraints has to be answered. The constraints are
 *  drawn unconnected and unordered, because nothing about which gets solved
 *  first, or whether they can be solved at all, is known. */
// trace:v1 id=impl.visual-research-horizon work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-HS2JV1A4
export function ResearchHorizon({
  name,
  reads,
  constraints,
}: {
  name: string;
  reads: string;
  constraints: string[];
}) {
  const spread = 300 / Math.max(constraints.length, 1);

  return (
    <figure className="horizon">
      <svg
        className="horizon-svg"
        viewBox="0 0 360 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${name} reads from ${reads}. Open questions: ${constraints.join(", ")}.`}
      >
        <g className="horizon-anchor">
          <rect x="130" y="16" width="100" height="30" rx="3" stroke="var(--color-accent)" strokeWidth="1.5" />
          <text x="180" y="35" fill="var(--color-accent)" fontSize="11" fontWeight="700" textAnchor="middle">{reads}</text>
          <text x="180" y="58" fill="var(--color-text-tertiary)" fontSize="7.5" letterSpacing="0.08em" textAnchor="middle">EXISTS</text>
        </g>

        <path className="horizon-feed" d="M 180 62 L 180 92" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 4" />

        <g className="horizon-subject">
          <rect x="112" y="94" width="136" height="38" rx="3" stroke="var(--color-text-mid)" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="180" y="113" fill="var(--color-text)" fontSize="12" fontWeight="700" textAnchor="middle">{name}</text>
          <text x="180" y="126" fill="var(--color-text-tertiary)" fontSize="7.5" letterSpacing="0.08em" textAnchor="middle">OPEN QUESTION</text>
        </g>

        <g className="horizon-constraints">
          {constraints.map((constraint, i) => {
            const x = 30 + spread * i + spread / 2;

            return (
              <g key={constraint}>
                <circle cx={x} cy="182" r="4" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.2" strokeDasharray="2 2" />
                <text x={x} y="205" fill="var(--color-text-secondary)" fontSize="8" textAnchor="middle">{constraint}</text>
              </g>
            );
          })}
        </g>

        <text x="180" y="236" fill="var(--color-text-tertiary)" fontSize="7.5" letterSpacing="0.08em" textAnchor="middle">
          UNANSWERED · NO ORDER IMPLIED
        </text>
      </svg>
      <figcaption className="horizon-caption">
        Dashed means it does not exist. The questions are drawn unconnected
        because nothing about their order, or whether they can be answered, is
        settled.
      </figcaption>
    </figure>
  );
}
