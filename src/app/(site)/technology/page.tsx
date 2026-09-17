import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import Link from "next/link";
import { CardGrid } from "@/components/marketing/CardGrid";
import { RESEARCH_PRODUCTS } from "@/lib/product-status";
import { AlbatrossPrediction } from "@/components/visuals/AlbatrossPrediction";
import { RadioToMap } from "@/components/visuals/RadioToMap";
import { RavenGraph } from "@/components/visuals/RavenGraph";

/** Raven, Albatross and the research horizon all live here. Spec §29 rules out
 *  a /roadmap route: a dedicated roadmap page turns direction into commitments
 *  and dates the company would have to defend. */
export const metadata: Metadata = {
  alternates: canonicalFor("/technology"),
  title: "Raven Operational World Model",
  description:
    "Raven is the shared operational intelligence layer beneath Phoenix: one model of the fireground that Mockingbird, Osprey, and future systems all refer to.",
};

const ENTITIES = [
  { name: "Units and people", body: "Crews, apparatus, and assignments, with the identity held stable across every source that mentions them." },
  { name: "Places and terrain", body: "Named features, divisions, and geography that radio traffic refers to informally and maps refer to precisely." },
  { name: "Incidents and events", body: "What happened, when it was reported, and how confident the system is that it happened." },
  { name: "Assets and infrastructure", body: "The utilities, structures, and values at risk that constrain tactics." },
  { name: "Observations", body: "Every claim carries its origin: which transmission, which layer, which crew, what time." },
  { name: "Time", body: "Operational state is a history, not a snapshot, so change between periods is visible rather than inferred." },
];

// trace:v1 id=impl.technology-page work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-K2EA5BTM
export default function TechnologyPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Technology · The intelligence layer</p>
          <h1 className="hero-headline">Raven</h1>
          <p className="hero-sub">
            Raven gives Phoenix a shared model of the fireground. It connects people, units, places,
            incidents, events, assets, infrastructure, observations, relationships, and time, so
            radio understanding and geospatial context refer to the same operational world.
          </p>
          <p className="note">
            Powered by Raven. It is the layer beneath Mockingbird and Osprey, not a product sold
            separately.
          </p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
            <a href="#albatross" className="btn btn-secondary">What comes next ↓</a>
          </div>
        </div>
        <div className="hero-vis">
          <RavenGraph />
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Phoenix architecture</p>
          <h2 className="section-heading reveal" data-i="1">Two systems, one model.</h2>
          <div className="prose reveal" data-i="2">
            <p>
              Mockingbird and Osprey both read and write Raven. Mockingbird contributes what crews
              report; Osprey contributes what exists and where. Raven holds the relationships and
              the operational state over time, with provenance on every observation.
            </p>
            <p>
              This is what keeps Phoenix from becoming several unrelated applications that each hold
              a private version of the incident — which is the problem the company exists to remove,
              and would be an embarrassing one to reproduce internally.{" "}
              <Link href="/mockingbird">Mockingbird</Link> and <Link href="/osprey">Osprey</Link>{" "}
              each describe their own side of it.
            </p>
          </div>
        </div>
      </section>

      <section id="story" className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">One field report, end to end</p>
          <h2 className="section-heading reveal" data-i="1">
            Mockingbird, Raven and Osprey on one transmission.
          </h2>
        </div>
        <RadioToMap />
      </section>

      <section className="mockingbird section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">What Raven models</p>
          <h2 className="section-heading reveal" data-i="1">The operational world, made explicit.</h2>
        </div>
        <CardGrid items={ENTITIES.map((e) => ({ title: e.name, body: e.body }))} />
      </section>

      <section id="albatross" className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Where Phoenix goes next</p>
          <h2 className="section-heading reveal" data-i="1">
            Albatross: from understanding the fireground toward anticipating it.
          </h2>
        </div>
        <div className="split-section">
          <div className="content-container">
            <p className="status-pill reveal" data-i="2">In development</p>
            <div className="prose reveal" data-i="3">
              <p>
                Mockingbird understands what crews report. Osprey understands what exists and where.
                Raven understands relationships and operational state. Albatross is the next step:
                modeling what may happen next.
              </p>
              <p>
                It is in development and not deployed. We are not publishing accuracy claims for it,
                because we have not benchmarked them, and a prediction figure without a benchmark
                behind it is worse than no figure at all.
              </p>
            </div>
          </div>
          <div className="vis-container reveal" data-i="4">
            <AlbatrossPrediction />
          </div>
        </div>
      </section>

      <section id="research" className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Research horizon</p>
          <h2 className="section-heading reveal" data-i="1">Further out</h2>
        </div>
        <div className="research-grid stagger">
          {RESEARCH_PRODUCTS.map((product, i) => (
            <article key={product.slug} className="research-card reveal" data-i={i}>
              <p className="status-pill status-pill-quiet">{product.statusLabel}</p>
              <h3 className="research-name">
                <Link href={product.href}>{product.name}</Link>
              </h3>
              <p className="research-body">{product.blurb}</p>
            </article>
          ))}
        </div>
        <div className="cta-row">
          <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
        </div>
      </section>
    </>
  );
}
