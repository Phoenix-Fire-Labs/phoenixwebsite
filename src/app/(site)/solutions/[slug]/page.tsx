import type { Metadata } from "next";
import Link from "next/link";
import { PhoenixSystemMap } from "@/components/visuals/PhoenixSystemMap";
import { notFound } from "next/navigation";
import { canonicalFor } from "@/lib/seo";
import { SOLUTIONS, findSolution } from "@/content/solutions";
import { CardGrid } from "@/components/marketing/CardGrid";
import { productBySlug } from "@/lib/product-status";

// trace:exempt reason=internal-detail -- static params
export function generateStaticParams() {
  return SOLUTIONS.map((solution) => ({ slug: solution.slug }));
}

// trace:exempt reason=internal-detail -- slug metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = findSolution(slug);

  if (!solution) return { title: "Solutions" };

  return {
    title: `${solution.title} | Wildfire Operations`,
    description: solution.summary,
    alternates: canonicalFor(`/solutions/${solution.slug}`),
  };
}

// trace:v1 id=impl.solutions-slug work=WORK-PHO-18KENMFK satisfies=REQ-PHO-3KRYSF5K
export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = findSolution(slug);

  if (!solution) notFound();

  return (
    <>
      <section className="page-hero">
        <p className="hero-eyebrow">
          <Link href="/solutions" className="text-link">Solutions</Link> · {solution.role}
        </p>
        <h1>{solution.title}</h1>
        <p className="lede prose">{solution.summary}</p>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">The pressure</p>
          <div className="prose reveal" data-i="1">
            <p>{solution.pressure}</p>
          </div>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">What does the work</p>
          <h2 className="section-heading reveal" data-i="1">The systems involved.</h2>
        </div>
        <CardGrid
          items={solution.systems.flatMap((system) => {
            const product = productBySlug(system.slug);

            // A solution referencing a slug the registry does not know is a
            // content bug; drop it rather than render a dead card.
            return product == null
              ? []
              : [{
                  id: product.slug,
                  eyebrow: product.statusLabel,
                  title: product.name,
                  href: product.href,
                  body: system.role,
                }];
          })}
        />
        <div className="content-container">
          <div className="reveal" data-i="2">
            <PhoenixSystemMap
              engaged={["raven", ...solution.systems.map((system) => system.slug)]}
              caption={`Highlighted: the systems ${solution.title.toLowerCase()} engages today. The rest of the family is dimmed, not absent — every system reads and writes the same model.`}
            />
          </div>
        </div>
      </section>

      <section className="section-pad stagger">
        <div className="content-container">
          <p className="section-label reveal" data-i="0">What changes</p>
          <ul className="capabilities reveal" data-i="1">
            {solution.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
          </ul>
          <div className="cta-row reveal" data-i="2">
            <Link href="/contact" className="btn btn-primary">Request a Briefing</Link>
            <Link href="/solutions" className="btn btn-secondary">Other solutions</Link>
          </div>
        </div>
      </section>
    </>
  );
}
