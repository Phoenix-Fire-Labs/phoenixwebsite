import { productBySlug } from "@/lib/product-status";

/** Why prediction is the fourth system rather than the first.
 *
 *  The section argues a dependency order explicitly -- understanding what was
 *  reported, then what exists, then how they relate, and only then projecting
 *  forward -- so drawing that order asserts nothing the copy does not already
 *  say. Status comes from the registry, which is what keeps the last stage
 *  drawn as unbuilt rather than as the next tick of a roadmap. */
// trace:v1 id=impl.visual-prediction-order work=WORK-PHO-45JQ77V3 satisfies=REQ-PHO-TQ5N9DVW
export function PredictionOrder() {
  const ORDER = ["mockingbird", "osprey", "raven", "albatross"];

  const stages = ORDER.flatMap((slug) => {
    const product = productBySlug(slug);

    // A slug the registry does not know is a content bug; drop it rather than
    // render an empty stage in a sequence that is arguing about ordering.
    return product == null ? [] : [product];
  });

  return (
    <figure className="order">
      <ol className="order-steps">
        {stages.map((product, i) => {
          // "In service" is read off the registry status, so a product whose
          // status changes cannot leave this figure claiming the old one.
          const live = product.status === "flagship" || product.status === "platform";

          return (
            <li key={product.slug} className={live ? "order-step" : "order-step order-step-pending"}>
              <span className="order-rank">{i + 1}</span>
              <span className="order-name">{product.name}</span>
              <span className="order-role">{product.tagline}</span>
              <span className="order-status">{product.statusLabel}</span>
            </li>
          );
        })}
      </ol>
      <figcaption className="order-caption">
        Each stage reads what the one before it established. A forecast is only
        as good as the picture it starts from, which is why the last box is the
        one that does not exist yet.
      </figcaption>
    </figure>
  );
}
