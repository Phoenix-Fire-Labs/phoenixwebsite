/** Founders timeline: Palisades → Phoenix founded → prototype today.
 *
 *  Restores the golden master's draw-in choreography (timeline rule, then each
 *  marker's tick, spark and label, then the connecting arcs), which the first
 *  Next port dropped. All of it is scoped to `.js-anim`, so the diagram renders
 *  complete and static without JavaScript or under reduced motion. */
// trace:v1 id=impl.visual-founders-timeline work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function FoundersTimeline() {
  const marks = [
    { x: 90, step: 1, when: "Jan 2025", what: "Palisades Fire", accent: true, spark: true },
    { x: 200, step: 2, when: "Nov 2025", what: "Phoenix Founded", accent: false, spark: false },
    { x: 320, step: 3, when: "Today", what: "Developing Prototype", accent: true, spark: true },
  ];

  return (
    <svg
      className="founders-timeline"
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Phoenix founding timeline: Palisades Fire January 2025, Phoenix founded November 2025, developing prototype today"
    >
      <path className="tl-rule" d="M 40 150 L 360 150" stroke="var(--color-rule)" strokeWidth="1" pathLength={1} />

      {marks.map((mark) => (
        <g key={mark.what} transform={`translate(${String(mark.x)}, 150)`} className={`tl-mark tl-mark-${String(mark.step)}`}>
          <line className="tl-tick" x1="0" y1="-20" x2="0" y2="20" stroke="var(--color-rule)" strokeWidth="1" pathLength={1} />
          {mark.spark ? <circle className="tl-halo" cx="0" cy="0" r="16" fill="var(--color-accent-faint)" /> : null}
          <circle
            className="tl-dot"
            cx="0"
            cy="0"
            r="4"
            fill={mark.accent ? "var(--color-accent)" : "var(--color-text-mid)"}
          />
          <text className="tl-label" x="0" y="-30" fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle" fontWeight="600">
            {mark.when}
          </text>
          <text
            className="tl-label"
            x="0"
            y="35"
            fill={mark.accent ? "var(--color-accent)" : "var(--color-text-mid)"}
            fontSize="10"
            textAnchor="middle"
            fontWeight="600"
          >
            {mark.what}
          </text>
        </g>
      ))}

      <path
        className="tl-arc tl-arc-1"
        d="M 90 150 C 120 95 170 95 200 150"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        fill="none"
        pathLength={1}
      />
      <path
        className="tl-arc tl-arc-2"
        d="M 200 150 C 235 95 285 95 320 150"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="none"
        pathLength={1}
      />
    </svg>
  );
}
