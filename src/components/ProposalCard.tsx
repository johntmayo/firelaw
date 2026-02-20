"use client";

import { PolicyProposal, ProposalSource, ProposalStatus } from "@/lib/types";
import TopicTag from "./TopicTag";
import { useState } from "react";

interface Props {
  proposal: PolicyProposal;
}

const SOURCE_LABELS: Record<ProposalSource, string> = {
  think_tank: "Think Tank",
  politician: "Politician",
  citizen_movement: "Community",
  government_agency: "Gov. Agency",
  advocacy_group: "Advocacy Group",
  academic: "Academic",
};

const SOURCE_COLORS: Record<ProposalSource, string> = {
  think_tank: "text-violet-700 bg-violet-50 border-violet-200",
  politician: "text-blue-700 bg-blue-50 border-blue-200",
  citizen_movement: "text-emerald-700 bg-emerald-50 border-emerald-200",
  government_agency: "text-slate-700 bg-slate-50 border-slate-200",
  advocacy_group: "text-rose-700 bg-rose-50 border-rose-200",
  academic: "text-indigo-700 bg-indigo-50 border-indigo-200",
};

const STATUS_COLORS: Record<ProposalStatus, string> = {
  circulating: "text-gray-600 bg-gray-50 border-gray-200",
  gaining_support: "text-blue-700 bg-blue-50 border-blue-200",
  under_review: "text-amber-700 bg-amber-50 border-amber-200",
  incorporated: "text-green-700 bg-green-50 border-green-200",
  stalled: "text-red-600 bg-red-50 border-red-200",
};

const STATUS_DOTS: Record<ProposalStatus, string> = {
  circulating: "bg-gray-400",
  gaining_support: "bg-blue-500",
  under_review: "bg-amber-500",
  incorporated: "bg-green-500",
  stalled: "bg-red-400",
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
          ? "border-violet-200 ring-1 ring-violet-100"
          : "border-gray-200"
      }`}
    >
      {proposal.isHighlighted && (
        <div className="h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400" />
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
        <h3 className="text-base font-semibold text-gray-900 mb-1.5 leading-snug">
          {proposal.title}
        </h3>

        {/* Proposed by */}
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-medium text-gray-600">
            {proposal.proposedBy.name}
          </span>
          {" · "}
          {proposal.proposedBy.organization}
          {" · "}
          {formatDate(proposal.proposedDate)}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {expanded
            ? proposal.description
            : `${proposal.description.slice(0, 200)}${
                proposal.description.length > 200 ? "…" : ""
              }`}
        </p>

        {/* Summary (expanded) */}
        {expanded && proposal.summary && (
          <div className="bg-violet-50 border border-violet-100 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-violet-800 mb-1">
              Why It Matters for Altadena
            </p>
            <p className="text-sm text-violet-900 leading-relaxed">
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
          <div className="text-xs text-gray-500 mb-3">
            <span className="font-medium text-gray-600">Related legislation: </span>
            {proposal.relatedBills.join(", ")}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            {expanded ? "Show less" : "Show more"}
          </button>

          {proposal.url ? (
            <a
              href={proposal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
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
            <span className="text-xs text-gray-300">No public link</span>
          )}
        </div>
      </div>
    </article>
  );
}
