import Link from "next/link";
import type { ReactNode } from "react";

export interface CardItem {
  /** Stable identity for the React key; falls back to the title. */
  id?: string;
  eyebrow?: string;
  title: string;
  href?: string;
  body: ReactNode;
}

/** A grid of titled cards.
 *
 *  Extracted because careers, solutions and every product page rendered the
 *  same article/title/summary tree by hand, so a spacing or heading-level
 *  change had to be repeated in each and inevitably would not be. */
// trace:v1 id=impl.card-grid work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-T9QVXJR8
export function CardGrid({ items, stagger = true }: { items: CardItem[]; stagger?: boolean }) {
  return (
    <div className={stagger ? "card-grid stagger" : "card-grid"}>
      {items.map((item, i) => (
        <article
          key={item.id ?? item.title}
          className={stagger ? "card reveal" : "card"}
          data-i={stagger ? i : undefined}
        >
          {item.eyebrow ? <p className="card-eyebrow">{item.eyebrow}</p> : null}
          <h3 className="card-title">
            {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
          </h3>
          <p className="card-summary">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
