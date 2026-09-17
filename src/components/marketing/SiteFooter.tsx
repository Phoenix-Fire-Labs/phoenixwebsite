import Link from "next/link";
import { BRIEFING_CTA, FOOTER_LEGAL, NAV_GROUPS } from "./nav-links";

/** Footer: brand block, full sitemap, legal. The blurb describes Phoenix as a
 *  system of products (spec §1) rather than Mockingbird alone, and frames the
 *  latency compression as the goal it is — §26 rules out claiming it as a
 *  measured result before there are benchmarks. */
// trace:v1 id=impl.site-footer work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-block">
        <img src="/allblack.png" alt="Phoenix Fire Labs" className="footer-logo" />
        <p className="footer-blurb">
          Phoenix Fire Labs builds operational intelligence systems for wildfire response.
          Mockingbird reads tactical VHF traffic and turns locations, units, and incident events
          into structured updates. Osprey assembles GIS, satellite imagery, fire perimeters,
          evacuations, infrastructure, and field observations into one live operational picture.
          Raven is the shared model both refer to. Our goal is to shorten the distance between
          what crews report and what command can see.
        </p>
        <img
          src="/nvidia-inception-program-badge-rgb-for-screen.svg"
          alt="NVIDIA Inception Program"
          className="footer-nvidia-badge"
        />
      </div>

      <nav className="footer-nav" aria-label="Footer">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="footer-nav-group">
            <p className="footer-nav-heading">{group.label}</p>
            <ul>
              {group.sections.flatMap((s) => s.links).map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="footer-nav-group">
          <p className="footer-nav-heading">Contact</p>
          <ul>
            <li><Link href={BRIEFING_CTA.href}>{BRIEFING_CTA.label}</Link></li>
            <li><a href="mailto:founders@phoenixfirelabs.com">founders@phoenixfirelabs.com</a></li>
          </ul>
        </div>
      </nav>

      <div className="footer-legal">
        <span className="footer-copy">&copy; 2026 Phoenix Fire Labs</span>
        {FOOTER_LEGAL.map((link) => (
          <Link key={link.href} href={link.href} className="footer-copy">{link.label}</Link>
        ))}
      </div>
    </footer>
  );
}
