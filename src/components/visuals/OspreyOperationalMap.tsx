/** Osprey: separate operational feeds converging onto one incident geography.
 *
 *  Layer rails draw inward to the map core (spec §13). Built on the same
 *  contour geometry as the hero map so the two read as one system, and it is
 *  explanatory rather than a mock of the real product. Every animation is
 *  scoped to `.js-anim` so a script-blocked visit still gets the full diagram. */
// trace:v1 id=impl.visual-osprey-map work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function OspreyOperationalMap() {
  const layers = [
    { label: "GIS", y: 34 },
    { label: "SATELLITE", y: 84 },
    { label: "PERIMETER", y: 134 },
    { label: "EVACUATION", y: 184 },
    { label: "INFRASTRUCTURE", y: 234 },
    { label: "FIELD DATA", y: 284 },
  ];

  return (
    <svg
      className="osprey-map"
      viewBox="0 0 440 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Six operational data feeds — GIS, satellite, fire perimeter, evacuation, infrastructure and field data — converging into one Osprey incident map"
    >
      {layers.map((layer, i) => (
        <g key={layer.label} className={`osprey-layer osprey-layer-${i + 1}`}>
          <text
            x="0"
            y={layer.y + 3}
            fill="var(--color-text-secondary)"
            fontSize="8"
            fontFamily="Figtree, system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="0.1em"
          >
            {layer.label}
          </text>
          <path
            className="osprey-rail"
            d={`M 96 ${layer.y} L 178 ${layer.y} Q 208 ${layer.y} 208 170`}
            stroke="var(--color-rule)"
            strokeWidth="1"
            pathLength={1}
          />
          <circle className="osprey-node" cx="96" cy={layer.y} r="2.5" fill="var(--color-accent)" />
        </g>
      ))}

      <g className="osprey-core">
        <circle cx="300" cy="170" r="104" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="3 7" />
        <path
          className="osprey-contour"
          d="M 226 186 C 220 148 240 112 282 92 C 324 72 376 78 398 106 C 420 134 422 178 404 210 C 386 242 336 258 296 250 C 256 242 232 224 226 186 Z"
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.75"
          pathLength={1}
          opacity="0.5"
        />
        <path
          className="osprey-perimeter"
          d="M 254 180 C 250 154 264 132 294 120 C 324 108 358 114 372 134 C 386 154 386 184 374 206 C 362 228 328 238 300 232 C 272 226 258 206 254 180 Z"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          pathLength={1}
        />
        <circle className="osprey-unit" cx="286" cy="158" r="3.5" fill="var(--color-accent)" />
        <circle className="osprey-unit" cx="344" cy="196" r="3.5" fill="var(--color-accent)" />
        <text
          x="300"
          y="298"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontFamily="Figtree, system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="0.14em"
        >
          OSPREY
        </text>
        <text
          x="300"
          y="313"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="7.5"
          fontFamily="Figtree, system-ui, sans-serif"
          letterSpacing="0.04em"
        >
          unified incident geography
        </text>
      </g>
    </svg>
  );
}
