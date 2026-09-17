import Link from "next/link";
import { BRIEFING_CTA, NAV_GROUPS } from "./nav-links";
import { MobileMenu } from "./MobileMenu";

/** Spec §3 header: four groups, flagship products first, briefing CTA.
 *
 *  Dropdowns open on hover and on `:focus-within`, so this stays a server
 *  component with no hydration cost and remains keyboard-navigable. The
 *  group label is itself a link, so every destination is reachable even if
 *  the panel never opens. */
// trace:v1 id=impl.site-header work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="logo" aria-label="Phoenix Fire Labs home">
        <img src="/allblack.png" alt="Phoenix Fire Labs" className="logo-img" />
        <span className="logo-sub">Fire Labs</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        <ul className="nav-groups">
          {NAV_GROUPS.map((group) => (
            <li key={group.label} className="nav-group">
              <Link href={group.href} className="nav-group-label">{group.label}</Link>
              <div className="nav-panel">
                {group.sections.map((section) => (
                  // Keyed by heading plus first destination: stable even for an
                  // unheaded section, unlike an array index.
                  <div key={`${section.heading ?? ""}:${section.links[0]?.href ?? ""}`} className="nav-panel-section">
                    {section.heading ? <p className="nav-panel-heading">{section.heading}</p> : null}
                    <ul>
                      {section.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link href={link.href}>
                            <span className="nav-item-label">{link.label}</span>
                            {link.detail ? <span className="nav-item-detail">{link.detail}</span> : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header-actions">
        <Link href={BRIEFING_CTA.href} className="btn btn-primary btn-sm">{BRIEFING_CTA.label}</Link>
        <MobileMenu />
      </div>
    </header>
  );
}
