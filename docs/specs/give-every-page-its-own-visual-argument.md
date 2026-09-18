# Give every page its own visual argument

<!-- trace:v1 id=SPEC-PHO-945X2HEX type=spec work=WORK-PHO-45JQ77V3 -->

## Problem

Measured across all fifteen routes: eight render zero svg elements, including the two pages that carry the richest sourced data. Every page uses one layout primitive, a left-aligned text column plus equal-sized cards. Equal boxes flatten magnitude, so the research page argues that agencies already fund this problem while rendering $4.5B and $37.1M/yr at identical visual weight, hiding that the AI line is roughly 0.8% of the budget.

## Goals

- Encode proportion where figures share a unit

- Give each text-only route a graphic that carries its specific meaning

- Reuse the existing token and reveal-animation system so new visuals match the site

- Keep every number traceable to src/content

## Non-goals

- Rewriting the prose, which is already strong

- A charting dependency; these are small bespoke SVGs

- Any claim about Albatross accuracy, or any date or roadmap for Peregrine and Owl

- Redesigning the header, footer or navigation

## Test strategy

An e2e guard asserting every non-exempt route renders at least one svg. An e2e guard asserting research-status product pages contain no percentage or date-like roadmap text. Unit coverage for the proportional-scale helper, including the range case and a zero-denominator. Visual verification by screenshot at 1440px and 400px.

## Requirements

### Sourced figures render at proportional scale

<!-- trace:v1 id=REQ-PHO-CC5YAZK2 type=requirement work=WORK-PHO-45JQ77V3 derived_from=SPEC-PHO-945X2HEX -->

Where a set of figures shares a unit, the page encodes their relative magnitude visually, so a reader sees the proportion without doing arithmetic. The AI-tooling line against the CAL FIRE budget is the motivating case.

Acceptance:

- A figure set with a shared unit renders a proportional encoding, not equal-sized boxes

- Every rendered value and its source string comes from src/content/resources.ts, never a literal in a component

- A value expressed as a range renders as a range, never as a point estimate

### Year-over-year volatility is visible

<!-- trace:v1 id=REQ-PHO-QFMRA2KE type=requirement work=WORK-PHO-45JQ77V3 derived_from=SPEC-PHO-945X2HEX -->

The national-scale section shows both compared years at once, because the accompanying text argues that a single year's trend line is the wrong basis for an argument.

Acceptance:

- Both 2025 and 2024 acreage appear in one encoding

- The encoding does not imply a trend line through two points

### No page is text-only

<!-- trace:v1 id=REQ-PHO-TQ5N9DVW type=requirement work=WORK-PHO-45JQ77V3 derived_from=SPEC-PHO-945X2HEX -->

Every marketing route carries at least one graphic appropriate to its content. Legal routes and the contact form are exempt.

Acceptance:

- Every route except /privacy, /terms and /contact renders at least one svg element

- A research-horizon product page states its uncertainty visually rather than implying a roadmap

### Claims stay within what the repository can source

<!-- trace:v1 id=REQ-PHO-HS2JV1A4 type=requirement work=WORK-PHO-45JQ77V3 derived_from=SPEC-PHO-945X2HEX -->

No visual introduces a datum, accuracy figure, date or projection that is not already sourced in the repository.

Acceptance:

- No numeric literal in a new visual that is absent from src/content

- Research-status products show no timeline, percentage or completion state
