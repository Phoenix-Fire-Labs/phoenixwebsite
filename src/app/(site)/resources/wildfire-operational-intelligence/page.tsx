import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { AcreageVolatility } from "@/components/visuals/AcreageVolatility";
import { MarketSpans } from "@/components/visuals/MarketSpans";
import { SpendProportion } from "@/components/visuals/SpendProportion";
import { TamSensitivity } from "@/components/visuals/TamSensitivity";
import Link from "next/link";
import {
  NATIONAL,
  PALISADES,
  type Figure,
} from "@/content/resources";

export const metadata: Metadata = {
  alternates: canonicalFor("/resources/wildfire-operational-intelligence"),
  title: "Wildfire Operational Intelligence",
  description:
    "Sourced figures on Palisades damage, national wildfire scale, government spend, adjacent markets, and TAM sensitivity.",
};

// trace:exempt reason=presentational-helper
function Figures({ items }: { items: Figure[] }) {
  return (
    <dl className="figure-list">
      {items.map((figure) => (
        <div key={figure.value + figure.label}>
          <dt>{figure.value}</dt>
          <dd>
            {figure.label}
            <span className="figure-source">Source: {figure.source}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

// trace:v1 id=impl.resources-post work=WORK-PHO-18KENMFK satisfies=REQ-PHO-3KRYSF5K
export default function ResearchPost() {
  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">
          <Link href="/resources" className="text-link">Resources</Link> · Research
        </p>
        <h1>Wildfire operational intelligence: why the picture falls apart.</h1>
        <p className="lede prose">
          Command teams hunt across radio channels, map layers, satellite imagery, evacuation
          systems, infrastructure feeds, and perimeter reports. Phoenix exists to assemble those
          feeds into one continuously updated operational picture.
        </p>
      </section>

      <section className="section-pad">
        <div className="prose">
          <h2>Palisades: what happened</h2>
          <p>
            The Palisades Fire began January 7, 2025. The figures below come from CAL FIRE&apos;s
            completed damage assessment and from insurance and economic analyses published
            afterward; the loss estimates are explicitly estimates that depend on their authors&apos;
            assumptions.
          </p>
        </div>
        <Figures items={PALISADES} />

        <div className="prose">
          <h2>National scale</h2>
          <p>
            Wildfire activity is volatile rather than smoothly increasing: 2025 burned roughly 5.13
            million acres across 77,850 fires, while 2024 burned nearly 8.93 million. Any argument
            that rests on a single year&apos;s trend line is the wrong argument.
          </p>
        </div>
        <AcreageVolatility />
        <Figures items={NATIONAL} />

        <div className="prose">
          <h2>Government already spends on this problem</h2>
          <p>
            This is not an invented software category seeking a budget. Agencies already spend
            heavily on response, aviation, information, mapping, communications, and intelligence —
            including line items specifically for AI-assisted fire intelligence and detection.
            Phoenix must earn a portion of existing operational spend by demonstrably improving
            outcomes.
          </p>
        </div>
        <SpendProportion />

        <div className="prose">
          <h2>Adjacent markets</h2>
          <p>
            These are commercial market-research projections for markets Phoenix touches. They are
            reference points, not a Phoenix market size — and they overlap heavily, so they must
            never be added together.
          </p>
        </div>
        <MarketSpans />

        <div className="prose">
          <h2>TAM sensitivity, not a TAM claim</h2>
          <p>
            Until pricing is established there is no single defensible number, so the cases below are
            a sensitivity analysis rather than an answer.
          </p>
        </div>
        <TamSensitivity />

        <div className="cta-row">
          <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
          <Link href="/resources" className="btn btn-secondary">All resources</Link>
        </div>
      </section>
    </>
  );
}
