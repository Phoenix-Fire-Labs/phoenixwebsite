import type { Metadata } from "next";
import { ProductPage } from "@/components/products/ProductPage";
import { productBySlug } from "@/lib/product-status";

const product = productBySlug("peregrine")!;

export const metadata: Metadata = {
  title: "Peregrine Deployable Wildfire Sensing",
  description: product.blurb,
};

// trace:v1 id=impl.peregrine-page work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export default function PeregrinePage() {
  return (
    <ProductPage
      product={product}
      lede="Peregrine explores deployable field sensing: cheaper, more placeable observation nodes that report directly into Raven. It is a research direction, not a product you can buy."
      sections={[
        {
          label: "The question",
          heading: "Ground truth is expensive and sparse.",
          body: [
            "Fixed weather stations are accurate, few, and rarely where the incident is. Crews report what they can see, when they can get to a radio. Between those two lies a large amount of fireground no one is measuring.",
            "Peregrine asks what changes if an observation node costs little enough to place by the dozen, and reports into the same operational model everything else uses.",
          ],
        },
        {
          label: "Status",
          heading: "Research horizon.",
          body: [
            "There is no hardware to order, no pricing and no date. Peregrine is listed so the direction Phoenix is exploring is legible from the outside rather than something you discover in a meeting.",
            "If it becomes a product, this page changes and its status label changes with it.",
          ],
        },
      ]}
    />
  );
}
