# Phoenix finish: polish story pipeline resources launch

<!-- trace:v1 id=SPEC-PHO-ZS047Z6C type=spec work=WORK-PHO-18KENMFK -->

## Problem

Foundation migrated but signature story, pipeline, library, polish, and launch path are missing.

## Goals

- Polished multi-product site

- Working story, pipeline, library, launch docs

## Non-goals

- Backend CRM integration

- 3D/WebGPU scenes

## Test strategy

tsc, vitest, next build, route smoke, trace verify

## Requirements

### Sections carry full Phoenix visual system

<!-- trace:v1 id=REQ-PHO-8P8WDXWR type=requirement work=WORK-PHO-18KENMFK derived_from=SPEC-PHO-ZS047Z6C -->

Homepage, product pages, login, and footer render the Phoenix identity (Fraunces/Figtree, warm tokens, sticky header, contour map, credibility strip, scroll reveals, reduced-motion) with no unstyled skeleton surfaces.

Acceptance:

- visual parity pass against golden master intent

- no unstyled pages

### Signature radio-to-map story plays

<!-- trace:v1 id=REQ-PHO-W3J1V0YP type=requirement work=WORK-PHO-18KENMFK derived_from=SPEC-PHO-ZS047Z6C -->

Homepage presents the radio waveform to Mockingbird extraction to Raven graph to Osprey map sequence with static SVG fallback when JS or motion is unavailable.

Acceptance:

- sequence renders statically without JS

- animated progression advances through four stages
### Briefing contact pipeline qualifies and protects

<!-- trace:v1 id=REQ-PHO-9Q311JSZ type=requirement work=WORK-PHO-18KENMFK derived_from=SPEC-PHO-ZS047Z6C -->

The briefing request form validates agency inputs server-side, rejects bots without blocking legitimate requesters, routes qualified messages, and never leaks whether an address was accepted.

Acceptance:

- invalid submissions return field errors without sending

- bot-like submissions are discarded silently

### Resources library publishes sourced research

<!-- trace:v1 id=REQ-PHO-3KRYSF5K type=requirement work=WORK-PHO-18KENMFK derived_from=SPEC-PHO-ZS047Z6C -->

The resources section publishes the spec's sourced wildfire figures (Palisades damage, national scale, government spend, adjacent markets, TAM sensitivity) with labeled commercial estimates and no summed TAM.

Acceptance:

- every figure carries its source label

- no combined TAM total is published

### Launch ungating path is explicit and safe

<!-- trace:v1 id=REQ-PHO-C4Q5XJHC type=requirement work=WORK-PHO-18KENMFK derived_from=SPEC-PHO-ZS047Z6C -->

Launch removes the site-wide gate through one documented variable flip while keeping login, API, and preview routes excluded from indexing and preserving the preview auth code for private use.

Acceptance:

- gated and ungated states both build and render

- private routes stay excluded from sitemap and robots
