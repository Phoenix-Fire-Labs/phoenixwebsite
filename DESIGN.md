# Phoenix website design

## Narrative

Phoenix builds intelligence systems for wildfire command. Mockingbird
understands radio traffic. Osprey assembles the operational map. Raven connects
what those systems know. Albatross is the next step toward prediction. The
homepage must leave first-time visitors with that mental model, never with
"AI transcription startup with vague map plans."

## Hierarchy (enforced by `src/lib/product-status.ts`)

- Mockingbird + Osprey: equal flagship weight, largest homepage modules.
- Raven: shared intelligence layer, "powered by" framing, never "buy Raven."
- Albatross: large roadmap card, always labeled in-development.
- Peregrine + Owl: small monochrome research cards, no top-nav product pages.

## Visual system

Fraunces + Figtree; warm off-white `#f6f3ed`, charcoal, burnt orange accent.
`src/app/globals.css` ports the golden-master class vocabulary (hero, problem,
flow, capabilities, footer, reveal, section-line) with static-first behavior:
content is fully visible without JS; `.js-anim` (added by the Reveal island)
enables entrance choreography, contour draws, pulses, and scroll reveals, all
with `prefers-reduced-motion` fallbacks. SVG is the default visual language;
Canvas only if needed, WebGPU/Three only if meaningfully better, always with a
static SVG fallback.

## Signature story

`src/components/visuals/SignatureStory.tsx` (client island) plays radio waveform
→ Mockingbird extraction → Raven graph → Osprey map on a 3.2s timer with stage
buttons, `aria-live` announcements, and a `<noscript>` full-sequence fallback.
`Reveal`, `MockingbirdFlow`, `PlatformOrbit`, `FoundersTimeline` are the other
golden-master ports.

## Root layout

`src/proxy.ts` (Next 16.3 proxy convention) gates the site; `src/app/login`
is the branded gate; `/mockingbird`, `/osprey`, `/technology` carry the
flagship/platform story; `/contact` carries briefing intake; `/resources`
carries sourced research. Homepage JSON-LD is byte-stable and CSP-pinned (see
`scripts/jsonld-hash.mjs`). Launch states live in `docs/launch-runbook.md`.
