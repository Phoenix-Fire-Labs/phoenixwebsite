import type { Metadata } from "next";
import Link from "next/link";
import { TranscriptExtraction } from "@/components/visuals/TranscriptExtraction";
import { FLAGSHIP_PRODUCTS } from "@/lib/product-status";
import { HOMEPAGE_JSONLD } from "@/lib/structured-data";
import { FoundersTimeline } from "@/components/visuals/FoundersTimeline";
import { MockingbirdRadioFlow } from "@/components/visuals/MockingbirdRadioFlow";
import { OspreyOperationalMap } from "@/components/visuals/OspreyOperationalMap";
import { PhoenixSystemMap } from "@/components/visuals/PhoenixSystemMap";
import { WildfireContourMap } from "@/components/visuals/WildfireContourMap";

export const metadata: Metadata = {
  title: "Phoenix Fire Labs | Real-Time Wildfire Intelligence",
  description:
    "Phoenix Fire Labs builds operational intelligence systems for wildfire response: Mockingbird radio intelligence, Osprey operational picture, and Raven, the model they share.",
};

/** The feeds a command team reconciles by hand today. Plain text, not an SVG,
 *  so the point survives for screen readers and agents. */
const FRAGMENTED_SOURCES = [
  { label: "Radio", detail: "Tactical channels" },
  { label: "GIS", detail: "Map layers" },
  { label: "Satellite", detail: "Imagery" },
  { label: "Evacuations", detail: "Orders and zones" },
  { label: "Infrastructure", detail: "Utilities" },
  { label: "Perimeters", detail: "Fire state" },
];

const PALISADES = [
  { value: "23,448", unit: "acres burned" },
  { value: "6,845", unit: "structures destroyed" },
  { value: "12", unit: "civilian lives lost" },
];

const SCALE_FACTS = [
  { value: "77,850", label: "U.S. wildfires in 2025", source: "National Interagency Fire Center" },
  { value: "$40B+", label: "annual U.S. wildfire economic losses", source: "U.S. Forest Service" },
  { value: "$3B+", label: "average annual federal suppression spending", source: "Federal land-management agencies" },
];

const FLAGSHIP_VISUALS = {
  mockingbird: <MockingbirdRadioFlow />,
  osprey: <OspreyOperationalMap />,
} satisfies Record<string, React.ReactNode>;

/** The diagram for a flagship, or nothing if that product has none yet. */
// trace:exempt reason=internal-helper
function flagshipVisual(slug: string): React.ReactNode {
  if (!(slug in FLAGSHIP_VISUALS)) return null;

  // SAFETY: the `in` guard above proves slug is a key of FLAGSHIP_VISUALS.
  return FLAGSHIP_VISUALS[slug as keyof typeof FLAGSHIP_VISUALS];
}

// trace:v1 id=impl.homepage work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-406ZSYBP,REQ-PHO-3YJG08V6,REQ-PHO-VTA4YYAW
export default function HomePage() {
  return (
    <>
      {/* ════ Hero ════ */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Wildfire Command Intelligence</p>
          <h1 className="hero-headline">
            <span className="line"><span>Real-Time Wildfire Intelligence</span></span>
            <span className="line"><span>for Incident Command</span></span>
          </h1>
          <p className="hero-sub">
            Phoenix Fire Labs builds operational intelligence systems for wildfire response.{" "}
            <strong>Mockingbird</strong> turns tactical radio traffic into structured incident
            intelligence. <strong>Osprey</strong> brings GIS, satellite imagery, fire perimeters,
            infrastructure, evacuations, and field data into one live operational picture.
          </p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
            <a href="#system" className="btn btn-secondary">Explore the Phoenix System ↓</a>
          </div>
          <div className="hero-inception">
            <img
              src="/nvidia-inception-program-badge-rgb-for-screen.svg"
              alt="NVIDIA Inception Program member"
              className="nvidia-badge"
            />
            <div className="inception-divider"></div>
            <span className="inception-label">NVIDIA Inception<br />Program Member</span>
          </div>
        </div>
        <div className="hero-vis">
          <WildfireContourMap />
        </div>
      </section>

      {/* ════ Problem ════ */}
      <section id="problem" className="problem section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">The problem</p>
          <h2 className="section-heading reveal" data-i="1">
            The fireground produces more information than command can keep synchronized.
          </h2>
        </div>

        <ul className="source-grid stagger">
          {FRAGMENTED_SOURCES.map((source, i) => (
            <li key={source.label} className="source-card reveal" data-i={i}>
              <span className="source-label">{source.label}</span>
              <span className="source-detail">{source.detail}</span>
            </li>
          ))}
        </ul>

        <div className="split-section problem-split">
          <div className="content-container">
            <p className="section-body reveal" data-i="2">
              Critical information arrives through systems that were never designed to form one
              continuously updated operational picture. Each feed is accurate on its own. Holding
              them together, while the incident moves, is manual work done under time pressure.
            </p>
            <blockquote className="problem-pull reveal" data-i="3">
              Critical updates trapped in voice traffic and manual logs, a dangerous delay between
              what crews report and what command can <em>see</em>.
            </blockquote>
            <p className="goal-line reveal" data-i="4">
              Our goal is simple: reduce radio-to-map latency from <strong>hours</strong> to{" "}
              <strong>seconds</strong>.
            </p>
          </div>
          <div className="vis-container reveal" data-i="5">
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Radio-to-map latency: four sequential handoffs today versus one direct path with Phoenix">
              <path d="M0 50h400M0 150h400M0 250h400" stroke="var(--color-rule)" strokeWidth="0.5" strokeDasharray="2 6" />
              <text x="0" y="30" fill="var(--color-text-tertiary)" fontSize="12" fontWeight="600" letterSpacing="0.1em">THE OLD WAY: HOURS</text>
              <circle cx="20" cy="80" r="6" fill="var(--color-text-tertiary)" />
              <circle cx="140" cy="80" r="6" fill="var(--color-text-tertiary)" />
              <circle cx="260" cy="80" r="6" fill="var(--color-text-tertiary)" />
              <circle cx="380" cy="80" r="6" fill="var(--color-text-tertiary)" />
              <path d="M 30 80 L 130 80" stroke="var(--color-text-tertiary)" strokeWidth="1.5" className="latency-line" />
              <path d="M 150 80 L 250 80" stroke="var(--color-text-tertiary)" strokeWidth="1.5" className="latency-line" />
              <path d="M 270 80 L 370 80" stroke="var(--color-text-tertiary)" strokeWidth="1.5" className="latency-line" />
              <text x="20" y="110" fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle">Radio</text>
              <text x="140" y="110" fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle">Log</text>
              <text x="260" y="110" fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle">Review</text>
              <text x="380" y="110" fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle">Map</text>
              <text x="0" y="190" fill="var(--color-accent)" fontSize="12" fontWeight="600" letterSpacing="0.1em">PHOENIX: SECONDS</text>
              <circle cx="20" cy="240" r="6" fill="var(--color-accent)" />
              <circle cx="380" cy="240" r="6" fill="var(--color-accent)" className="pulse-node" />
              <path d="M 30 240 L 370 240" stroke="var(--color-accent)" strokeWidth="2" className="latency-fast" />
              <text x="20" y="270" fill="var(--color-accent)" fontSize="10" textAnchor="middle" fontWeight="600">Radio</text>
              <text x="200" y="230" fill="var(--color-accent)" fontSize="10" textAnchor="middle" fontWeight="600">AI Extraction</text>
              <text x="380" y="270" fill="var(--color-accent)" fontSize="10" textAnchor="middle" fontWeight="600">Map</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ════ The system map: the whole family in one view ════ */}
      <section id="system" className="flagship section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">The Phoenix system</p>
          <h2 className="section-heading reveal" data-i="1">
            Every system reads and writes the same operational model.
          </h2>
          <p className="section-body reveal" data-i="2">
            Raven holds one model of the incident. Mockingbird writes what crews report into it,
            Osprey renders it as a live map, and everything further out reads from the same place —
            which is why a unit heard on the radio and a unit drawn on the map are the same unit.
          </p>
        </div>
        <div className="reveal" data-i="3">
          <PhoenixSystemMap />
        </div>
      </section>

      {/* ════ Flagship products ════ */}
      <section id="flagship" className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">In service today</p>
          <h2 className="section-heading reveal" data-i="1">The two systems command teams run now.</h2>
        </div>

        <div className="flagship-grid">
          {FLAGSHIP_PRODUCTS.map((product, i) => (
            <article key={product.slug} id={product.slug} className="flagship-card reveal" data-i={i + 2}>
              {/* Category in the eyebrow only; the tagline repeats it almost
                  word for word, so the card leads with the blurb instead. */}
              <p className="flagship-eyebrow">{product.category}</p>
              <h3 className="flagship-name">{product.name}</h3>
              <p className="flagship-lede">{product.blurb}</p>
              {flagshipVisual(product.slug) ? (
                <div className="flagship-vis">{flagshipVisual(product.slug)}</div>
              ) : null}
              <Link href={product.href} className="text-link">Explore {product.name} →</Link>
            </article>
          ))}
        </div>
      </section>

      {/* ════ One field report, concretely ════ */}
      <section id="story" className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">One field report</p>
          <h2 className="section-heading reveal" data-i="1">What a single transmission becomes.</h2>
        </div>
        <div className="split-section">
          <div className="content-container reveal" data-i="2">
            <TranscriptExtraction />
          </div>
          <div className="content-container reveal" data-i="3">
            <div className="prose">
              <p>
                Mockingbird separates the operational facts out of the call. Raven attaches them to
                the unit, the place and the incident it already knows about, with the transmission
                kept as provenance. Osprey draws the result in context, alongside the perimeter and
                the evacuation zones it sits between.
              </p>
              <p>
                No one retypes it into a log, and nothing waits for the next briefing to become
                visible.
              </p>
            </div>
            <Link href="/technology" className="text-link">How the systems connect →</Link>
          </div>
        </div>
      </section>

      {/* ════ Why it matters ════ */}
      <section id="why" className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Why it matters</p>
          <h2 className="section-heading reveal" data-i="1">Wildfire scale, in three numbers.</h2>
        </div>
        <dl className="stat-row stagger">
          {SCALE_FACTS.map((fact, i) => (
            <div key={fact.value} className="stat reveal" data-i={i}>
              <dt className="stat-value">{fact.value}</dt>
              <dd className="stat-label">
                {fact.label}
                <span className="stat-source">{fact.source}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="section-body">
          <Link href="/resources/wildfire-operational-intelligence" className="text-link">
            The evidence behind these figures →
          </Link>
        </p>
      </section>

      {/* ════ Founded in Fire ════ */}
      <section id="founded" className="section-pad stagger">
        <div className="split-section">
          <div className="content-container">
            <svg className="section-line reveal" data-i="0" viewBox="0 0 48 2" fill="none" preserveAspectRatio="none">
              <line x1="0" y1="1" x2="48" y2="1" stroke="var(--color-accent)" strokeWidth="2" pathLength={1} />
            </svg>
            <h2 className="section-heading reveal" data-i="1">Founded in Fire</h2>
            <dl className="palisades-row reveal" data-i="2">
              <div className="palisades-head">
                <dt className="stat-value">Palisades</dt>
                <dd className="stat-label">January 2025</dd>
              </div>
              {PALISADES.map((item) => (
                <div key={item.unit}>
                  <dt className="stat-value">{item.value}</dt>
                  <dd className="stat-label">{item.unit}</dd>
                </div>
              ))}
            </dl>
            <p className="founders-text reveal" data-i="3">
              Phoenix Fire Labs was founded by Carter LaSalle and Jack Phelps after losing their
              homes in the Palisades Fire.
            </p>
            <p className="founders-text reveal" data-i="4">
              The experience exposed how difficult it can be to assemble a clear picture of a
              fast-moving incident while information is arriving through radio traffic, maps,
              evacuation systems, imagery, and separate operational feeds.
            </p>
            <p className="goal-line reveal" data-i="5">
              Phoenix exists to make that information move faster.
            </p>
          </div>
          <div className="vis-container reveal" data-i="6">
            <FoundersTimeline />
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section id="briefing" className="cta-section section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Request a Briefing</p>
          <h2 className="section-heading reveal" data-i="1">See the Phoenix system on your fireground.</h2>
          <p className="section-body reveal" data-i="2">
            We walk through Mockingbird and Osprey against a real incident profile from your
            jurisdiction, and answer deployment, security, and integration questions directly.
          </p>
          <div className="cta-row reveal" data-i="3">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
          </div>
        </div>
      </section>

      {/* Byte-stable JSON-LD: keep this string identical to HOMEPAGE_JSONLD. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: HOMEPAGE_JSONLD }} />
    </>
  );
}
