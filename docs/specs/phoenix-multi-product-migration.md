# Phoenix multi-product migration

<!-- trace:v1 id=SPEC-PHO-7AR2V1RZ type=spec work=WORK-PHO-MB4M5AH6 -->

> **Superseded (2026-09-17) by ADR in WORK-PHO-32N4ZH5K.** Sections describing
> Raven as Technology-only, withholding pages from Peregrine and Owl, and
> rejecting a six-product Products menu no longer match the site. All six
> products now sit under Products with their own routes, grouped by maturity,
> and the homepage carries a system map. The concern those sections addressed —
> not implying six mature products — is met by rendering the registry status
> label on every surface instead of by hiding products.

## Problem

Site says Phoenix equals Mockingbird; stack is static HTML with plaintext preview password and no product-maturity source of truth.

## Goals

- Next.js 16.3 production scaffold that builds on Vercel

- Phoenix-system narrative with Osprey equal to Mockingbird

- Hardened preview gate and honest SEO foundation

## Non-goals

- GSAP signature animation

- Sales CRM pipeline

- Full resources library

## Test strategy

tsc --noEmit, next build, Vitest for safeRedirect and product registry, trace verify --changed

## Requirements

### Next.js migration preserves current site

<!-- trace:v1 id=REQ-PHO-XH2DZ7EX type=requirement work=WORK-PHO-MB4M5AH6 derived_from=SPEC-PHO-7AR2V1RZ -->

Static pages migrate to Next.js 16.3 App Router with React 19.3 TypeScript 7 Tailwind v4.3 and homepage visually matches current hero map problem Mockingbird founders sections

Acceptance:

- next build succeeds

- homepage sections render

### Multi-product hierarchy is explicit

<!-- trace:v1 id=REQ-PHO-K2EA5BTM type=requirement work=WORK-PHO-MB4M5AH6 derived_from=SPEC-PHO-7AR2V1RZ -->

Homepage and navigation give Mockingbird and Osprey equal flagship weight with Raven as intelligence layer and Albatross marked in-development

Acceptance:

- Osprey section exists with equal weight

- research items carry research status

### Preview login is hardened

<!-- trace:v1 id=REQ-PHO-EM6MDMQA type=requirement work=WORK-PHO-MB4M5AH6 derived_from=SPEC-PHO-7AR2V1RZ -->

Preview gate stores password hash, issues short host-bound session cookie, validates redirects, and sends noindex plus security headers

Acceptance:

- hash comparison only

- safeRedirect rejects open redirects
