import type { Metadata } from "next";
import Link from "next/link";
import {
  ADJACENT_MARKETS,
  GOVERNMENT_SPEND,
  NATIONAL,
  PALISADES,
  TAM_SENSITIVITY,
  type Figure,
} from "@/content/resources";

export const metadata: Metadata = {
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
        <Figures items={GOVERNMENT_SPEND} />

        <div className="prose">
          <h2>Adjacent markets</h2>
          <p>
            These are commercial market-research projections for markets Phoenix touches. They are
            reference points, not a Phoenix market size — and they overlap heavily, so they must
            never be added together.
          </p>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <caption className="figure-source">
              Commercial market-research estimates. Overlapping; not additive.
            </caption>
            <thead>
              <tr>
                <th scope="col">Adjacent market</th>
                <th scope="col">Estimate</th>
                <th scope="col">Relevance</th>
              </tr>
            </thead>
            <tbody>
              {ADJACENT_MARKETS.map((row) => (
                <tr key={row.market}>
                  <td>{row.market}</td>
                  <td>{row.estimate}</td>
                  <td>{row.relevance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose">
          <h2>TAM sensitivity, not a TAM claim</h2>
          <p>
            Until pricing is established there is no single defensible number, so the table below is
            a sensitivity analysis rather than an answer. Base: {TAM_SENSITIVITY.base}.
          </p>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Hypothetical average annual contract</th>
                <th scope="col">Implied department-only ceiling</th>
              </tr>
            </thead>
            <tbody>
              {TAM_SENSITIVITY.rows.map((row) => (
                <tr key={row.contract}>
                  <td>{row.contract}</td>
                  <td>{row.ceiling}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cta-row">
          <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
          <Link href="/resources" className="btn btn-secondary">All resources</Link>
        </div>
      </section>
    </>
  );
}
