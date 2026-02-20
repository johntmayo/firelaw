"use client";

import { useState, useMemo } from "react";
import { Bill, FilterState, SortOrder, BillStatus } from "@/lib/types";
import Header from "@/components/Header";
import BillCard from "@/components/BillCard";
import FilterBar from "@/components/FilterBar";
import StatsBar from "@/components/StatsBar";
import ApiKeyNotice from "@/components/ApiKeyNotice";

interface Props {
  initialBills: Bill[];
  hasLiveData: boolean;
  apiKeysConfigured: {
    congress: boolean;
    legiscan?: boolean;
    openStates: boolean;
  };
  lastUpdated: string;
}

const STATUS_ORDER: Record<BillStatus, number> = {
  signed: 0,
  enacted: 0,
  passed_both: 1,
  passed_chamber: 2,
  in_committee: 3,
  introduced: 4,
  proposed: 5,
  failed: 6,
  vetoed: 7,
};

export default function BillsClient({
  initialBills,
  hasLiveData,
  apiKeysConfigured,
  lastUpdated,
}: Props) {
  const [filters, setFilters] = useState<FilterState>({
    source: "all",
    status: "all",
    topic: "all",
    search: "",
  });
  const [sort, setSort] = useState<SortOrder>("relevance");
  const [highlightedOnly, setHighlightedOnly] = useState(false);

  const filteredBills = useMemo(() => {
    let bills = [...initialBills];

    if (highlightedOnly) {
      bills = bills.filter((b) => b.isHighlighted);
    }

    if (filters.source !== "all") {
      bills = bills.filter((b) => b.source === filters.source);
    }

    if (filters.status !== "all") {
      // Group "signed" and "enacted" together
      if (filters.status === "signed") {
        bills = bills.filter(
          (b) => b.status === "signed" || b.status === "enacted"
        );
      } else {
        bills = bills.filter((b) => b.status === filters.status);
      }
    }

    if (filters.topic !== "all") {
      bills = bills.filter((b) => b.topics.includes(filters.topic as never));
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      bills = bills.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.billNumber.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          (b.summary ?? "").toLowerCase().includes(q) ||
          b.sponsors.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    // Sort
    bills.sort((a, b) => {
      if (sort === "relevance") {
        if ((b.relevanceScore ?? 0) !== (a.relevanceScore ?? 0)) {
          return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
        }
        return new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime();
      }
      if (sort === "date_desc") {
        return new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime();
      }
      if (sort === "date_asc") {
        return new Date(a.statusDate).getTime() - new Date(b.statusDate).getTime();
      }
      if (sort === "status") {
        return (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
      }
      return 0;
    });

    return bills;
  }, [initialBills, filters, sort, highlightedOnly]);

  const highlightedCount = initialBills.filter((b) => b.isHighlighted).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
          <span className="text-amber-500 text-sm mt-0.5">⚠</span>
          <span>
            <strong>Important:</strong> Legislation moves quickly. Bill numbers,
            statuses, and summaries shown here reflect information available at
            the time of curation. Always verify current status at{" "}
            <a
              href="https://leginfo.legislature.ca.gov"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              leginfo.legislature.ca.gov
            </a>{" "}
            or{" "}
            <a
              href="https://www.congress.gov"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              congress.gov
            </a>
            . This is not legal advice.
          </span>
        </div>

        {/* API key notice */}
        <ApiKeyNotice
          congressConfigured={apiKeysConfigured.congress}
          openStatesConfigured={apiKeysConfigured.openStates}
          legiscanConfigured={apiKeysConfigured.legiscan}
        />

        {/* Stats bar */}
        <StatsBar
          bills={initialBills}
          hasLiveData={hasLiveData}
          lastUpdated={lastUpdated}
        />

        {/* Highlighted filter toggle */}
        {highlightedCount > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHighlightedOnly(!highlightedOnly)}
              className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                highlightedOnly
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-orange-700 border-orange-200 hover:bg-orange-50"
              }`}
            >
              <span>Most Relevant to Altadena</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  highlightedOnly
                    ? "bg-orange-400 text-white"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {highlightedCount}
              </span>
            </button>
            {highlightedOnly && (
              <span className="text-xs text-gray-500">
                Showing bills with direct impact on Altadena / Eaton Fire
                recovery
              </span>
            )}
          </div>
        )}

        {/* Filter bar */}
        <FilterBar
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          totalCount={initialBills.length}
          filteredCount={filteredBills.length}
        />

        {/* Bills grid */}
        {filteredBills.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg font-medium text-gray-500">
              No bills match your filters
            </p>
            <p className="text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="pt-8 pb-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 mb-2">
            Built to help Altadena residents track wildfire recovery legislation.
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <a
              href="https://leginfo.legislature.ca.gov"
              className="hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              California Legislature
            </a>
            <span>·</span>
            <a
              href="https://www.congress.gov"
              className="hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Congress.gov
            </a>
            <span>·</span>
            <a
              href="https://openstates.org"
              className="hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStates
            </a>
            <span>·</span>
            <a
              href="https://www.insurance.ca.gov"
              className="hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              CA Insurance Dept
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
