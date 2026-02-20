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
  federal:    "text-[#2E6B72] bg-[#EBF4F5] border-[#B8D8DC]",
  california: "text-[#7A3040] bg-[#F5ECEE] border-[#DFC5CB]",
  la_county:  "text-[#4A6630] bg-[#EEF3E8] border-[#C0D4A6]",
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
        bill.isHighlighted ? "border-[#BC5839]" : "border-[#E8E2D8]"
      }`}
    >
      {bill.isHighlighted && (
        <div className="h-1 bg-[#BC5839]" />
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
            <span className="text-sm font-mono font-semibold text-[#6B6055]">
              {bill.billNumber}
            </span>
            {bill.isLive && (
              <span className="text-xs text-[#4A6630] font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#AFC892] animate-pulse" />
                Live
              </span>
            )}
          </div>
          <StatusBadge status={bill.status} label={bill.statusLabel} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[#304059] mb-2 leading-snug">
          {bill.title}
        </h3>

        {/* Body / legislative chamber */}
        <p className="text-xs text-[#9B9488] mb-3">{bill.body}</p>

        {/* Description */}
        <p className="text-sm text-[#4A3F35] leading-relaxed mb-3">
          {expanded ? bill.description : `${bill.description.slice(0, 180)}${bill.description.length > 180 ? "…" : ""}`}
        </p>

        {/* Summary (expanded) */}
        {expanded && bill.summary && (
          <div className="bg-[#F8F5EF] border border-[#E8E2D8] rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-[#304059] mb-1">Why It Matters for Altadena</p>
            <p className="text-sm text-[#4A3F35] leading-relaxed">{bill.summary}</p>
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
          <div className="text-xs text-[#9B9488] mb-3">
            <span className="font-medium text-[#6B6055]">Sponsors: </span>
            {bill.sponsors
              .map((s) => `${s.name}${s.party ? ` (${s.party})` : ""}`)
              .join(", ")}
          </div>
        )}

        {/* Last action */}
        {bill.lastAction && (
          <div className="text-xs text-[#9B9488] mb-4">
            <span className="font-medium text-[#6B6055]">Last Action: </span>
            {bill.lastAction}
            {bill.statusDate && (
              <span className="text-[#B8B0A8] ml-1">
                — {formatDate(bill.statusDate)}
              </span>
            )}
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

          <a
            href={bill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FDBA77] text-[#304059] px-3 py-1.5 rounded-lg hover:bg-[#FCA84A] transition-colors"
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
