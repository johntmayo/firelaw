import { NextResponse } from "next/server";
import { CURATED_BILLS } from "@/lib/curated-bills";
import { fetchCongressBills } from "@/lib/congress-api";
import { fetchCaliforniaBills } from "@/lib/openstates-api";
import { fetchLegiScanBills } from "@/lib/legiscan-api";
import { Bill } from "@/lib/types";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const congressApiKey = process.env.CONGRESS_API_KEY;
  const openStatesApiKey = process.env.OPENSTATES_API_KEY;
  const legiscanApiKey = process.env.LEGISCAN_API_KEY;

  const liveBills: Bill[] = [];

  // Fetch from all configured sources in parallel
  const fetches: Promise<void>[] = [];

  if (congressApiKey) {
    fetches.push(
      fetchCongressBills(congressApiKey)
        .then((bills) => liveBills.push(...bills))
        .catch((err) => console.error("Congress.gov fetch error:", err))
    );
  }

  if (openStatesApiKey) {
    fetches.push(
      fetchCaliforniaBills(openStatesApiKey)
        .then((bills) => liveBills.push(...bills))
        .catch((err) => console.error("OpenStates fetch error:", err))
    );
  }

  if (legiscanApiKey) {
    fetches.push(
      fetchLegiScanBills(legiscanApiKey)
        .then((bills) => liveBills.push(...bills))
        .catch((err) => console.error("LegiScan fetch error:", err))
    );
  }

  await Promise.all(fetches);

  // Curated bills take precedence — drop any live bill with the same number
  const curatedNumbers = new Set(CURATED_BILLS.map((b) => b.billNumber));

  // Also deduplicate across live sources (LegiScan + OpenStates may overlap)
  const seenLiveNumbers = new Set<string>();
  const uniqueLiveBills = liveBills.filter((b) => {
    if (curatedNumbers.has(b.billNumber)) return false;
    if (seenLiveNumbers.has(b.billNumber)) return false;
    seenLiveNumbers.add(b.billNumber);
    return true;
  });

  const allBills = [
    ...CURATED_BILLS,
    ...uniqueLiveBills,
  ].sort((a, b) => {
    if ((b.relevanceScore ?? 0) !== (a.relevanceScore ?? 0)) {
      return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
    }
    return new Date(b.statusDate).getTime() - new Date(a.statusDate).getTime();
  });

  return NextResponse.json({
    bills: allBills,
    hasLiveData: liveBills.length > 0,
    apiKeysConfigured: {
      congress: !!congressApiKey,
      openStates: !!openStatesApiKey,
      legiscan: !!legiscanApiKey,
    },
    lastUpdated: new Date().toISOString(),
  });
}
