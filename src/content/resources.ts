// trace:v1 id=impl.resources-content work=WORK-PHO-18KENMFK satisfies=REQ-PHO-3KRYSF5K
export interface Figure {
  value: string;
  label: string;
  source: string;
}

// trace:exempt reason=internal-detail -- market shape
export interface MarketRow {
  market: string;
  estimate: string;
  relevance: string;
}

export const PALISADES: Figure[] = [
  { value: "23,448", label: "acres burned", source: "CAL FIRE damage assessment" },
  { value: "6,845", label: "structures destroyed, 975 damaged", source: "CAL FIRE damage assessment" },
  { value: "12", label: "civilian fatalities", source: "CAL FIRE damage assessment" },
  { value: "41,800 claims · $23.7B paid", label: "Palisades + Eaton payouts to Mar 3, 2026", source: "California Department of Insurance" },
  { value: "$76–131B", label: "property and capital losses (estimate)", source: "UCLA Anderson revised analysis; estimates depend on assumptions" },
  { value: "~$40B", label: "insured losses, costliest wildfire event on record", source: "Swiss Re estimate" },
];

export const NATIONAL: Figure[] = [
  { value: "77,850", label: "U.S. wildfires in 2025", source: "Federal fire statistics" },
  { value: "5.13M acres", label: "burned in 2025 (8.93M in 2024; activity is volatile)", source: "Federal fire statistics" },
  { value: "$40B+", label: "annual U.S. wildfire economic losses", source: "Forest Service" },
  { value: "$3B+", label: "average annual federal suppression spend, last decade", source: "Federal land-management agencies" },
];

export const GOVERNMENT_SPEND: Figure[] = [
  { value: "$4.5B", label: "CAL FIRE enacted 2025–26 budget", source: "State budget" },
  { value: "$37.1M/yr", label: "AI tools + Fire Integrated Real-Time Intelligence System", source: "Governor wildfire investment summary" },
  { value: "$3.5M/yr", label: "fire-detection cameras + satellite mapping", source: "Governor wildfire investment summary" },
  { value: "$2.55B", label: "FY2025 Forest Service Wildland Fire Management request", source: "Federal budget request" },
];

export const ADJACENT_MARKETS: MarketRow[] = [
  { market: "Public safety software", estimate: "$19.3B (2024) → $35.7B (2030), 10.8% CAGR", relevance: "Broad Mockingbird/Osprey environment" },
  { market: "Geospatial imagery analytics", estimate: "$12.12B (2025) → $18.55B (2030), 8.9% CAGR", relevance: "Osprey-adjacent" },
  { market: "Geospatial intelligence", estimate: "$37.13B (2025) → $62.88B (2030), 11.1% CAGR", relevance: "Broad Osprey/Raven-adjacent" },
  { market: "Wildfire defense systems", estimate: "$1.14B (2025) → $1.70B (2030), ~8.3% CAGR", relevance: "Narrow wildfire-specific proxy" },
  { market: "Firefighting drones", estimate: "$1.34B (2025) → $3.40B (2034), 10.9% CAGR", relevance: "Future Peregrine-adjacent, not core business" },
];

export const TAM_SENSITIVITY = {
  base: "21,366 currently reporting U.S. departments (USFA 2025; NFPA 29,452 is a 2020-based older reference)",
  rows: [
    { contract: "$25,000", ceiling: "~$534M" },
    { contract: "$50,000", ceiling: "~$1.07B" },
    { contract: "$100,000", ceiling: "~$2.14B" },
  ],
};
