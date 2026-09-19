/** The failure mode Raven exists to remove, beside the arrangement it replaces.
 *
 *  The section's claim is "one world, not several databases", which is an
 *  architectural statement rather than a measurement, so it can be drawn
 *  honestly: three systems each holding a private copy of the incident, versus
 *  three systems reading and writing one. Nothing here is a number, a benchmark
 *  or a performance claim.
 *
 *  The left panel is deliberately the ugly one -- three incidents where there
 *  is one fire -- because that is the situation the page is describing. */
// trace:v1 id=impl.visual-shared-model work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-TQ5N9DVW
export function SharedModelContrast() {
  const SYSTEMS = ["Mockingbird", "Osprey", "Albatross"];

  return (
    <figure className="contrast">
      <svg
        className="contrast-svg"
        viewBox="0 0 420 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Left: three systems each holding a separate incident record. Right: the same three systems reading and writing one shared model."
      >
        <text x="95" y="14" className="contrast-title" textAnchor="middle">WITHOUT A SHARED MODEL</text>
        {SYSTEMS.map((name, i) => {
          const y = 42 + i * 62;

          return (
            <g key={name}>
              <rect x="18" y={y} width="86" height="26" rx="3" stroke="var(--color-text-tertiary)" strokeWidth="1.2" />
              <text x="61" y={y + 17} className="contrast-node" textAnchor="middle">{name}</text>
              <path d={`M 104 ${y + 13} L 130 ${y + 13}`} stroke="var(--color-text-tertiary)" strokeWidth="1.2" strokeDasharray="3 3" />
              <rect x="130" y={y + 2} width="44" height="22" rx="2" stroke="var(--color-text-tertiary)" strokeWidth="1.2" />
              <text x="152" y={y + 17} className="contrast-copy" textAnchor="middle">incident</text>
            </g>
          );
        })}
        <text x="95" y="236" className="contrast-foot" textAnchor="middle">three versions of one fire</text>

        <line x1="210" y1="26" x2="210" y2="224" stroke="var(--color-rule)" strokeWidth="1" />

        <text x="325" y="14" className="contrast-title contrast-title-on" textAnchor="middle">WITH RAVEN</text>
        {SYSTEMS.map((name, i) => {
          const y = 42 + i * 62;

          return (
            <g key={name}>
              <rect x="238" y={y} width="86" height="26" rx="3" stroke="var(--color-accent)" strokeWidth="1.2" />
              <text x="281" y={y + 17} className="contrast-node contrast-node-on" textAnchor="middle">{name}</text>
              <path className="contrast-feed" d={`M 324 ${y + 13} L 372 ${y + 13}`} stroke="var(--color-accent)" strokeWidth="1.3" />
            </g>
          );
        })}
        <rect x="372" y="42" width="34" height="150" rx="3" fill="var(--color-accent-faint, transparent)" stroke="var(--color-accent)" strokeWidth="1.5" />
        <text x="389" y="122" className="contrast-node contrast-node-on" textAnchor="middle" transform="rotate(-90 389 122)">one model</text>
        <text x="325" y="236" className="contrast-foot contrast-foot-on" textAnchor="middle">one incident, with provenance</text>
      </svg>
    </figure>
  );
}
