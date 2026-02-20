export type BillStatus =
  | "introduced"
  | "in_committee"
  | "passed_chamber"
  | "passed_both"
  | "signed"
  | "failed"
  | "vetoed"
  | "proposed"
  | "enacted";

export type BillSource = "federal" | "california" | "la_county";

export type BillTopic =
  | "wildfire_recovery"
  | "insurance"
  | "fema"
  | "disaster_relief"
  | "rebuilding"
  | "utilities"
  | "evacuation"
  | "debris_removal"
  | "housing"
  | "environment"
  | "public_safety";

export interface Sponsor {
  name: string;
  party?: string;
  state?: string;
  district?: string;
}

export interface Bill {
  id: string;
  title: string;
  description: string;
  source: BillSource;
  status: BillStatus;
  statusLabel: string;
  statusDate: string;
  introducedDate: string;
  sponsors: Sponsor[];
  topics: BillTopic[];
  body: string;
  billNumber: string;
  url: string;
  summary?: string;
  lastAction?: string;
  isHighlighted?: boolean;
  isLive?: boolean; // fetched from external API vs curated
  relevanceScore?: number; // how relevant to Altadena/Eaton Fire
}

export interface FilterState {
  source: BillSource | "all";
  status: BillStatus | "all";
  topic: BillTopic | "all";
  search: string;
}

export type SortOrder = "date_desc" | "date_asc" | "relevance" | "status";

// --- Policy Proposals ---

export type ProposalSource =
  | "think_tank"
  | "politician"
  | "citizen_movement"
  | "government_agency"
  | "advocacy_group"
  | "academic";

export type ProposalStatus =
  | "circulating"       // published/out there, not yet gaining institutional traction
  | "gaining_support"   // attracting endorsements or legislative attention
  | "under_review"      // being formally considered by lawmakers or agencies
  | "incorporated"      // adopted into actual legislation or regulation
  | "stalled";          // not moving forward

export interface PolicyProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: {
    name: string;
    organization: string;
    type: ProposalSource;
  };
  proposedDate: string;
  topics: BillTopic[];
  status: ProposalStatus;
  statusLabel: string;
  url?: string;
  summary?: string;        // "Why it matters for Altadena"
  relatedBills?: string[]; // bill numbers, e.g. ["AB 226", "SB 505"]
  isHighlighted?: boolean;
  relevanceScore?: number; // 1–10
}
