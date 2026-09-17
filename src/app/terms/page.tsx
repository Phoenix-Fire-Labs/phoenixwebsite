import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Phoenix Fire Labs marketing site terms.",
};

// trace:v1 id=impl.terms-page work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">Terms</p>
        <h1>Site terms.</h1>
        <p className="section-body">
          This site describes systems in development and research concepts, not offers of sale.
          Roadmap and research content creates no commitment or timeline. Briefing submissions must
          be truthful and authorized by the submitter&apos;s organization.
        </p>
      </section>
    </>
  );
}
