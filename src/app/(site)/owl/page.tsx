import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { ProductPage } from "@/components/products/ProductPage";
import { ResearchHorizon } from "@/components/visuals/ResearchHorizon";
import { productBySlug } from "@/lib/product-status";

const product = productBySlug("owl")!;

export const metadata: Metadata = {
  alternates: canonicalFor("/owl"),
  title: "Owl Augmented-Reality Field Interface",
  description: product.blurb,
};

// trace:v1 id=impl.owl-page work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export default function OwlPage() {
  return (
    <ProductPage
      product={product}
      visual={<ResearchHorizon name="Owl" reads="Raven" constraints={["gloves", "smoke", "glare", "hands busy"]} />}
      lede="Owl explores an augmented-reality field interface reading from Raven, putting the operational picture in front of crews on the line. It is a research direction, not a product you can buy."
      sections={[
        {
          label: "The question",
          heading: "The picture is on a screen in a vehicle.",
          body: [
            "Command has the operational picture. The people standing in the terrain it describes usually do not — they have a radio, a paper map, and whatever they were told at briefing.",
            "Owl asks what an interface looks like when the shared model is available at the line, in a form that survives gloves, smoke, glare and a crew who cannot stop working to read it.",
          ],
        },
        {
          label: "Status",
          heading: "Research horizon.",
          body: [
            "No hardware, no pricing, no date. Owl is listed so the direction is visible rather than hidden, and because the question it asks shapes how Raven is designed today.",
            "If it becomes a product, this page changes and its status label changes with it.",
          ],
        },
      ]}
    />
  );
}
