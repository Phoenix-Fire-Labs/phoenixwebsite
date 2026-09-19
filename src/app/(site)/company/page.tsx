import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import Link from "next/link";
import { AudienceRoutes } from "@/components/visuals/AudienceRoutes";
import { FoundersTimeline } from "@/components/visuals/FoundersTimeline";

export const metadata: Metadata = {
  alternates: canonicalFor("/company"),
  title: "Company",
  description:
    "Phoenix Fire Labs builds operational intelligence systems for wildfire response, founded after the Palisades Fire.",
};

const PALISADES = [
  { value: "23,448", label: "acres burned" },
  { value: "6,845", label: "structures destroyed, 975 damaged" },
  { value: "12", label: "civilian lives lost" },
];

const PRINCIPLES = [
  {
    title: "Field utility over demo polish",
    body: "The measure is whether a division supervisor can act on what the screen says during an operational period, not whether it looks good in a deck.",
  },
  {
    title: "Say what the system actually does",
    body: "We describe mechanisms, not adjectives. Where we have not benchmarked something, we state it as a goal rather than a result.",
  },
  {
    title: "One operational world",
    body: "Separate tools that each hold their own version of the incident are the problem we exist to remove, so our own systems share one model.",
  },
];

// trace:v1 id=impl.company-page work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export default function CompanyPage() {
  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">Company</p>
        <h1>Phoenix exists to make fireground information move faster.</h1>
        <p className="lede prose">
          Phoenix Fire Labs builds operational intelligence systems for wildfire response:
          Mockingbird for tactical radio, Osprey for the operational picture, and Raven as the model
          they share.
        </p>
      </section>

      <section className="section-pad stagger">
        <div className="split-section">
          <div className="content-container">
            <p className="section-label reveal" data-i="0">Founded in fire</p>
            <h2 className="section-heading reveal" data-i="1">The Palisades Fire, January 2025.</h2>
            <dl className="figure-list reveal" data-i="2">
              {PALISADES.map((item) => (
                <div key={item.label}>
                  <dt>{item.value}</dt>
                  <dd>
                    {item.label}
                    <span className="figure-source">Source: CAL FIRE completed damage assessment</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="prose reveal" data-i="3">
              <p>
                Phoenix Fire Labs was founded by Carter LaSalle and Jack Phelps after losing their
                homes in the Palisades Fire.
              </p>
              <p>
                The experience exposed how difficult it can be to assemble a clear picture of a
                fast-moving incident while information is arriving through radio traffic, maps,
                evacuation systems, imagery, and separate operational feeds. None of those systems
                was wrong. None of them could see the others.
              </p>
            </div>
          </div>
          <div className="vis-container reveal" data-i="4">
            <FoundersTimeline />
          </div>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">How we build</p>
          <h2 className="section-heading reveal" data-i="1">Three commitments.</h2>
        </div>
        <div className="card-grid stagger">
          {PRINCIPLES.map((principle, i) => (
            <article key={principle.title} className="card reveal" data-i={i}>
              <h3 className="card-title">{principle.title}</h3>
              <p className="card-summary">{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Who we build for</p>
          <div className="prose reveal" data-i="1">
            <p>
              Incident command teams, wildfire response agencies, and utility wildfire programs —
              organizations that already run an operational period and already spend on mapping,
              communications, and intelligence. Phoenix has to earn part of that existing spend by
              improving outcomes, not by inventing a new budget line.
            </p>
          </div>
          <div className="reveal" data-i="2">
            <AudienceRoutes />
          </div>
          <div className="cta-row reveal" data-i="3">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
            <Link href="/careers" className="btn btn-secondary">See open roles</Link>
          </div>
        </div>
      </section>
    </>
  );
}
