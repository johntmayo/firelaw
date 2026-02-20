"use client";

import { PolicyProposal, ProposalSource, ProposalStatus } from "@/lib/types";
import TopicTag from "./TopicTag";
import { useState } from "react";

interface Props {
  proposal: PolicyProposal;
}

const SOURCE_LABELS: Record<ProposalSource, string> = {
  think_tank:       "Think Tank",
  politician:       "Politician",
  citizen_movement: "Community",
  government_agency:"Gov. Agency",
  advocacy_group:   "Advocacy Group",
  academic:         "Academic",
};

const SOURCE_COLORS: Record<ProposalSource, string> = {
  think_tank:       "text-[#2E6B72] bg-[#EBF4F5] border-[#B8D8DC]",
  politician:       "text-[#304059] bg-[#E8EDF3] border-[#C0CCD9]",
  citizen_movement: "text-[#4A6630] bg-[#EEF3E8] border-[#C0D4A6]",
  government_agency:"text-[#5C4E3A] bg-[#F2EDE4] border-[#DDD6C8]",
  advocacy_group:   "text-[#7A3040] bg-[#F5ECEE] border-[#DFC5CB]",
  academic:         "text-[#2E4A72] bg-[#E8EEF5] border-[#B8C8DC]",
};

const STATUS_COLORS: Record<ProposalStatus, string> = {
  circulating:     "text-[#6B6055] bg-[#EAE6E0] border-[#D4CFC7]",
  gaining_support: "text-[#2E6B72] bg-[#D8EFF1] border-[#B3D8DC]",
  under_review:    "text-[#7A5020] bg-[#F6E8D0] border-[#E8CA9E]",
  incorporated:    "text-[#4A6630] bg-[#E3EDD9] border-[#C0D4A6]",
  stalled:         "text-[#7A2838] bg-[#F0D8DB] border-[#DEB8BE]",
};

const STATUS_DOTS: Record<ProposalStatus, string> = {
  circulating:     "bg-[#C8C0B4]",
  gaining_support: "bg-[#81BDC3]",
  under_review:    "bg-[#E8A84A]",
  incorporated:    "bg-[#AFC892]",
  stalled:         "bg-[#BC455A]",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function ProposalCard({ proposal }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${
        proposal.isHighlighted
          ? "border-[#BC5839]"
          : "border-[#E8E2D8]"
      }`}
    >
      {proposal.isHighlighted && (
        <div className="h-1 bg-[#BC5839]" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                SOURCE_COLORS[proposal.proposedBy.type]
              }`}
            >
              {SOURCE_LABELS[proposal.proposedBy.type]}
            </span>
          </div>
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${
              STATUS_COLORS[proposal.status]
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOTS[proposal.status]}`}
            />
            {proposal.statusLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[#304059] mb-1.5 leading-snug">
          {proposal.title}
        </h3>

        {/* Proposed by */}
        <p className="text-xs text-[#9B9488] mb-3">
          <span className="font-medium text-[#6B6055]">
            {proposal.proposedBy.name}
          </span>
          {" · "}
          {proposal.proposedBy.organization}
          {" · "}
          {formatDate(proposal.proposedDate)}
        </p>

        {/* Description */}
        <p className="text-sm text-[#4A3F35] leading-relaxed mb-3">
          {expanded
            ? proposal.description
            : `${proposal.description.slice(0, 200)}${
                proposal.description.length > 200 ? "…" : ""
              }`}
        </p>

        {/* Summary (expanded) */}
        {expanded && proposal.summary && (
          <div className="bg-[#F8F5EF] border border-[#E8E2D8] rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-[#304059] mb-1">
              Why It Matters for Altadena
            </p>
            <p className="text-sm text-[#4A3F35] leading-relaxed">
              {proposal.summary}
            </p>
          </div>
        )}

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {proposal.topics.map((topic) => (
            <TopicTag key={topic} topic={topic} />
          ))}
        </div>

        {/* Related bills (expanded) */}
        {expanded && proposal.relatedBills && proposal.relatedBills.length > 0 && (
          <div className="text-xs text-[#9B9488] mb-3">
            <span className="font-medium text-[#6B6055]">Related legislation: </span>
            {proposal.relatedBills.join(", ")}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F2EDE4]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#BC5839] hover:text-[#9B3A22] font-medium transition-colors"
          >
            {expanded ? "Show less" : "Show more"}
          </button>

          {proposal.url ? (
            <a
              href={proposal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FDBA77] text-[#304059] px-3 py-1.5 rounded-lg hover:bg-[#FCA84A] transition-colors"
            >
              View source
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : (
            <span className="text-xs text-[#C8C0B4]">No public link</span>
          )}
        </div>
      </div>
    </article>
  );
}
