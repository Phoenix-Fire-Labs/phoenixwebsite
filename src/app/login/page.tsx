import type { Metadata } from "next";
import { WildfireContourMap } from "@/components/visuals/WildfireContourMap";
import { safeRedirect } from "@/lib/safe-redirect";

/** Base for resolving the relative redirect reference. Any absolute origin
 *  works: safeRedirect returns a path, never an origin. */
const SITE_ORIGIN_FOR_PARSE = "https://www.phoenixfirelabs.com";

/** The gate must not inherit the site's marketing metadata. The root
 *  description, keywords and social cards all name the products, so an
 *  unauthenticated visitor (or anything scraping the page) read the full
 *  positioning straight out of <head>. Each inherited field is overridden,
 *  not just the title. */
export const metadata: Metadata = {
  title: "Private Preview",
  description: "Private preview. Authorized access only.",
  keywords: [],
  robots: { index: false, follow: false },
  openGraph: {
    title: "Phoenix Fire Labs",
    description: "Private preview. Authorized access only.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Phoenix Fire Labs",
    description: "Private preview. Authorized access only.",
    images: [],
  },
};

// trace:v1 id=impl.login-page work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  // Same guard the POST handler uses, so the hidden field can never carry a
  // value the server would reject — `startsWith("/")` alone admits `//evil`.
  const redirect = safeRedirect(params.redirect, SITE_ORIGIN_FOR_PARSE);

  return (
    <>
      <header className="site-header">
        <span className="logo" aria-label="Phoenix Fire Labs">
          <img src="/allblack.png" alt="Phoenix Fire Labs" className="logo-img" />
          <span className="logo-sub">Fire Labs</span>
        </span>
        <a href="mailto:founders@phoenixfirelabs.com" className="header-link">Contact</a>
      </header>
      <main id="main">
        <section className="hero login-hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Private Preview</p>
        <h1 className="hero-headline">
          <span className="line"><span>Hey!</span></span>
          <span className="line"><span>You found us.</span></span>
        </h1>
        <p className="hero-sub">
          We&apos;re building something pretty awesome, but we aren&apos;t ready to show
          everyone just yet. Reach out to{" "}
          <a href="mailto:founders@phoenixfirelabs.com">founders@phoenixfirelabs.com</a>
          {" "}to learn more, and maybe even get the secret password to our site!
        </p>
        <p className="login-note">Authorized access only.</p>
        {params.error === "1" ? (
          <p className="gate-error" role="alert">That password didn&apos;t work. Give it another try.</p>
        ) : null}
        <p className="gate-label"><label htmlFor="password">Password</label></p>
        <form method="POST" action="/api/preview/login" className="gate-form">
          <input type="hidden" name="redirect" value={redirect} />
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            required
          />
          <button type="submit" className="btn btn-primary">Enter Preview</button>
        </form>
      </div>
      <div className="hero-vis login-vis" aria-hidden="true">
        <WildfireContourMap decorative />
        <svg
          className="login-waveform"
          viewBox="0 0 320 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="var(--color-accent)">
            {[6, 18, 11, 26, 14, 30, 9, 22, 13, 28, 8, 19, 12, 24, 7, 16].map((h, i) => (
              <rect
                key={i}
                className="login-bar"
                x={i * 20 + 2}
                y={22 - h / 2}
                width="4"
                height={h}
                rx="2"
                opacity={0.3 + (h / 30) * 0.6}
              />
            ))}
          </g>
        </svg>
      </div>
        </section>
      </main>
      <footer className="site-footer login-footer">
        <span className="footer-copy">&copy; 2026 Phoenix Fire Labs</span>
      </footer>
    </>
  );
}
