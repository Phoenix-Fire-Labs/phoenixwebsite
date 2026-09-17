/** Hero wildfire map: contours, fire perimeter, unit points, LIVE marker.
 *  Ported path-for-path from the static golden master (index.html hero SVG);
 *  structure and geometry are frozen, styling rides the Phoenix tokens. */
// trace:v1 id=impl.hero-map work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-XH2DZ7EX
export function WildfireContourMap({ decorative = false }: { decorative?: boolean }) {
  return (
    <div aria-hidden={decorative || undefined}>
      <svg className="hero-map" viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Live wildfire operations map">
        <g className="map-grid">
          <line x1="0" y1="100" x2="480" y2="100" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="2 6" />
          <line x1="0" y1="200" x2="480" y2="200" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="2 6" />
          <line x1="0" y1="300" x2="480" y2="300" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="2 6" />
          <line x1="120" y1="0" x2="120" y2="400" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="2 6" />
          <line x1="240" y1="0" x2="240" y2="400" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="2 6" />
          <line x1="360" y1="0" x2="360" y2="400" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="2 6" />
        </g>
        <path
          className="contour c1"
          d="M 55,295 C 42,232 68,158 128,112 C 188,66 268,52 342,62 C 416,72 460,132 467,198 C 474,264 456,324 400,358 C 344,392 252,396 182,376 C 112,356 68,358 55,295 Z"
          stroke="var(--color-text-tertiary)" strokeWidth="0.75" pathLength={1} opacity="0.45"
        />
        <path
          className="contour c2"
          d="M 108,274 C 98,222 118,172 168,140 C 218,108 294,96 352,110 C 410,124 440,170 444,228 C 448,286 430,328 384,350 C 338,372 250,376 194,358 C 138,340 118,326 108,274 Z"
          stroke="var(--color-text-tertiary)" strokeWidth="0.75" pathLength={1} opacity="0.55"
        />
        <path
          className="contour c-fire-draw"
          d="M 162,255 C 157,218 172,184 212,160 C 252,136 318,127 360,144 C 402,161 422,200 420,240 C 418,280 402,312 370,330 C 338,348 264,352 222,334 C 180,316 167,292 162,255 Z"
          stroke="var(--color-accent)" strokeWidth="1.5" pathLength={1}
        />
        <path
          className="c-fire-dash"
          d="M 162,255 C 157,218 172,184 212,160 C 252,136 318,127 360,144 C 402,161 422,200 420,240 C 418,280 402,312 370,330 C 338,348 264,352 222,334 C 180,316 167,292 162,255 Z"
          stroke="var(--color-accent)" strokeWidth="1.5" pathLength={1}
        />
        <path
          className="contour c4"
          d="M 228,240 C 225,218 238,200 268,185 C 298,170 335,168 358,180 C 381,192 390,214 388,238 C 386,262 374,280 350,290 C 326,300 278,302 255,292 C 232,282 231,262 228,240 Z"
          stroke="var(--color-accent)" strokeWidth="0.75" pathLength={1} opacity="0.45"
        />
        <g className="map-labels">
          <text x="66" y="300" fill="var(--color-text-tertiary)" fontSize="7.5" fontFamily="Figtree, system-ui, sans-serif">1200</text>
          <text x="116" y="280" fill="var(--color-text-tertiary)" fontSize="7.5" fontFamily="Figtree, system-ui, sans-serif">1400</text>
          <text x="170" y="260" fill="var(--color-accent)" fontSize="7.5" fontFamily="Figtree, system-ui, sans-serif" fontWeight="500">1600</text>
          <text x="235" y="245" fill="var(--color-accent)" fontSize="7" fontFamily="Figtree, system-ui, sans-serif" opacity="0.55">1800</text>
        </g>
        <g className="map-labels">
          <text x="365" y="150" fill="var(--color-accent)" fontSize="6.5" fontFamily="Figtree, system-ui, sans-serif" fontWeight="600" letterSpacing="0.08em" opacity="0.7">ACTIVE PERIMETER</text>
        </g>
        <g className="data-points">
          <g transform="translate(142, 132)">
            <g className="data-point dp1">
              <circle r="10" fill="var(--color-accent)" opacity="0" className="point-ring" />
              <circle r="3.5" fill="var(--color-accent)" />
            </g>
          </g>
          <g transform="translate(418, 198)">
            <g className="data-point dp2">
              <circle r="10" fill="var(--color-accent)" opacity="0" className="point-ring" />
              <circle r="3.5" fill="var(--color-accent)" />
            </g>
          </g>
          <g transform="translate(305, 352)">
            <g className="data-point dp3">
              <circle r="10" fill="var(--color-accent)" opacity="0" className="point-ring" />
              <circle r="3.5" fill="var(--color-accent)" />
            </g>
          </g>
        </g>
        <g className="map-coords">
          <text x="385" y="24" fill="var(--color-text-tertiary)" fontSize="7.5" fontFamily="Figtree, system-ui, sans-serif" letterSpacing="0.04em">34.05°N</text>
          <text x="420" y="388" fill="var(--color-text-tertiary)" fontSize="7.5" fontFamily="Figtree, system-ui, sans-serif" letterSpacing="0.04em">118.52°W</text>
        </g>
        <g className="map-labels" transform="translate(435, 50)">
          <circle r="3" fill="var(--color-accent)" className="live-dot" />
          <text x="8" y="3.5" fill="var(--color-accent)" fontSize="7" fontFamily="Figtree, system-ui, sans-serif" fontWeight="700" letterSpacing="0.1em">LIVE</text>
        </g>
        <g className="map-scale" transform="translate(18, 380)">
          <line x1="0" y1="0" x2="42" y2="0" stroke="var(--color-text-tertiary)" strokeWidth="1" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="var(--color-text-tertiary)" strokeWidth="1" />
          <line x1="42" y1="-3" x2="42" y2="3" stroke="var(--color-text-tertiary)" strokeWidth="1" />
          <text x="10" y="12" fill="var(--color-text-tertiary)" fontSize="7" fontFamily="Figtree, system-ui, sans-serif">500m</text>
        </g>
      </svg>
    </div>
  );
}
