import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import Link from "next/link";
import { SolutionMatrix } from "@/components/visuals/SolutionMatrix";
import { SOLUTIONS } from "@/content/solutions";

export const metadata: Metadata = {
  alternates: canonicalFor("/solutions"),
  title: "Solutions",
  description:
    "Phoenix solutions for incident command, operations planning, and utility wildfire programs.",
};

// trace:v1 id=impl.solutions-page work=WORK-PHO-18KENMFK satisfies=REQ-PHO-3KRYSF5K
export default function SolutionsPage() {
  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">Solutions</p>
        <h1>Built for the roles on the fireground.</h1>
        <p className="lede prose">
          The same three systems, entered from wherever you sit. Mockingbird reads the radio, Osprey
          holds the picture, and Raven keeps them describing one incident.
        </p>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">One family, three entrances</p>
          <div className="reveal" data-i="1">
            <SolutionMatrix />
          </div>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="card-grid stagger">
          {SOLUTIONS.map((solution, i) => (
            <article key={solution.slug} className="card reveal" data-i={i}>
              <p className="card-eyebrow">{solution.role}</p>
              <h2 className="card-title">
                <Link href={`/solutions/${solution.slug}`}>{solution.title}</Link>
              </h2>
              <p className="card-summary">{solution.summary}</p>
              <Link href={`/solutions/${solution.slug}`} className="text-link">
                {solution.title} in detail →
              </Link>
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
