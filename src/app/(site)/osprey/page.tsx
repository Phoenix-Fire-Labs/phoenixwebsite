import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import Link from "next/link";
import { LayerStack } from "@/components/visuals/LayerStack";
import { OspreyOperationalMap } from "@/components/visuals/OspreyOperationalMap";
import { WildfireContourMap } from "@/components/visuals/WildfireContourMap";

/** "Osprey" alone reads as a bird or an aircraft; the title carries the
 *  category so search and agents can disambiguate (spec §41). */
export const metadata: Metadata = {
  alternates: canonicalFor("/osprey"),
  title: "Osprey Wildfire Operational Intelligence",
  description:
    "Osprey assembles GIS, satellite imagery, fire perimeters, evacuations, infrastructure, and field data into one live operational picture.",
};

const LAYERS = [
  { name: "GIS map layers", detail: "Jurisdiction, access, ownership, and base cartography." },
  { name: "Satellite imagery", detail: "Current scenes registered against the incident area." },
  { name: "Fire perimeters", detail: "Perimeter state and how it has moved between updates." },
  { name: "Evacuation orders and zones", detail: "Zone status alongside the fire it responds to." },
  { name: "Gas and infrastructure", detail: "Utilities and assets that constrain tactics." },
  { name: "Field intelligence", detail: "Observations from crews and from Mockingbird." },
];

const USE_CASES = [
  "Staff the morning operational period with one current map.",
  "Track evacuation zones against live perimeter movement.",
  "Place field observations without redrawing the picture by hand.",
];

// trace:v1 id=impl.osprey-page work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-K2EA5BTM
export default function OspreyPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Flagship · Operational Geospatial Intelligence</p>
          <h1 className="hero-headline">Osprey</h1>
          <p className="hero-sub">
            The fireground, assembled into one operational picture. Osprey brings GIS, satellite
            imagery, fire perimeters, evacuations, infrastructure, and field updates into a shared,
            evolving view of the incident.
          </p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
            <a href="#layers" className="btn btn-secondary">See the layers ↓</a>
          </div>
        </div>
        <div className="hero-vis">
          <WildfireContourMap />
        </div>
      </section>

      <section className="problem section-pad stagger">
        <div className="split-section">
          <div className="content-container">
            <p className="section-label reveal" data-i="0">The fragmented-data problem</p>
            <h2 className="section-heading reveal" data-i="1">No single screen holds the incident.</h2>
            <p className="section-body reveal" data-i="2">
              Command teams hunt across separate systems for GIS layers, satellite imagery, fire
              perimeters, evacuation orders, gas and infrastructure layers, operational overlays,
              and field updates. Each system is authoritative for its own slice and blind to the
              rest, so the synthesis happens in someone&apos;s head, on a printed map, or not at all.
            </p>
          </div>
          <div className="vis-container reveal" data-i="3">
            <OspreyOperationalMap />
          </div>
        </div>
      </section>

      <section id="layers" className="mockingbird section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Operational layers, assembled</p>
          <h2 className="section-heading reveal" data-i="1">One incident geography every role can read.</h2>
        </div>
        <dl className="layer-grid stagger">
          {LAYERS.map((layer, i) => (
            <div key={layer.name} className="layer-card reveal" data-i={i}>
              <dt className="layer-name">{layer.name}</dt>
              <dd className="layer-detail">{layer.detail}</dd>
            </div>
          ))}
        </dl>
        <div className="content-container reveal" data-i="6">
          <LayerStack layers={LAYERS.map((layer) => layer.name)} />
        </div>
        <p className="section-body">
          Assembly is the product, not display. The question Osprey answers is not
          &ldquo;can you show me this layer&rdquo; but &ldquo;what is true about this incident right
          now, across everything we know.&rdquo;
        </p>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Osprey, Mockingbird, and Raven</p>
          <h2 className="section-heading reveal" data-i="1">The map is a view onto a shared model.</h2>
          <p className="section-body reveal" data-i="2">
            Osprey does not hold its own private truth. It renders Raven, the operational model
            that Mockingbird also writes into — which is why a unit heard on the radio and a unit
            drawn on the map are the same unit rather than two records that happen to agree.{" "}
            <Link href="/mockingbird" className="text-link">See Mockingbird →</Link>{" "}
            <Link href="/technology" className="text-link">How Raven works →</Link>
          </p>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Operational use cases</p>
          <ul className="capabilities reveal" data-i="1">
            {USE_CASES.map((useCase) => <li key={useCase}>{useCase}</li>)}
          </ul>
          <div className="cta-row reveal" data-i="2">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
