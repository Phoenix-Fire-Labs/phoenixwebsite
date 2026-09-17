# Promote all six products to first-class pages under Products

<!-- trace:v1 id=ADR-PHO-AJGT82W2 type=decision work=WORK-PHO-32N4ZH5K -->

## Status

Accepted

## Context

The migration spec deliberately hid four of six products. Section 3 says not to put six bird names in the header. Section 2 says Raven should read as 'Powered by Raven', not something you buy. Section 16 gives Peregrine and Owl 'no individual sales pages yet'. Section 43 says not to mark them as shipping products in structured data.

In practice that produced a site where a reader cannot tell what Phoenix makes. The homepage said 'Two systems, one operational picture' while six products exist; Raven and Albatross appeared mid-page with no grounding; four products had no page at all. The product owner asked for every product to live under Products, for Peregrine and Owl to have their own pages, and for a homepage map showing the whole family around Raven.

## Decision

Follow the product owner. All six products move under Products, each gets its own route, and the homepage carries a system map with Raven at the centre.

The spec's underlying concern — not implying five mature products where there are two — is kept by other means rather than by hiding the products: every surface renders the maturity status from the canonical registry (flagship / intelligence layer / in development / long-term research), the navigation groups products by that status rather than listing six flat names, and structured data continues to describe only the flagship products as SoftwareApplication.

## Consequences

Diverges from spec sections 2, 3, 16 and 42 as written; those sections should be updated to match or explicitly marked superseded, otherwise the next agent will read the spec and undo this.

Risk accepted: giving a research concept its own page invites readers to treat it as purchasable. Mitigated by status labels on every card and page, and by not adding product schema for non-flagship entries. If a research page ever starts reading as a sales page, that is the signal this decision needs revisiting.
