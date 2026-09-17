/** Machine-readable Phoenix truth, generated from the product registry so
 *  copy and metadata cannot disagree on maturity. SoftwareApplication schema
 *  is emitted for the two flagships only; Albatross (in-development) and
 *  Peregrine/Owl (research) are described in prose, never as shipping
 *  software. HOMEPAGE_JSONLD is byte-stable: page.tsx inlines this exact
 *  string and the CSP allowlist in next.config.ts hashes these exact bytes. */

import { PRODUCTS, type ProductStatus } from "./product-status";

export const HOMEPAGE_JSONLD: string =
  '{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://www.phoenixfirelabs.com/#org","name":"Phoenix Fire Labs","url":"https://www.phoenixfirelabs.com/","logo":"https://www.phoenixfirelabs.com/allblack.png","description":"Operational intelligence systems for wildfire response."},{"@type":"WebSite","url":"https://www.phoenixfirelabs.com/","name":"Phoenix Fire Labs","publisher":{"@id":"https://www.phoenixfirelabs.com/#org"}},{"@type":"SoftwareApplication","name":"Mockingbird Wildfire Radio Intelligence","applicationCategory":"PublicSafety","operatingSystem":"Web","url":"https://www.phoenixfirelabs.com/mockingbird","provider":{"@id":"https://www.phoenixfirelabs.com/#org"}},{"@type":"SoftwareApplication","name":"Osprey Wildfire Operational Intelligence","applicationCategory":"PublicSafety","operatingSystem":"Web","url":"https://www.phoenixfirelabs.com/osprey","provider":{"@id":"https://www.phoenixfirelabs.com/#org"}}]}';

// trace:v1 id=impl.structured-data work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-K2EA5BTM
function section(title: string, statuses: ProductStatus[]): string {
  const wanted = new Set(statuses);

  const items = PRODUCTS.filter((p) => wanted.has(p.status))
    .map((p) => `### ${p.name}\n${p.category}. Status: ${p.statusLabel}. ${p.blurb}\nPage: https://www.phoenixfirelabs.com${p.href}`)
    .join("\n\n");

  return `## ${title}\n\n${items}`;
}

export const LLMS_TXT: string = [
  "# Phoenix Fire Labs",
  "",
  "Phoenix Fire Labs develops operational intelligence systems for wildfire response.",
  "",
  section("Current flagship products", ["flagship"]),
  "",
  section("Technology", ["platform"]),
  "",
  section("Roadmap", ["in-development"]),
  "",
  section("Long-term research", ["research"]),
  "",
  "## Who Phoenix is for",
  "",
  "Incident command teams, wildfire response agencies, and utility wildfire programs.",
  "",
  "## Why Phoenix was founded",
  "",
  "Phoenix Fire Labs was founded by Carter LaSalle and Jack Phelps after losing their homes in the Palisades Fire (January 2025).",
  "",
  "## Solutions",
  "",
  "### Incident command",
  "Mockingbird radio intelligence plus Osprey operational picture, joined by Raven, at /solutions/incident-command.",
  "",
  "### Operations planning",
  "Osprey layers, Raven state, and Albatross outlook (in development) at /solutions/operations-planning.",
  "",
  "### Utility wildfire programs",
  "Infrastructure overlays, evacuation context, and field updates at /solutions/utility-wildfire.",
  "",
  "## Questions and answers",
  "",
  "### What is Phoenix Fire Labs?",
  "An operational wildfire intelligence company. Parent identity: Phoenix Fire Labs.",
  "",
  "### What does Mockingbird do?",
  "Turns tactical VHF radio traffic into structured incident intelligence: locations, units, events.",
  "",
  "### What does Osprey do?",
  "Assembles GIS, satellite imagery, perimeters, evacuations, infrastructure, and field data into one live operational picture.",
  "",
  "### How are Mockingbird and Osprey different?",
  "Mockingbird understands what crews report over radio. Osprey understands what exists and where on the map. Raven connects both.",
  "",
  "### What is Raven?",
  "The shared operational world model beneath Phoenix. Powered by Raven, never sold separately.",
  "",
  "### Is Albatross available?",
  "No. Albatross wildfire prediction modeling is in development, next on the Phoenix roadmap.",
  "",
  "### What is Phoenix working on later?",
  "Peregrine deployable field sensing and Owl augmented-reality field interface, both long-term research.",
  "",
  "### Who is Phoenix for?",
  "Incident command teams, wildfire response agencies, and utility wildfire programs.",
  "",
  "### Why was Phoenix founded?",
  "After the founders lost their homes in the January 2025 Palisades Fire, to make fireground information move faster.",
].join("\n");
