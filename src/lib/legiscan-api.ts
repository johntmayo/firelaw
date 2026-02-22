// LegiScan API integration — covers both California state AND federal legislation
// Free API key at: https://legiscan.com/legiscan-register
// Set LEGISCAN_API_KEY in .env.local

import { Bill, BillSource, BillStatus, BillTopic } from "./types";

const BASE_URL = "https://api.legiscan.com/";

interface LegiScanSearchResult {
  bill_id: number;
  bill_number: string;
  state: string;
  state_id: number;
  session_id: number;
  title: string;
  last_action: string;
  last_action_date: string;
  relevance: number;
  change_hash: string;
  url: string;
}

interface LegiScanSearchResponse {
  status: string;
  searchresult: {
    summary: {
      page: number;
      range: string;
      relevancy: string;
      count: number;
    };
    [key: string]: LegiScanSearchResult | { page: number; range: string; relevancy: string; count: number };
  };
}

function inferStatus(lastAction: string): BillStatus {
  const a = lastAction.toLowerCase();
  if (a.includes("chaptered") || a.includes("signed by governor") || a.includes("signed by president")) return "signed";
  if (a.includes("enacted") || a.includes("became law")) return "enacted";
  if (a.includes("vetoed") || a.includes("veto")) return "vetoed";
  if (a.includes("failed") || a.includes("defeated") || a.includes("died")) return "failed";
  if (a.includes("passed") && (a.includes("senate") || a.includes("assembly") || a.includes("house"))) return "passed_chamber";
  if (a.includes("committee")) return "in_committee";
  return "introduced";
}

function inferStatusLabel(status: BillStatus): string {
  const labels: Record<BillStatus, string> = {
    introduced: "Introduced",
    in_committee: "In Committee",
    passed_chamber: "Passed One Chamber",
    passed_both: "Passed Both Chambers",
    signed: "Signed into Law",
    enacted: "Enacted",
    failed: "Failed / Died",
    vetoed: "Vetoed",
    proposed: "Proposed",
  };
  return labels[status];
}

function inferTopics(title: string, action: string): BillTopic[] {
  const combined = (title + " " + action).toLowerCase();
  const topics: BillTopic[] = [];
  if (combined.includes("wildfire") || combined.includes("fire")) topics.push("wildfire_recovery");
  if (combined.includes("insurance")) topics.push("insurance");
  if (combined.includes("fema") || combined.includes("disaster") || combined.includes("emergency")) topics.push("fema");
  if (combined.includes("housing") || combined.includes("rebuild") || combined.includes("home") || combined.includes("mortgage") || combined.includes("forbearance")) topics.push("housing");
  if (combined.includes("debris") || combined.includes("cleanup") || combined.includes("toxic") || combined.includes("contamina") || combined.includes("hazardous")) topics.push("debris_removal");
  if (combined.includes("utility") || combined.includes("electric") || combined.includes("pge")) topics.push("utilities");
  if (combined.includes("tax") || combined.includes("relief")) topics.push("disaster_relief");
  if (combined.includes("forest") || combined.includes("fuel") || combined.includes("vegetation")) topics.push("environment");
  if (combined.includes("safe") || combined.includes("health") || combined.includes("public safety")) topics.push("public_safety");
  if (topics.length === 0) topics.push("disaster_relief");
  return topics;
}

// Score how relevant a bill is to the Altadena/Eaton Fire recovery (1–10)
function scoreAltadenaRelevance(bill: LegiScanSearchResult): number {
  const text = (bill.title + " " + bill.last_action).toLowerCase();
  let score = 3; // base for anything that passed our search queries

  // Highest specificity: named locations or the specific disaster
  if (text.includes("altadena")) score += 6;
  if (text.includes("eaton")) score += 5;
  if (text.includes("palisades")) score += 3;
  if (text.includes("los angeles") || text.includes("l.a.")) score += 2;

  // Disaster-specific topic signals
  if (text.includes("wildfire") || text.includes("wild fire")) score += 2;
  if (text.includes("debris") || text.includes("cleanup")) score += 2;
  if (text.includes("toxic") || text.includes("contamina") || text.includes("hazardous")) score += 2;
  if (text.includes("mortgage") || text.includes("forbearance")) score += 2;
  if (text.includes("rebuild") || text.includes("reconstruction") || text.includes("permit")) score += 2;
  if (text.includes("fair plan") || text.includes("insur")) score += 1;
  if (text.includes("fema") || text.includes("disaster relief") || text.includes("disaster recovery")) score += 1;
  if (text.includes("housing") || text.includes("home")) score += 1;

  return Math.min(10, score);
}

function inferSource(state: string): BillSource {
  if (state === "CA") return "california";
  if (state === "US") return "federal";
  return "federal";
}

function inferBody(state: string, billNumber: string): string {
  if (state === "US") {
    if (billNumber.toUpperCase().startsWith("S")) return "U.S. Senate";
    return "U.S. House of Representatives";
  }
  if (state === "CA") {
    if (billNumber.toUpperCase().startsWith("SB") || billNumber.toUpperCase().startsWith("SBX")) return "California Senate";
    return "California Assembly";
  }
  return `${state} Legislature`;
}

function legiscanBillToBill(bill: LegiScanSearchResult): Bill {
  const status = inferStatus(bill.last_action);
  const source = inferSource(bill.state);
  return {
    id: `legiscan-${bill.bill_id}`,
    billNumber: bill.bill_number,
    title: bill.title,
    description: bill.title,
    source,
    status,
    statusLabel: inferStatusLabel(status),
    statusDate: bill.last_action_date,
    introducedDate: bill.last_action_date,
    body: inferBody(bill.state, bill.bill_number),
    sponsors: [],
    topics: inferTopics(bill.title, bill.last_action),
    url: bill.url,
    lastAction: bill.last_action,
    isLive: true,
    relevanceScore: scoreAltadenaRelevance(bill),
  };
}

// Pinned: specific bill numbers we know are relevant, searched directly.
// These ensure named bills always surface even if general queries miss them.
const PINNED_CA_BILLS = [
  // Assembly bills
  "AB 1642", // DTSC wildfire contamination standards
  "AB 238",  // Eaton/Palisades mortgage forbearance
  // Fire Safe California Senate package
  "SB 581",  // CAL FIRE seasonal-to-permanent
  "SB 36",   // Price gouging enforcement
  "SB 610",  // Mortgage forbearance + tenant + mobilehome protections
  "SB 663",  // Property tax relief
  "SB 625",  // Speed-up residential rebuilds
  "SB 616",  // Insurance community hardening commission
  "SB 547",  // Commercial insurance moratorium
  "SB 676",  // CEQA streamlining for disaster rebuilds
  "SB 582",  // Rebuilding licensed facilities
  "SB 571",  // Penalties for looting and impersonation
  "SB 629",  // Fire hazard zone designation
  "SB 326",  // Wildfire mitigation strategic planning
  "SB 641",  // Consumer protection and debris removal
];

const LEGISCAN_QUERIES: Array<{ query: string; state: string }> = [
  // Pinned specific bills
  ...PINNED_CA_BILLS.map((bill) => ({ query: bill, state: "CA" })),
  // General topic queries — CA
  { query: "Eaton fire Altadena", state: "CA" },
  { query: "wildfire disaster recovery 2025", state: "CA" },
  { query: "FAIR Plan insurance wildfire", state: "CA" },
  { query: "debris removal fire disaster", state: "CA" },
  { query: "wildfire mortgage forbearance", state: "CA" },
  { query: "wildfire contamination toxic", state: "CA" },
  { query: "fire rebuild permit reconstruction", state: "CA" },
  // General topic queries — federal
  { query: "wildfire California disaster 2025", state: "US" },
  { query: "FEMA disaster California", state: "US" },
  { query: "wildfire insurance homeowner", state: "US" },
];

export async function fetchLegiScanBills(apiKey: string): Promise<Bill[]> {
  const allBills: Bill[] = [];
  const seen = new Set<number>();

  for (const { query, state } of LEGISCAN_QUERIES) {
    try {
      const url = new URL(BASE_URL);
      url.searchParams.set("key", apiKey);
      url.searchParams.set("op", "search");
      url.searchParams.set("query", query);
      url.searchParams.set("state", state);
      url.searchParams.set("year", "2"); // Current session only

      const res = await fetch(url.toString(), {
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;

      const data: LegiScanSearchResponse = await res.json();
      if (data.status !== "OK" || !data.searchresult) continue;

      // Results are numbered 0..N in the searchresult object
      for (const [key, value] of Object.entries(data.searchresult)) {
        if (key === "summary") continue;
        const bill = value as LegiScanSearchResult;
        if (bill.bill_id && !seen.has(bill.bill_id)) {
          seen.add(bill.bill_id);
          allBills.push(legiscanBillToBill(bill));
        }
      }
    } catch {
      // Skip failed queries silently
    }
  }

  return allBills;
}
