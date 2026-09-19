import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { AlbatrossPrediction } from "@/components/visuals/AlbatrossPrediction";
import { PredictionOrder } from "@/components/visuals/PredictionOrder";
import { ProductPage } from "@/components/products/ProductPage";
import { productBySlug } from "@/lib/product-status";

const product = productBySlug("albatross")!;

export const metadata: Metadata = {
  alternates: canonicalFor("/albatross"),
  title: "Albatross Wildfire Prediction Modeling",
  description: product.blurb,
};

// trace:v1 id=impl.albatross-page work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export default function AlbatrossPage() {
  return (
    <ProductPage
      product={product}
      lede="Albatross extends the operational picture forward — from understanding what is happening now toward modeling what may happen next. It is in development and not deployed."
      visual={<AlbatrossPrediction />}
      sections={[
        {
          figure: <PredictionOrder />,
          label: "Where it sits",
          heading: "Prediction needs something to predict from.",
          body: [
            "Mockingbird understands what crews report. Osprey understands what exists and where. Raven understands the relationships and operational state between them. Albatross is the next step: reading that model and projecting it forward.",
            "The ordering matters. A forecast is only as good as the picture it starts from, which is why prediction is the fourth system rather than the first.",
          ],
        },
        {
          label: "What we are not claiming",
          heading: "In development means in development.",
          body: [
            "We are not publishing accuracy figures, lead times or spread projections, because we have not benchmarked them. A prediction number without a benchmark behind it is worse than no number at all — it invites operational trust the system has not earned.",
            "When there are benchmarks, they will appear here with their methodology attached.",
          ],
        },
      ]}
    />
  );
}
