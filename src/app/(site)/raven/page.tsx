import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { ProductPage } from "@/components/products/ProductPage";
import { RavenGraph } from "@/components/visuals/RavenGraph";
import { productBySlug } from "@/lib/product-status";

const product = productBySlug("raven")!;

/** "Raven" alone is a bird; the title carries the category so search and
 *  agents can disambiguate it (spec §41). */
export const metadata: Metadata = {
  alternates: canonicalFor("/raven"),
  title: "Raven Operational World Model",
  description: product.blurb,
};

// trace:v1 id=impl.raven-page work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export default function RavenPage() {
  return (
    <ProductPage
      product={product}
      lede="Raven gives Phoenix a shared model of the fireground. It connects people, units, places, incidents, events, assets, infrastructure, observations, relationships and time, so radio understanding and geospatial context refer to the same operational world."
      visual={<RavenGraph />}
      sections={[
        {
          label: "What it is",
          heading: "One world, not several databases.",
          body: [
            "Every other Phoenix system reads and writes Raven. Mockingbird contributes what crews report. Osprey contributes what exists and where. Raven holds the relationships and the operational state over time, with provenance on every observation.",
            "This is what keeps Phoenix from becoming several applications that each hold a private version of the incident — the problem the company exists to remove, and an embarrassing one to reproduce internally.",
          ],
        },
        {
          label: "What it models",
          heading: "The operational world, made explicit.",
          body: [
            "Raven is deliberately opinionated about what a fireground contains, because a shared model is only useful if two sources can disagree about the same thing and have that disagreement be legible.",
          ],
          list: [
            "Units and people — crews, apparatus and assignments, held stable across every source that mentions them",
            "Places and terrain — named features and divisions that radio refers to informally and maps refer to precisely",
            "Incidents and events — what happened, when it was reported, and how confident the system is",
            "Assets and infrastructure — the utilities, structures and values at risk that constrain tactics",
            "Observations — every claim carries its origin: which transmission, which layer, which crew, what time",
            "Time — operational state is a history, not a snapshot, so change between periods is visible rather than inferred",
          ],
        },
        {
          label: "How it is sold",
          heading: "Raven comes with Phoenix.",
          body: [
            "Raven is the layer beneath Mockingbird and Osprey rather than a separate purchase. It is documented here because you should be able to see what your systems agree on and why, not because it is a line item.",
          ],
        },
      ]}
    />
  );
}
