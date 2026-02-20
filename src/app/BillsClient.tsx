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
    <div className="min-h-screen bg-[#FFFDF5]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="bg-[#F5F0E8] border border-[#DDD6C8] rounded-xl px-4 py-3 text-xs text-[#4A3F35] flex items-start gap-2">
          <span className="text-[#9B9488] text-sm mt-0.5">⚠</span>
          <span>
            <strong>Important:</strong> Legislation moves quickly. Bill numbers,
            statuses, and summaries shown here reflect information available at
            the time of curation. Always verify current status at{" "}
            <a
              href="https://leginfo.legislature.ca.gov"
              className="underline text-[#BC5839]"
              target="_blank"
              rel="noopener noreferrer"
            >
              leginfo.legislature.ca.gov
            </a>{" "}
            or{" "}
            <a
              href="https://www.congress.gov"
              className="underline text-[#BC5839]"
              target="_blank"
              rel="noopener noreferrer"
            >
              congress.gov
            </a>
            . This is not legal advice.
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[#EAE5DC] p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("legislation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "legislation"
                ? "bg-white text-[#304059] shadow-sm"
                : "text-[#6B6055] hover:text-[#304059]"
            }`}
          >
            Legislation
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "legislation"
                  ? "bg-[#304059] text-white"
                  : "bg-[#D4CFC7] text-[#6B6055]"
              }`}
            >
              {initialBills.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "proposals"
                ? "bg-white text-[#304059] shadow-sm"
                : "text-[#6B6055] hover:text-[#304059]"
            }`}
          >
            Policy Proposals
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "proposals"
                  ? "bg-[#304059] text-white"
                  : "bg-[#D4CFC7] text-[#6B6055]"
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
                  className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all ${
                    highlightedOnly
                      ? "bg-[#FDBA77] text-[#304059] border-[#FDBA77] shadow-sm"
                      : "bg-white text-[#304059] border-[#C8C0B4] hover:bg-[#F2EDE4]"
                  }`}
                >
                  <span>Most Relevant to Altadena</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      highlightedOnly
                        ? "bg-[#304059]/15 text-[#304059]"
                        : "bg-[#EAE5DC] text-[#6B6055]"
                    }`}
                  >
                    {highlightedCount}
                  </span>
                </button>
                {highlightedOnly && (
                  <span className="text-xs text-[#9B9488]">
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
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-lg font-medium text-[#6B6055]">
                  No bills match your filters
                </p>
                <p className="text-sm mt-1 text-[#9B9488]">
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
            <div className="bg-[#F5F0E8] border border-[#DDD6C8] rounded-xl px-4 py-3 text-xs text-[#4A3F35] flex items-start gap-2">
              <span className="text-[#9B9488] text-sm mt-0.5">💡</span>
              <span>
                <strong>Policy proposals</strong> are ideas from think tanks,
                politicians, community groups, and advocacy organizations that
                haven&apos;t yet been introduced as formal legislation. They
                represent the pipeline of ideas shaping wildfire recovery policy.
              </span>
            </div>

            {/* Proposals filter bar */}
            <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Search proposals…"
                value={proposalSearch}
                onChange={(e) => setProposalSearch(e.target.value)}
                className="flex-1 min-w-[180px] text-sm border border-[#E8E2D8] rounded-lg px-3 py-2 text-[#304059] placeholder-[#B8B0A8] focus:outline-none focus:ring-2 focus:ring-[#BC5839]/20 focus:border-[#BC5839]"
              />
              <select
                value={proposalSourceType}
                onChange={(e) =>
                  setProposalSourceType(e.target.value as ProposalSource | "all")
                }
                className="text-sm border border-[#E8E2D8] rounded-lg px-3 py-2 bg-white text-[#304059] focus:outline-none focus:ring-2 focus:ring-[#BC5839]/20 focus:border-[#BC5839]"
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
                className="text-sm border border-[#E8E2D8] rounded-lg px-3 py-2 bg-white text-[#304059] focus:outline-none focus:ring-2 focus:ring-[#BC5839]/20 focus:border-[#BC5839]"
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
              <span className="text-xs text-[#9B9488]">
                {filteredProposals.length} of {initialProposals.length}
              </span>
              {(proposalSearch || proposalTopic !== "all" || proposalSourceType !== "all") && (
                <button
                  onClick={() => {
                    setProposalSearch("");
                    setProposalTopic("all");
                    setProposalSourceType("all");
                  }}
                  className="text-xs text-[#BC5839] hover:text-[#9B3A22] font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Proposals grid */}
            {filteredProposals.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-lg font-medium text-[#6B6055]">
                  No proposals match your filters
                </p>
                <p className="text-sm mt-1 text-[#9B9488]">
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
        <footer className="pt-8 pb-4 border-t border-[#E8E2D8] text-center">
          <p className="text-xs text-[#9B9488] mb-2">
            Built to help Altadena residents track wildfire recovery legislation.
          </p>
          <div className="flex justify-center gap-4 text-xs text-[#9B9488]">
            <a
              href="https://leginfo.legislature.ca.gov"
              className="hover:text-[#4A3F35] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              California Legislature
            </a>
            <span>·</span>
            <a
              href="https://www.congress.gov"
              className="hover:text-[#4A3F35] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Congress.gov
            </a>
            <span>·</span>
            <a
              href="https://openstates.org"
              className="hover:text-[#4A3F35] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenStates
            </a>
            <span>·</span>
            <a
              href="https://www.insurance.ca.gov"
              className="hover:text-[#4A3F35] transition-colors"
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
