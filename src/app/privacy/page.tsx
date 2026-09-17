import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: canonicalFor("/privacy"),
  title: "Privacy",
  description: "Phoenix Fire Labs privacy notice for the marketing site and briefing intake.",
};

// trace:v1 id=impl.privacy-page work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">Privacy</p>
        <h1>What we collect, and why.</h1>
        <p className="section-body">
          The marketing site collects briefing requests (name, agency, email, role, use case,
          message) to evaluate fit and respond. Preview sessions use a signed cookie. We do not
          sell personal information. Operational customer data is out of scope for this notice and
          governed by separate agreements.
        </p>
      </section>
    </>
  );
}
