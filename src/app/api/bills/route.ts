import { NextResponse } from "next/server";
import { CURATED_BILLS } from "@/lib/curated-bills";
import { fetchCongressBills } from "@/lib/congress-api";
import { fetchCaliforniaBills } from "@/lib/openstates-api";
import { Bill } from "@/lib/types";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const congressApiKey = process.env.CONGRESS_API_KEY;
  const openStatesApiKey = process.env.OPENSTATES_API_KEY;

  const liveBills: Bill[] = [];

  // Fetch live federal bills if API key is configured
  if (congressApiKey) {
    try {
      const federalBills = await fetchCongressBills(congressApiKey);
      liveBills.push(...federalBills);
    } catch (err) {
      console.error("Congress.gov fetch error:", err);
    }
  }

  // Fetch live California bills if API key is configured
  if (openStatesApiKey) {
    try {
      const californiaBills = await fetchCaliforniaBills(openStatesApiKey);
      liveBills.push(...californiaBills);
    } catch (err) {
      console.error("OpenStates fetch error:", err);
    }
  }

  // Merge curated + live bills, deduplicate by bill number
  const curatedNumbers = new Set(CURATED_BILLS.map((b) => b.billNumber));
  const uniqueLiveBills = liveBills.filter(
    (b) => !curatedNumbers.has(b.billNumber)
  );

  const allBills = [
    ...CURATED_BILLS,
    ...uniqueLiveBills,
  ].sort((a, b) => {
    // Sort highlighted/high-relevance bills first, then by date
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
    },
    lastUpdated: new Date().toISOString(),
  });
}
