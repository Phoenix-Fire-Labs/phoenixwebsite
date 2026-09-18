import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import Link from "next/link";
import { CardGrid } from "@/components/marketing/CardGrid";
import { PhoenixSystemMap } from "@/components/visuals/PhoenixSystemMap";

export const metadata: Metadata = {
  alternates: canonicalFor("/careers"),
  title: "Careers",
  description: "Join Phoenix Fire Labs to build operational intelligence for wildfire response.",
};

/** Deliberately not a fake job board. The team is small enough that roles are
 *  handled by email, and inventing listings would waste candidates' time. */
const AREAS = [
  {
    title: "Speech and language systems",
    body: "Real-time transcription and signal extraction on noisy tactical VHF: degraded audio, heavy jargon, overlapping transmissions, and unit call signs that must resolve correctly.",
  },
  {
    title: "Geospatial engineering",
    body: "Perimeter, imagery, evacuation, and infrastructure layers assembled into one incident geography that stays correct as everything underneath it changes.",
  },
  {
    title: "Operational modeling",
    body: "The Raven layer: entities, relationships, time, and provenance for a world where two sources routinely disagree and the disagreement itself is information.",
  },
  {
    title: "Product and field research",
    body: "Time spent with incident command teams, turning how an operational period actually runs into software that survives contact with it.",
  },
];

// trace:v1 id=impl.careers-page work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export default function CareersPage() {
  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">Careers</p>
        <h1>Build systems that matter on the fireground.</h1>
        <p className="lede prose">
          We hire engineers who want field-driven work with public-safety stakes: short feedback
          loops, real operational constraints, and users whose worst day is the one your software
          has to hold up on.
        </p>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Where we need help</p>
          <h2 className="section-heading reveal" data-i="1">Four areas of work.</h2>
        </div>
        <CardGrid items={AREAS.map((area) => ({ title: area.title, body: area.body }))} />
        <div className="content-container">
          <div className="reveal" data-i="2">
            <PhoenixSystemMap
              caption="The four areas above map onto these systems. Mockingbird and Osprey are in service, Albatross is in development, and Peregrine and Owl are research directions rather than staffed projects."
            />
          </div>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">How to apply</p>
          <div className="prose reveal" data-i="1">
            <p>
              The team is small enough that we do not run a job board — posting listings we are not
              actively hiring against would waste your time. Write to{" "}
              <a href="mailto:founders@phoenixfirelabs.com">founders@phoenixfirelabs.com</a> with
              what you have shipped and why this problem interests you. Tell us which of the four
              areas above fits, or make the case for one we have not listed.
            </p>
            <p className="note">
              Wildland fire, dispatch, or emergency-management experience is genuinely useful here
              and does not need to come with a software background. Say so if you have it.
            </p>
          </div>
          <div className="cta-row reveal" data-i="2">
            <a href="mailto:founders@phoenixfirelabs.com" className="btn btn-primary">Email the founders</a>
            <Link href="/company" className="btn btn-secondary">Why Phoenix exists</Link>
          </div>
        </div>
      </section>
    </>
  );
}
