import Link from "next/link";
import { PRODUCTS, productBySlug } from "@/lib/product-status";

/** The whole product family in one view: Raven at the centre, every other
 *  system positioned around it and linked to its own page.
 *
 *  Plain SVG with real <a> elements rather than a force-directed graph — the
 *  layout is fixed and meaningful (shipping systems on the inner ring,
 *  research on the outer), it renders identically without JavaScript, and
 *  every node is a crawlable, focusable link. */
// trace:v1 id=impl.visual-system-map work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-3YJG08V6
export function PhoenixSystemMap({
  engaged,
  caption,
}: {
  /** Slugs to emphasise. Everything else dims, so a page can show which part
   *  of the family it is about without drawing a second, divergent diagram.
   *  Omitted means the whole family reads at equal weight. */
  engaged?: string[];
  /** Replaces the default caption when the emphasis changes what the figure
   *  is saying. */
  caption?: string;
} = {}) {
  const centre = productBySlug("raven");
  // trace:exempt reason=internal-detail -- emphasis class predicate
  const dim = (slug: string) => (engaged && !engaged.includes(slug) ? " map-node-dim" : "");

  // Fixed positions: the two flagships flank Raven on the operating axis,
  // Albatross sits ahead of it, and the research pair sits furthest out.
  const NODES = {
    mockingbird: { x: 150, y: 200, anchor: "middle", ring: "inner" },
    osprey: { x: 570, y: 200, anchor: "middle", ring: "inner" },
    albatross: { x: 360, y: 366, anchor: "middle", ring: "mid" },
    peregrine: { x: 150, y: 58, anchor: "middle", ring: "outer" },
    owl: { x: 570, y: 58, anchor: "middle", ring: "outer" },
  } satisfies Record<string, { x: number; y: number; anchor: "start" | "middle" | "end"; ring: string }>;

  const CX = 360;
  const CY = 200;

  const others = PRODUCTS.filter((p) => p.slug !== "raven");

  return (
    <figure className="system-map">
      <svg
        viewBox="0 0 720 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="group"
        aria-label="The Phoenix system: Raven at the centre, with Mockingbird, Osprey, Albatross, Peregrine and Owl connected to it"
      >
        <g className="map-rings" aria-hidden="true">
          <circle cx={CX} cy={CY} r="118" stroke="var(--color-rule)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r="176" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="3 8" />
        </g>

        <g className="map-edges" aria-hidden="true">
          {others.map((product) => {
            // SAFETY: NODES declares an entry for every product slug except
            // raven, and `others` is exactly PRODUCTS minus raven.
            const node = NODES[product.slug as keyof typeof NODES];

            return (
              <line
                key={product.slug}
                className={`map-edge map-edge-${product.status}${dim(product.slug)}`}
                x1={CX}
                y1={CY}
                x2={node.x}
                y2={node.y}
                stroke="var(--color-accent)"
                strokeWidth="1.25"
                pathLength={1}
              />
            );
          })}
        </g>

        {/* Centre: Raven */}
        {/* Classed, not inline-filled: a CSS `fill` beats an SVG fill
            attribute, so the shared .map-node rule would repaint both. */}
        <Link href={centre?.href ?? "/raven"} className={`map-node map-node-centre${dim("raven")}`}>
          <circle className="map-halo" cx={CX} cy={CY} r="46" />
          <circle className="map-core" cx={CX} cy={CY} r="9" />
          <text x={CX} y={CY - 20} textAnchor="middle" className="map-node-name">{centre?.name ?? "Raven"}</text>
          <text x={CX} y={CY + 30} textAnchor="middle" className="map-node-role">shared model</text>
        </Link>

        {others.map((product) => {
          // SAFETY: same invariant as the edge pass above — NODES covers every
          // non-centre product slug.
          const node = NODES[product.slug as keyof typeof NODES];

          return (
            <Link
              key={product.slug}
              href={product.href}
              className={`map-node map-node-${product.status}${dim(product.slug)}`}
            >
              <circle className="map-dot" cx={node.x} cy={node.y} r="7" />
              <text x={node.x} y={node.y - 18} textAnchor={node.anchor} className="map-node-name">
                {product.name}
              </text>
              <text x={node.x} y={node.y + 26} textAnchor={node.anchor} className="map-node-role">
                {product.tagline}
              </text>
              <text x={node.x} y={node.y + 40} textAnchor={node.anchor} className="map-node-status">
                {product.statusLabel}
              </text>
            </Link>
          );
        })}
      </svg>

      <figcaption className="system-map-caption">
        {caption ??
          "Every Phoenix system reads and writes the same operational model. Mockingbird and Osprey are in service today; Albatross is in development; Peregrine and Owl are research directions."}
      </figcaption>
    </figure>
  );
}
