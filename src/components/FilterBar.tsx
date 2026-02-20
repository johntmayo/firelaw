"use client";

import { FilterState, SortOrder, BillSource, BillStatus, BillTopic } from "@/lib/types";

interface Props {
  filters: FilterState;
  sort: SortOrder;
  onFiltersChange: (f: FilterState) => void;
  onSortChange: (s: SortOrder) => void;
  totalCount: number;
  filteredCount: number;
}

const SOURCES: { value: BillSource | "all"; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "federal", label: "Federal" },
  { value: "california", label: "California" },
  { value: "la_county", label: "LA County" },
];

const STATUSES: { value: BillStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "introduced", label: "Introduced" },
  { value: "in_committee", label: "In Committee" },
  { value: "passed_chamber", label: "Passed Chamber" },
  { value: "signed", label: "Signed / Enacted" },
  { value: "enacted", label: "Enacted" },
  { value: "failed", label: "Failed" },
];

const TOPICS: { value: BillTopic | "all"; label: string }[] = [
  { value: "all", label: "All Topics" },
  { value: "wildfire_recovery", label: "Wildfire Recovery" },
  { value: "insurance", label: "Insurance" },
  { value: "fema", label: "FEMA / Federal Aid" },
  { value: "disaster_relief", label: "Disaster Relief" },
  { value: "housing", label: "Housing / Rebuilding" },
  { value: "rebuilding", label: "Rebuilding" },
  { value: "debris_removal", label: "Debris Removal" },
  { value: "utilities", label: "Utilities" },
  { value: "environment", label: "Environment" },
  { value: "public_safety", label: "Public Safety" },
];

const SORTS: { value: SortOrder; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "status", label: "By Status" },
];

const selectClass =
  "text-sm border border-[#E8E2D8] rounded-lg px-3 py-2 bg-white text-[#304059] focus:outline-none focus:ring-2 focus:ring-[#BC5839]/20 focus:border-[#BC5839] transition-colors cursor-pointer";

export default function FilterBar({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  totalCount,
  filteredCount,
}: Props) {
  const hasActiveFilters =
    filters.source !== "all" ||
    filters.status !== "all" ||
    filters.topic !== "all" ||
    filters.search !== "";

  function resetFilters() {
    onFiltersChange({ source: "all", status: "all", topic: "all", search: "" });
  }

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-sm">
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B0A8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search bills by title, number, or keyword…"
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E8E2D8] rounded-lg bg-white text-[#304059] placeholder-[#B8B0A8] focus:outline-none focus:ring-2 focus:ring-[#BC5839]/20 focus:border-[#BC5839] transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => onFiltersChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8B0A8] hover:text-[#6B6055]"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.source}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              source: e.target.value as BillSource | "all",
            })
          }
          className={selectClass}
        >
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as BillStatus | "all",
            })
          }
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={filters.topic}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              topic: e.target.value as BillTopic | "all",
            })
          }
          className={selectClass}
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#9B9488]">Sort:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            className={selectClass}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count + reset */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2EDE4]">
        <p className="text-xs text-[#9B9488]">
          Showing{" "}
          <span className="font-semibold text-[#304059]">{filteredCount}</span>{" "}
          of{" "}
          <span className="font-semibold text-[#304059]">{totalCount}</span>{" "}
          bills
        </p>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#BC5839] hover:text-[#9B3A22] font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
