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
