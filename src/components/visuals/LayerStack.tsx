/** The operational layers, drawn as the stack the section describes.
 *
 *  The claim is that assembly is the product -- not "can you show me this
 *  layer" but "what is true about this incident right now, across everything
 *  we know". So the layers are drawn as separate planes that resolve into one
 *  geography at the bottom, which is the assembly step stated as a shape.
 *
 *  Names come from the page's own LAYERS list rather than a copy, so a layer
 *  added or renamed there cannot leave the figure describing the old set. */
// trace:v1 id=impl.visual-layer-stack work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-TQ5N9DVW
export function LayerStack({ layers }: { layers: string[] }) {
  const CX = 104;
  const TOP = 26;
  const STEP = 30;
  const HALF_W = 84;
  const HALF_H = 21;

  // trace:exempt reason=internal-detail -- isometric plane geometry
  const plane = (cy: number) =>
    `${CX - HALF_W},${cy} ${CX},${cy - HALF_H} ${CX + HALF_W},${cy} ${CX},${cy + HALF_H}`;

  const baseY = TOP + layers.length * STEP + 34;

  return (
    <figure className="stack">
      <svg
        className="stack-svg"
        viewBox="0 0 420 330"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${layers.join(", ")} assembled into one incident geography.`}
      >
        {layers.map((layer, i) => {
          const cy = TOP + i * STEP;

          return (
            <g key={layer} className="stack-layer">
              <polygon points={plane(cy)} stroke="var(--color-text-tertiary)" strokeWidth="1" />
              <line x1={CX + HALF_W} y1={cy} x2={CX + HALF_W + 18} y2={cy} stroke="var(--color-rule)" strokeWidth="1" />
              <text x={CX + HALF_W + 24} y={cy + 3.5} className="stack-label">{layer}</text>
            </g>
          );
        })}

        <line
          className="stack-drop"
          x1={CX}
          y1={TOP + (layers.length - 1) * STEP + HALF_H + 6}
          x2={CX}
          y2={baseY - HALF_H - 6}
          stroke="var(--color-accent)"
          strokeWidth="1.3"
        />

        <polygon className="stack-base" points={plane(baseY)} stroke="var(--color-accent)" strokeWidth="1.6" />
        <text x={CX} y={baseY + 3.5} className="stack-base-label" textAnchor="middle">one geography</text>
      </svg>
      <figcaption className="stack-caption">
        Each source keeps its own identity in the model, so a disagreement
        between two of them stays visible instead of being flattened on the way
        into the composite.
      </figcaption>
    </figure>
  );
}
