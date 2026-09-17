/** Solution definitions, shared by the index and the detail route so the two
 *  can never describe the same solution differently. */
// trace:v1 id=impl.solutions-content work=WORK-PHO-18KENMFK satisfies=REQ-PHO-3KRYSF5K
export interface Solution {
  slug: string;
  title: string;
  role: string;
  summary: string;
  pressure: string;
  systems: { name: string; href: string; role: string }[];
  outcomes: string[];
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "incident-command",
    title: "Incident command",
    role: "IC, operations section, division supervisors",
    summary:
      "Radio traffic and the operational map stop being two separate jobs held together by one person's attention.",
    pressure:
      "During the initial and extended attack, the incident changes faster than anyone can transcribe it. Command can monitor one channel at a time, and anything not heard live waits for a relay or a log entry while the fire keeps moving.",
    systems: [
      { name: "Mockingbird", href: "/mockingbird", role: "Reads tactical VHF and extracts units, locations, and events." },
      { name: "Osprey", href: "/osprey", role: "Holds the live picture: perimeter, evacuations, infrastructure, imagery." },
      { name: "Raven", href: "/technology", role: "Keeps both on the same operational world, with provenance." },
    ],
    outcomes: [
      "Field reports reach the map without a manual relay step.",
      "Unit positions and assignments stay attributable to the transmission they came from.",
      "One current picture at shift change instead of a verbal reconstruction.",
    ],
  },
  {
    slug: "operations-planning",
    title: "Operations planning",
    role: "Planning section, situation unit, GIS specialists",
    summary:
      "Build the next operational period from a picture that is already assembled, rather than rebuilding it each cycle.",
    pressure:
      "The situation unit spends the planning cycle gathering the same layers from the same separate systems and reconciling them by hand, which leaves less time for the analysis the plan actually depends on.",
    systems: [
      { name: "Osprey", href: "/osprey", role: "Assembles the layers the plan is drawn against." },
      { name: "Raven", href: "/technology", role: "Holds operational state over time, so change is visible, not inferred." },
      { name: "Albatross", href: "/technology#albatross", role: "Prediction modeling. In development, not deployed." },
    ],
    outcomes: [
      "Less of the planning cycle spent assembling, more spent deciding.",
      "Perimeter and evacuation change tracked between periods rather than re-derived.",
      "A documented trail of where each element of the picture came from.",
    ],
  },
  {
    slug: "utility-wildfire",
    title: "Utility wildfire programs",
    role: "Utility wildfire mitigation and emergency response teams",
    summary:
      "See your infrastructure in the same picture as the fire, the evacuation zones, and the crews working near it.",
    pressure:
      "Utility wildfire teams need fire state, evacuation boundaries, and their own asset and de-energization footprint on one map during an event — and normally maintain that correlation manually, under time pressure, across organizations.",
    systems: [
      { name: "Osprey", href: "/osprey", role: "Infrastructure and evacuation overlays against live fire state." },
      { name: "Raven", href: "/technology", role: "Relates assets, zones, incidents, and observations over time." },
      { name: "Mockingbird", href: "/mockingbird", role: "Adds field intelligence from tactical traffic where available." },
    ],
    outcomes: [
      "Asset exposure read against current perimeter rather than the last briefing.",
      "Evacuation and de-energization footprints compared on one geography.",
      "A shared reference when coordinating with the responding agency.",
    ],
  },
];

// trace:exempt reason=internal-helper
export function findSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
