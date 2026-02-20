import { Suspense } from "react";
import BillsClient from "./BillsClient";
import { CURATED_BILLS } from "@/lib/curated-bills";

export const revalidate = 3600;

async function getBills() {
  const congressApiKey = process.env.CONGRESS_API_KEY;
  const openStatesApiKey = process.env.OPENSTATES_API_KEY;
  const legiscanApiKey = process.env.LEGISCAN_API_KEY;

  const apiKeysConfigured = {
    congress: !!congressApiKey,
    openStates: !!openStatesApiKey,
    legiscan: !!legiscanApiKey,
  };

  const liveBills = [];

  if (legiscanApiKey) {
    // LegiScan covers both CA state and federal — use it if available
    try {
      const { fetchLegiScanBills } = await import("@/lib/legiscan-api");
      const legiScanBills = await fetchLegiScanBills(legiscanApiKey);
      liveBills.push(...legiScanBills);
    } catch {
      // Silently fall back to curated data
    }
  } else {
    // Fall back to individual APIs
    if (congressApiKey) {
      try {
        const { fetchCongressBills } = await import("@/lib/congress-api");
        const federalBills = await fetchCongressBills(congressApiKey);
        liveBills.push(...federalBills);
      } catch {
        // Silently fall back to curated data
      }
    }

    if (openStatesApiKey) {
      try {
        const { fetchCaliforniaBills } = await import("@/lib/openstates-api");
        const californiaBills = await fetchCaliforniaBills(openStatesApiKey);
        liveBills.push(...californiaBills);
      } catch {
        // Silently fall back to curated data
      }
    }
  }

  // Merge curated + live, deduplicate by bill number
  const curatedNumbers = new Set(CURATED_BILLS.map((b) => b.billNumber));
  const uniqueLive = liveBills.filter((b) => !curatedNumbers.has(b.billNumber));
  const allBills = [...CURATED_BILLS, ...uniqueLive].sort((a, b) => {
    if ((b.relevanceScore ?? 0) !== (a.relevanceScore ?? 0)) {
      return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
    }
    return new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime();
  });

  return {
    bills: allBills,
    hasLiveData: liveBills.length > 0,
    apiKeysConfigured,
    lastUpdated: new Date().toISOString(),
  };
}

export default async function HomePage() {
  const data = await getBills();

  return (
    <Suspense fallback={null}>
      <BillsClient
        initialBills={data.bills}
        hasLiveData={data.hasLiveData}
        apiKeysConfigured={data.apiKeysConfigured}
        lastUpdated={data.lastUpdated}
      />
    </Suspense>
  );
}
