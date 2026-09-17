# Phoenix product IA, system map, and design-scale standardization

<!-- trace:v1 id=SPEC-PHO-KT96E6TG type=spec work=WORK-PHO-32N4ZH5K -->

## Problem

The site presents Phoenix as two flagship products with Raven, Albatross, Peregrine and Owl mentioned in passing. Four of six products have no page. The homepage signature section is a text carousel that shows nothing. Spacing and type sizes were authored per-section, so equivalent elements differ between pages. On a normal laptop window the hero sits flush against the header rather than reading as a composed first screen.

## Goals

- A reader understands the whole product family and how it fits together within one screen of the homepage

- Every product has a page carrying its honest maturity status

- One design scale governs spacing and typography site-wide

- The first screen reads as composed at common window heights

## Non-goals

- Claiming maturity for research-horizon products

- Publishing TAM figures or ship dates

- Redesigning the brand palette or typefaces

- Replacing the existing SVG visual language

## Test strategy

Playwright asserts route resolution for all six products, nav coverage, presence and linkage of the system map, absence of the removed copy, hero visibility at 800px and 600px viewport heights, and computed-style equality for equivalent headings across pages. Vitest covers the product registry invariants.

## Requirements

### Every product is reachable and has its own page

<!-- trace:v1 id=REQ-PHO-NRXVT28A type=requirement work=WORK-PHO-32N4ZH5K derived_from=SPEC-PHO-KT96E6TG -->

All six products (Mockingbird, Osprey, Raven, Albatross, Peregrine, Owl) appear under the Products navigation and each resolves to its own route rather than a homepage fragment or a shared section.

Acceptance:

- Products navigation lists all six products

- /mockingbird /osprey /raven /albatross /peregrine /owl each return 200

- every product registry href points at its own route

- each product page states its maturity status from the registry

### Homepage carries a product system map

<!-- trace:v1 id=REQ-PHO-3YJG08V6 type=requirement work=WORK-PHO-32N4ZH5K derived_from=SPEC-PHO-KT96E6TG -->

The homepage shows a single node graph with Raven at the centre and every other product connected to it, so a first-time reader sees the whole family and how the parts relate in one view instead of scattered sections.

Acceptance:

- one system map on the homepage naming all six products

- Raven is the centre node

- each node links to that product's page

- the map renders without JavaScript

### Framing matches the real product count

<!-- trace:v1 id=REQ-PHO-406ZSYBP type=requirement work=WORK-PHO-32N4ZH5K derived_from=SPEC-PHO-KT96E6TG -->

Homepage copy describes Phoenix as a family of systems rather than 'two systems', and defensive hedging paragraphs about ship dates and TAM ceilings are removed.

Acceptance:

- no 'Two systems' heading on the homepage

- the research-horizon ship-date disclaimer is gone

- the TAM 'mathematical ceiling' paragraph is gone

- product maturity still comes from the registry status labels

### One spacing and type scale across the site

<!-- trace:v1 id=REQ-PHO-T9QVXJR8 type=requirement work=WORK-PHO-32N4ZH5K derived_from=SPEC-PHO-KT96E6TG -->

Section padding, heading sizes, body sizes and vertical rhythm come from a single set of design tokens, so equivalent elements are identical on every page.

Acceptance:

- section padding and heading sizes are token-driven, not per-page values

- equivalent headings render at the same computed size across pages

- no page introduces a one-off font-size or padding value

### Hero fills the viewport predictably

<!-- trace:v1 id=REQ-PHO-VTA4YYAW type=requirement work=WORK-PHO-32N4ZH5K derived_from=SPEC-PHO-KT96E6TG -->

The homepage hero is vertically balanced within the first screen at common laptop window heights, instead of sitting flush to the header on shorter windows.

Acceptance:

- hero content is vertically centred within the space below the header

- hero remains fully visible without scrolling at 800px viewport height

- no clipping at 600px viewport height
