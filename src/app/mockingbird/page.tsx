import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import Link from "next/link";
import { TranscriptExtraction } from "@/components/visuals/TranscriptExtraction";
import { MockingbirdRadioFlow } from "@/components/visuals/MockingbirdRadioFlow";

/** Title carries the category because "Mockingbird" alone is a bird, an
 *  unrelated bank, and a novel (spec §41). The H1 stays clean. */
export const metadata: Metadata = {
  alternates: canonicalFor("/mockingbird"),
  title: "Mockingbird Wildfire Radio Intelligence",
  description:
    "Mockingbird turns tactical VHF radio traffic into structured incident intelligence: locations, units, and events synchronized to command views.",
};

const SIGNALS = [
  "Unit E72 · advancing north past Ridge 4",
  "Division Alpha · holding line at the western flank",
  "Water tender request at staging, acknowledged",
];

// trace:v1 id=impl.mockingbird-page work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-K2EA5BTM
export default function MockingbirdPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Flagship · Radio Intelligence</p>
          <h1 className="hero-headline">Mockingbird</h1>
          <p className="hero-sub">
            Tactical radio becomes structured intelligence. Mockingbird listens to tactical VHF
            communications, transcribes noisy field audio, extracts locations, units, and incident
            events, and synchronizes them to geospatial command views.
          </p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
            <a href="#how" className="btn btn-secondary">How it works ↓</a>
          </div>
        </div>
        <div className="hero-vis">
          <svg
            className="mb-pipeline"
            viewBox="0 0 400 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Mockingbird pipeline: listen, transcribe, extract, synchronize"
          >
            <g stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="24" cy="60" r="2.5" fill="var(--color-accent)" stroke="none" />
              <path d="M 30 54 A 8 8 0 0 1 30 66" className="wave-anim" />
              <path d="M 35 49 A 14 14 0 0 1 35 71" className="wave-anim" />
            </g>
            <g fill="var(--color-accent)">
              <rect x="80" y="48" width="4" height="24" rx="2" opacity="0.6" />
              <rect x="90" y="40" width="4" height="40" rx="2" />
              <rect x="100" y="50" width="4" height="20" rx="2" opacity="0.7" />
              <line x1="70" y1="60" x2="115" y2="60" stroke="var(--color-accent)" strokeWidth="1" className="scan-anim" opacity="0.8" />
            </g>
            <g stroke="var(--color-text-secondary)" strokeWidth="1.5">
              <circle cx="180" cy="50" r="3" fill="var(--color-accent)" stroke="none" className="extract-anim" />
              <line x1="188" y1="50" x2="205" y2="50" />
              <circle cx="180" cy="70" r="3" fill="var(--color-accent)" stroke="none" className="extract-anim" />
              <line x1="188" y1="70" x2="202" y2="70" />
            </g>
            <g stroke="var(--color-accent)" strokeWidth="1.5">
              <path d="M 300 45 C 308 45 314 51 314 59 C 314 69 300 77 300 77 C 300 77 286 69 286 59 C 286 51 292 45 300 45 Z" />
              <circle cx="300" cy="58" r="4.5" fill="var(--color-accent)" stroke="none" />
            </g>
            {/* Each label is centred on its own glyph; x=8 clipped "Listen". */}
            <g fontFamily="Figtree, system-ui, sans-serif" fontSize="9" fill="var(--color-text-secondary)" textAnchor="middle">
              <text x="30" y="100">Listen</text>
              <text x="92" y="100">Transcribe</text>
              <text x="188" y="100">Extract</text>
              <text x="300" y="100">Synchronize</text>
            </g>
            <g stroke="var(--color-rule)" strokeWidth="1">
              <line x1="48" y1="60" x2="64" y2="60" />
              <line x1="120" y1="60" x2="160" y2="60" />
              <line x1="222" y1="60" x2="276" y2="60" />
            </g>
          </svg>
        </div>
      </section>

      <section className="problem section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">The radio problem</p>
          <blockquote className="problem-pull reveal" data-i="1">
            Critical updates are often trapped in voice traffic and manual logs.
          </blockquote>
          <p className="section-body reveal" data-i="2">
            Crews report constantly; command can only listen to one channel at a time. Anything not
            heard live waits for a relay, a log entry, or a briefing — while the incident moves on.
          </p>
        </div>
      </section>

      <section id="how" className="mockingbird section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">How Mockingbird works</p>
          <h2 className="section-heading reveal" data-i="1">Listen. Transcribe. Extract. Synchronize.</h2>
        </div>
        <MockingbirdRadioFlow />
      </section>

      <section className="section-pad stagger">
        <div className="split-section">
          <div className="content-container">
            <p className="section-label reveal" data-i="0">Operational signals</p>
            <h2 className="section-heading reveal" data-i="1">What a transmission becomes.</h2>
            <p className="section-body reveal" data-i="2">
              A single call carries several operational facts at once. Mockingbird separates them
              so each can be placed, timed, and attributed.
            </p>
            <ul className="capabilities reveal" data-i="3">
              {SIGNALS.map((signal) => <li key={signal}>{signal}</li>)}
            </ul>
          </div>
          <div className="content-container reveal" data-i="4">
            <TranscriptExtraction />
          </div>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Mockingbird and Osprey</p>
          <h2 className="section-heading reveal" data-i="1">Structured updates need somewhere to land.</h2>
          <p className="section-body reveal" data-i="2">
            Extraction only matters if the result reaches the picture command is already reading.
            Mockingbird writes its observations into Raven, the shared operational model, where
            Osprey renders them alongside perimeters, evacuation zones, and infrastructure.{" "}
            <Link href="/osprey" className="text-link">See Osprey →</Link>
          </p>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">Deployment and security</p>
          <p className="section-body reveal" data-i="1">
            Designed for command environments: scoped ingest, signed provenance on every
            observation, and reviewable structured outputs before anything reaches the map.
          </p>
          <div className="cta-row reveal" data-i="2">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
