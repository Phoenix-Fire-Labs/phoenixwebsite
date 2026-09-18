# Encode magnitude in bespoke SVG rather than adding a charting library

<!-- trace:v1 id=ADR-PHO-N2VPTA57 type=decision work=WORK-PHO-45JQ77V3 -->

## Context

The pages with the strongest evidence render it as equal-sized cards, which flattens magnitude. Fixing that means drawing proportional marks. The obvious move is a charting library, and the site already carries GSAP for motion.

## Decision

Draw these as small bespoke SVGs reading from src/content, with no charting dependency. The figures are a handful of values per page, the visual language is already defined by the existing hand-drawn visuals and design tokens, and a general charting library would bring axis, tooltip and theme machinery none of this needs while making the output look unlike the rest of the site.

## Consequences

Each visual is a few dozen lines we own and can match to the tokens exactly, and they inherit the .js-anim and reveal conventions for free. The cost is that a genuinely complex chart later has no framework to fall back on; at that point reconsider rather than growing these by accretion. A proportion helper is shared so magnitude parsing is written once and unit-tested, rather than each visual re-deriving it.
