"use client";

import { Bill } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import TopicTag from "./TopicTag";
import { useState } from "react";

interface Props {
  bill: Bill;
}

const SOURCE_LABELS: Record<Bill["source"], string> = {
  federal: "Federal",
  california: "California",
  la_county: "LA County",
};

const SOURCE_COLORS: Record<Bill["source"], string> = {
  federal: "text-blue-600 bg-blue-50 border-blue-100",
  california: "text-amber-700 bg-amber-50 border-amber-100",
  la_county: "text-purple-600 bg-purple-50 border-purple-100",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function BillCard({ bill }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${
        bill.isHighlighted ? "border-orange-200 ring-1 ring-orange-100" : "border-gray-200"
      }`}
    >
      {bill.isHighlighted && (
        <div className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-rose-400" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                SOURCE_COLORS[bill.source]
              }`}
            >
              {SOURCE_LABELS[bill.source]}
            </span>
            <span className="text-sm font-mono font-semibold text-gray-600">
              {bill.billNumber}
            </span>
            {bill.isLive && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <StatusBadge status={bill.status} label={bill.statusLabel} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
          {bill.title}
        </h3>

        {/* Body / legislative chamber */}
        <p className="text-xs text-gray-500 mb-3">{bill.body}</p>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {expanded ? bill.description : `${bill.description.slice(0, 180)}${bill.description.length > 180 ? "…" : ""}`}
        </p>

        {/* Summary (expanded) */}
        {expanded && bill.summary && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-amber-800 mb-1">Why It Matters for Altadena</p>
            <p className="text-sm text-amber-900 leading-relaxed">{bill.summary}</p>
          </div>
        )}

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bill.topics.map((topic) => (
            <TopicTag key={topic} topic={topic} />
          ))}
        </div>

        {/* Sponsors */}
        {bill.sponsors.length > 0 && (
          <div className="text-xs text-gray-500 mb-3">
            <span className="font-medium text-gray-600">Sponsors: </span>
            {bill.sponsors
              .map((s) => `${s.name}${s.party ? ` (${s.party})` : ""}`)
              .join(", ")}
          </div>
        )}

        {/* Last action */}
        {bill.lastAction && (
          <div className="text-xs text-gray-500 mb-4">
            <span className="font-medium text-gray-600">Last Action: </span>
            {bill.lastAction}
            {bill.statusDate && (
              <span className="text-gray-400 ml-1">
                — {formatDate(bill.statusDate)}
              </span>
            )}
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

          <a
            href={bill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View full text
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
        </div>
      </div>
    </article>
  );
}
