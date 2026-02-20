// Congress.gov API integration
// Free API key available at: https://api.congress.gov/sign-up
// Set CONGRESS_API_KEY in .env.local

import { Bill, BillSource, BillStatus, BillTopic } from "./types";

const BASE_URL = "https://api.congress.gov/v3";

interface CongressBillSummary {
  congress: number;
  latestAction?: {
    actionDate: string;
    text: string;
  };
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  type: string;
  updateDate: string;
  url: string;
}

interface CongressSearchResponse {
  bills: CongressBillSummary[];
  pagination: {
    count: number;
    next?: string;
    prev?: string;
  };
}

// Map Congress.gov bill status to our status type
function inferStatus(bill: CongressBillSummary): BillStatus {
  const action = bill.latestAction?.text?.toLowerCase() ?? "";
  if (action.includes("became public law") || action.includes("signed by president")) {
    return "signed";
  }
  if (action.includes("vetoed")) return "vetoed";
  if (action.includes("passed") && action.includes("senate") && action.includes("house")) {
    return "passed_both";
  }
  if (action.includes("passed senate") || action.includes("passed house")) {
    return "passed_chamber";
  }
  if (action.includes("committee")) return "in_committee";
  return "introduced";
}

function inferStatusLabel(status: BillStatus): string {
  const labels: Record<BillStatus, string> = {
    introduced: "Introduced",
    in_committee: "In Committee",
    passed_chamber: "Passed One Chamber",
    passed_both: "Passed Both Chambers",
    signed: "Signed into Law",
    failed: "Failed",
    vetoed: "Vetoed",
    proposed: "Proposed",
    enacted: "Enacted",
  };
  return labels[status];
}

function inferTopics(title: string): BillTopic[] {
  const t = title.toLowerCase();
  const topics: BillTopic[] = [];
  if (t.includes("wildfire") || t.includes("fire")) topics.push("wildfire_recovery");
  if (t.includes("insurance")) topics.push("insurance");
  if (t.includes("fema") || t.includes("disaster") || t.includes("emergency")) topics.push("fema");
  if (t.includes("housing") || t.includes("home") || t.includes("rebuild")) topics.push("housing");
  if (t.includes("debris") || t.includes("cleanup") || t.includes("removal")) topics.push("debris_removal");
  if (t.includes("utility") || t.includes("power") || t.includes("electric")) topics.push("utilities");
  if (t.includes("tax") || t.includes("relief")) topics.push("disaster_relief");
  if (t.includes("forest") || t.includes("fuel") || t.includes("vegetation")) topics.push("environment");
  if (topics.length === 0) topics.push("disaster_relief");
  return topics;
}

function congressBillToBill(bill: CongressBillSummary): Bill {
  const billType = bill.type?.toLowerCase() ?? "hr";
  const billNumber = `${billType.toUpperCase()} ${bill.number}`;
  const status = inferStatus(bill);

  return {
    id: `congress-${bill.congress}-${bill.type}-${bill.number}`,
    billNumber,
    title: bill.title,
    description: bill.title,
    source: "federal" as BillSource,
    status,
    statusLabel: inferStatusLabel(status),
    statusDate: bill.latestAction?.actionDate ?? bill.updateDate,
    introducedDate: bill.updateDate,
    body:
      bill.originChamber === "Senate"
        ? "U.S. Senate"
        : "U.S. House of Representatives",
    sponsors: [],
    topics: inferTopics(bill.title),
    url: `https://www.congress.gov/bill/${bill.congress}th-congress/${
      bill.originChamberCode === "S" ? "senate" : "house"
    }-bill/${bill.number}`,
    lastAction: bill.latestAction?.text,
    isLive: true,
    relevanceScore: 5,
  };
}

const WILDFIRE_QUERIES = [
  "wildfire California",
  "Eaton fire California",
  "FEMA disaster California wildfire",
  "wildfire insurance California",
  "disaster recovery California",
];

export async function fetchCongressBills(apiKey: string): Promise<Bill[]> {
  const allBills: Bill[] = [];
  const seen = new Set<string>();

  for (const query of WILDFIRE_QUERIES) {
    try {
      const url = new URL(`${BASE_URL}/bill`);
      url.searchParams.set("query", query);
      url.searchParams.set("congress", "119");
      url.searchParams.set("limit", "10");
      url.searchParams.set("sort", "updateDate+desc");
      url.searchParams.set("api_key", apiKey);

      const res = await fetch(url.toString(), {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!res.ok) continue;

      const data: CongressSearchResponse = await res.json();
      if (!data.bills) continue;

      for (const bill of data.bills) {
        const id = `congress-${bill.congress}-${bill.type}-${bill.number}`;
        if (!seen.has(id)) {
          seen.add(id);
          allBills.push(congressBillToBill(bill));
        }
      }
    } catch {
      // Skip failed queries silently
    }
  }

  return allBills;
}
