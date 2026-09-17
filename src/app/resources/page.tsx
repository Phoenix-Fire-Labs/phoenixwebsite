import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import Link from "next/link";
import { GOVERNMENT_SPEND, NATIONAL } from "@/content/resources";

export const metadata: Metadata = {
  alternates: canonicalFor("/resources"),
  title: "Resources",
  description:
    "Sourced research on wildfire scale, Palisades impact, government operational spend, and the markets adjacent to Phoenix Fire Labs.",
};

const POSTS = [
  {
    slug: "wildfire-operational-intelligence",
    eyebrow: "Research",
    title: "Wildfire operational intelligence: why the picture falls apart",
    summary:
      "Radio, GIS, satellite, evacuations, infrastructure, and perimeters arrive through systems never designed to form one picture. With Palisades damage figures, national scale, government spend, and a TAM sensitivity table rather than a TAM claim.",
  },
];

// trace:v1 id=impl.resources-index work=WORK-PHO-18KENMFK satisfies=REQ-PHO-3KRYSF5K
export default function ResourcesPage() {
  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">Resources</p>
        <h1>Research, with sources attached.</h1>
        <p className="lede prose">
          Figures we rely on internally, published with where they came from. Where an estimate is a
          commercial market-research projection or depends on stated assumptions, we say so rather
          than rounding it into a headline.
        </p>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Written research</p>
        </div>
        <div className="card-grid stagger">
          {POSTS.map((post, i) => (
            <article key={post.slug} className="card reveal" data-i={i}>
              <p className="card-eyebrow">{post.eyebrow}</p>
              <h2 className="card-title">
                <Link href={`/resources/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="card-summary">{post.summary}</p>
              <Link href={`/resources/${post.slug}`} className="text-link">Read →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">National scale</p>
          <h2 className="section-heading reveal" data-i="1">Wildfire activity, and what it costs.</h2>
        </div>
        <dl className="figure-list reveal" data-i="2">
          {NATIONAL.map((figure) => (
            <div key={figure.value + figure.label}>
              <dt>{figure.value}</dt>
              <dd>
                {figure.label}
                <span className="figure-source">Source: {figure.source}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Operational spend</p>
          <h2 className="section-heading reveal" data-i="1">Agencies already fund this problem.</h2>
          <p className="section-body reveal" data-i="2">
            Wildfire response, aviation, mapping, communications, and intelligence carry existing
            budget lines measured in billions. Phoenix has to earn part of that spend by improving
            outcomes, not by creating a new category.
          </p>
        </div>
        <dl className="figure-list reveal" data-i="3">
          {GOVERNMENT_SPEND.map((figure) => (
            <div key={figure.value + figure.label}>
              <dt>{figure.value}</dt>
              <dd>
                {figure.label}
                <span className="figure-source">Source: {figure.source}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="cta-row">
          <Link href="/resources/wildfire-operational-intelligence" className="btn btn-secondary">
            Full research note
          </Link>
          <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
        </div>
      </section>
    </>
  );
}
