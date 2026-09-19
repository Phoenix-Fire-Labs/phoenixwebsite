import Link from "next/link";
import type { ReactNode } from "react";
import { CardGrid } from "@/components/marketing/CardGrid";
import { PRODUCTS, type Product } from "@/lib/product-status";

// trace:v1 id=impl.product-section-shape work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export interface ProductSection {
  label: string;
  heading: string;
  body: string[];
  list?: string[];
  /** Figure for the section's other column. Without one the section renders as
   *  a single text column, which on a long page leaves the right half of every
   *  screen empty -- the reason these pages read as sparse regardless of how
   *  good the copy is. */
  figure?: ReactNode;
}

/** Shared shell for every product page.
 *
 *  One component so the six product pages cannot drift apart in spacing,
 *  heading level or status presentation. The status label is rendered from
 *  the registry rather than passed in, so a research concept can never be
 *  dressed up as a shipping product by whoever writes the page. */
// trace:v1 id=impl.product-page-shell work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export function ProductPage({
  product,
  lede,
  sections,
  visual,
}: {
  product: Product;
  lede: string;
  sections: ProductSection[];
  visual?: ReactNode;
}) {
  const related = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">{product.statusLabel} · {product.category}</p>
          <h1 className="hero-headline">{product.name}</h1>
          <p className="hero-sub">{lede}</p>
          <div className="cta-row">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
            <Link href="/#system" className="btn btn-secondary">See the whole system</Link>
          </div>
        </div>
        {visual ? <div className="hero-vis">{visual}</div> : null}
      </section>

      {sections.map((section, i) => {
        const copy = (
          <div className="content-container">
            <p className="section-label reveal" data-i="0">{section.label}</p>
            <h2 className="section-heading reveal" data-i="1">{section.heading}</h2>
            <div className="prose reveal" data-i="2">
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.list ? (
              <ul className="capabilities reveal" data-i="3">
                {section.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
          </div>
        );

        if (section.figure == null) {
          return (
            <section key={section.heading} className="section-pad stagger">
              {copy}
            </section>
          );
        }

        // Alternate which side the figure sits on so a page with several
        // figures reads as a rhythm rather than a column of stacked diagrams.
        return (
          <section
            key={section.heading}
            className={i % 2 === 0 ? "section-pad stagger split-section" : "section-pad stagger split-section reverse"}
          >
            {copy}
            <div className="vis-container reveal" data-i="3">{section.figure}</div>
          </section>
        );
      })}

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">The rest of the system</p>
          <h2 className="section-heading reveal" data-i="1">{product.name} does not work alone.</h2>
        </div>
        <CardGrid
          items={related.map((other) => ({
            id: other.slug,
            eyebrow: other.statusLabel,
            title: other.name,
            href: other.href,
            body: `${other.tagline} — ${other.relation}.`,
          }))}
        />
        <div className="cta-row">
          <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
        </div>
      </section>
    </>
  );
}
