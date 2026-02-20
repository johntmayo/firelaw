// OpenStates API integration for California state legislation
// Free API key available at: https://openstates.org/accounts/profile/
// Set OPENSTATES_API_KEY in .env.local

import { Bill, BillSource, BillStatus, BillTopic } from "./types";

const BASE_URL = "https://v3.openstates.org";

interface OpenStatesBill {
  id: string;
  identifier: string;
  title: string;
  openstates_url: string;
  created_at: string;
  updated_at: string;
  first_action_date: string;
  latest_action_date: string;
  latest_action_description: string;
  latest_passage_date: string | null;
  classification: string[];
  subject: string[];
  extras: Record<string, unknown>;
  sponsorships?: Array<{
    name: string;
    entity_type: string;
    primary: boolean;
    party?: string;
  }>;
  current_chamber: string;
  current_chamber_action: string;
}

interface OpenStatesResponse {
  results: OpenStatesBill[];
  pagination: {
    max_page: number;
    page: number;
    per_page: number;
    total_items: number;
  };
}

function inferStatusFromAction(action: string): BillStatus {
  const a = action.toLowerCase();
  if (a.includes("chaptered") || a.includes("signed") || a.includes("enacted")) return "signed";
  if (a.includes("vetoed") || a.includes("failed") || a.includes("died")) return "failed";
  if (a.includes("passed") && (a.includes("senate") || a.includes("assembly"))) {
    return "passed_chamber";
  }
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
    failed: "Failed / Died",
    vetoed: "Vetoed",
    proposed: "Proposed",
    enacted: "Enacted",
  };
  return labels[status];
}

function inferTopicsFromSubjects(
  subjects: string[],
  title: string
): BillTopic[] {
  const combined = [...subjects, title].join(" ").toLowerCase();
  const topics: BillTopic[] = [];

  if (combined.includes("wildfire") || combined.includes("fire")) topics.push("wildfire_recovery");
  if (combined.includes("insurance")) topics.push("insurance");
  if (combined.includes("fema") || combined.includes("disaster") || combined.includes("emergency")) topics.push("fema");
  if (combined.includes("housing") || combined.includes("home") || combined.includes("rebuild")) topics.push("housing");
  if (combined.includes("debris") || combined.includes("cleanup")) topics.push("debris_removal");
  if (combined.includes("utility") || combined.includes("power") || combined.includes("pge")) topics.push("utilities");
  if (combined.includes("tax") || combined.includes("relief")) topics.push("disaster_relief");
  if (combined.includes("forest") || combined.includes("fuel") || combined.includes("vegetation")) topics.push("environment");

  if (topics.length === 0) topics.push("wildfire_recovery");
  return topics;
}

function inferBody(bill: OpenStatesBill): string {
  const id = bill.identifier.toUpperCase();
  if (id.startsWith("AB") || id.startsWith("ABX")) return "California Assembly";
  if (id.startsWith("SB") || id.startsWith("SBX")) return "California Senate";
  return "California Legislature";
}

function openStatesBillToBill(bill: OpenStatesBill): Bill {
  const status = inferStatusFromAction(bill.latest_action_description ?? "");
  const primarySponsors = (bill.sponsorships ?? [])
    .filter((s) => s.primary)
    .map((s) => ({
      name: s.name,
      party: s.party,
      state: "CA",
    }));

  return {
    id: `openstates-${bill.id}`,
    billNumber: bill.identifier,
    title: bill.title,
    description: bill.title,
    source: "california" as BillSource,
    status,
    statusLabel: inferStatusLabel(status),
    statusDate: bill.latest_action_date,
    introducedDate: bill.first_action_date ?? bill.created_at,
    body: inferBody(bill),
    sponsors: primarySponsors,
    topics: inferTopicsFromSubjects(bill.subject ?? [], bill.title),
    url: bill.openstates_url,
    lastAction: bill.latest_action_description,
    isLive: true,
    relevanceScore: 5,
  };
}

const CA_WILDFIRE_QUERIES = [
  "wildfire",
  "Eaton fire",
  "disaster recovery",
  "FAIR Plan insurance",
  "debris removal fire",
];

export async function fetchCaliforniaBills(apiKey: string): Promise<Bill[]> {
  const allBills: Bill[] = [];
  const seen = new Set<string>();

  for (const query of CA_WILDFIRE_QUERIES) {
    try {
      const url = new URL(`${BASE_URL}/bills`);
      url.searchParams.set("jurisdiction", "ca");
      url.searchParams.set("q", query);
      url.searchParams.set("sort", "-updated_at");
      url.searchParams.set("per_page", "10");
      url.searchParams.set("include", "sponsorships");

      const res = await fetch(url.toString(), {
        headers: { "X-API-KEY": apiKey },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;

      const data: OpenStatesResponse = await res.json();
      if (!data.results) continue;

      for (const bill of data.results) {
        if (!seen.has(bill.id)) {
          seen.add(bill.id);
          allBills.push(openStatesBillToBill(bill));
        }
      }
    } catch {
      // Skip failed queries silently
    }
  }

  return allBills;
}
