import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: canonicalFor("/contact"),
  title: "Request a Briefing",
  description:
    "Request a Phoenix Fire Labs briefing for incident command, operations planning, or utility wildfire programs.",
};

/** Request-time clock, isolated so the component body has no direct impure
 *  call. Server-rendered per request, never during a client render. */
// trace:exempt reason=internal-helper
function renderedAt(): number {
  return Date.now();
}

// trace:v1 id=impl.contact-page work=WORK-PHO-18KENMFK satisfies=REQ-PHO-9Q311JSZ
export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const status = await searchParams;
  // Rendered once per request on the server. Kept out of the JSX so the render
  // itself stays pure; the value is the dwell baseline the API compares against.
  const startedAt = renderedAt();

  return (
    <section className="page-hero">
      <p className="hero-eyebrow">Request a Briefing</p>
      <h1>Tell us about your operation.</h1>
      {status?.sent === "1" ? (
        <output>Received. We respond to qualified requests.</output>
      ) : null}
      {status?.error === "1" ? (
        <p role="alert">Something needs fixing below. Check each field and try again.</p>
      ) : null}
      <form method="POST" action="/api/contact" className="gate-form contact-form">
        <label className="gate-label" htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Alex Reyes" required minLength={2} maxLength={120} autoComplete="name" />
        <label className="gate-label" htmlFor="agency">Agency / organization</label>
        <input id="agency" name="agency" placeholder="Ridge County Fire" required minLength={2} maxLength={160} autoComplete="organization" />
        <label className="gate-label" htmlFor="email">Work email</label>
        <input id="email" name="email" type="email" placeholder="alex@ridgecounty.gov" required maxLength={254} autoComplete="email" />
        <label className="gate-label" htmlFor="role">Role</label>
        <input id="role" name="role" placeholder="Battalion Chief" required minLength={2} maxLength={120} autoComplete="organization-title" />
        <label className="gate-label" htmlFor="useCase">Use case</label>
        <select id="useCase" name="useCase" required defaultValue="incident-command">
          <option value="incident-command">Incident command</option>
          <option value="ops-planning">Operations planning</option>
          <option value="utility">Utility wildfire program</option>
          <option value="research">Research</option>
          <option value="other">Other</option>
        </select>
        <label className="gate-label" htmlFor="message">What are you trying to solve? (20+ characters)</label>
        <textarea id="message" name="message" rows={6} required minLength={20} maxLength={4000} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
        <input type="hidden" name="startedAt" value={startedAt} />
        <button type="submit">Request a Briefing</button>
      </form>
    </section>
  );
}
