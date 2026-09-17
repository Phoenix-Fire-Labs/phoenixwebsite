# Migrate to Next.js App Router

<!-- trace:v1 id=ADR-PHO-CXZ3F94F type=decision work=WORK-PHO-MB4M5AH6 -->

## Status

accepted

## Context

Static HTML site must move to Next.js App Router to support multi-product growth; alternative is staying on static HTML which cannot scale to product pages and server-side preview auth.

## Decision

Migrate to Next.js 16.3.5 App Router with React 19.3, TypeScript 7, Tailwind v4.3, server components by default.

## Consequences

Requires Node 20+ and Vercel deployment; enables product routes and server-side auth hardening.
