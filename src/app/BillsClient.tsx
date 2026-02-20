"use client";

import { useState, useMemo } from "react";
import { Bill, FilterState, SortOrder, BillStatus, PolicyProposal, BillTopic, ProposalSource } from "@/lib/types";
import Header from "@/components/Header";
import BillCard from "@/components/BillCard";
import FilterBar from "@/components/FilterBar";
import StatsBar from "@/components/StatsBar";
import ApiKeyNotice from "@/components/ApiKeyNotice";
import ProposalCard from "@/components/ProposalCard";

type ActiveTab = "legislation" | "proposals";

interface Props {
  initialBills: Bill[];
  initialProposals: PolicyProposal[];
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
  initialProposals,
  hasLiveData,
  apiKeysConfigured,
  lastUpdated,
}: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("legislation");
  const [filters, setFilters] = useState<FilterState>({
    source: "all",
    status: "all",
    topic: "all",
    search: "",
  });
  const [sort, setSort] = useState<SortOrder>("relevance");
  const [highlightedOnly, setHighlightedOnly] = useState(false);

  // Proposal-specific filter state
  const [proposalSearch, setProposalSearch] = useState("");
  const [proposalTopic, setProposalTopic] = useState<BillTopic | "all">("all");
  const [proposalSourceType, setProposalSourceType] = useState<ProposalSource | "all">("all");

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

  const filteredProposals = useMemo(() => {
    let proposals = [...initialProposals];
    if (proposalSourceType !== "all") {
      proposals = proposals.filter((p) => p.proposedBy.type === proposalSourceType);
    }
    if (proposalTopic !== "all") {
      proposals = proposals.filter((p) => p.topics.includes(proposalTopic));
    }
    if (proposalSearch.trim()) {
      const q = proposalSearch.toLowerCase();
      proposals = proposals.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.summary ?? "").toLowerCase().includes(q) ||
          p.proposedBy.name.toLowerCase().includes(q) ||
          p.proposedBy.organization.toLowerCase().includes(q)
      );
    }
    proposals.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
    return proposals;
  }, [initialProposals, proposalSearch, proposalTopic, proposalSourceType]);

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

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("legislation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "legislation"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Legislation
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "legislation"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {initialBills.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "proposals"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Policy Proposals
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "proposals"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {initialProposals.length}
            </span>
          </button>
        </div>

        {activeTab === "legislation" && (
          <>
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
          </>
        )}

        {activeTab === "proposals" && (
          <>
            {/* Proposals intro */}
            <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-xs text-violet-800 flex items-start gap-2">
              <span className="text-violet-500 text-sm mt-0.5">💡</span>
              <span>
                <strong>Policy proposals</strong> are ideas from think tanks,
                politicians, community groups, and advocacy organizations that
                haven&apos;t yet been introduced as formal legislation. They
                represent the pipeline of ideas shaping wildfire recovery policy.
              </span>
            </div>

            {/* Proposals filter bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Search proposals…"
                value={proposalSearch}
                onChange={(e) => setProposalSearch(e.target.value)}
                className="flex-1 min-w-[180px] text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
              <select
                value={proposalSourceType}
                onChange={(e) =>
                  setProposalSourceType(e.target.value as ProposalSource | "all")
                }
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
              >
                <option value="all">All Sources</option>
                <option value="think_tank">Think Tanks</option>
                <option value="politician">Politicians</option>
                <option value="citizen_movement">Community Groups</option>
                <option value="government_agency">Gov. Agencies</option>
                <option value="advocacy_group">Advocacy Groups</option>
                <option value="academic">Academic</option>
              </select>
              <select
                value={proposalTopic}
                onChange={(e) =>
                  setProposalTopic(e.target.value as BillTopic | "all")
                }
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
              >
                <option value="all">All Topics</option>
                <option value="insurance">Insurance</option>
                <option value="wildfire_recovery">Wildfire Recovery</option>
                <option value="rebuilding">Rebuilding</option>
                <option value="housing">Housing</option>
                <option value="fema">FEMA</option>
                <option value="disaster_relief">Disaster Relief</option>
                <option value="utilities">Utilities</option>
                <option value="environment">Environment</option>
                <option value="public_safety">Public Safety</option>
                <option value="debris_removal">Debris Removal</option>
                <option value="evacuation">Evacuation</option>
              </select>
              <span className="text-xs text-gray-400">
                {filteredProposals.length} of {initialProposals.length}
              </span>
              {(proposalSearch || proposalTopic !== "all" || proposalSourceType !== "all") && (
                <button
                  onClick={() => {
                    setProposalSearch("");
                    setProposalTopic("all");
                    setProposalSourceType("all");
                  }}
                  className="text-xs text-violet-600 hover:text-violet-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Proposals grid */}
            {filteredProposals.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-lg font-medium text-gray-500">
                  No proposals match your filters
                </p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredProposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            )}
          </>
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
