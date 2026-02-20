import { PolicyProposal } from "./types";

/**
 * Curated policy proposals from think tanks, politicians, advocacy groups,
 * citizen movements, and government agencies — ideas that haven't yet been
 * formally introduced as legislation but are shaping the policy landscape
 * for Altadena / Eaton Fire survivors.
 */
export const CURATED_PROPOSALS: PolicyProposal[] = [
  {
    id: "prop-sustainable-insurance-strategy",
    title: "Sustainable Insurance Strategy — Rate Reform & Coverage Mandate",
    description:
      "California Insurance Commissioner Ricardo Lara's framework to modernize insurance regulation: allow insurers to use forward-looking catastrophe models when setting rates (reversing a decades-old ban), and in exchange require them to write new policies in distressed high-risk markets including wildfire zones. Designed to slow insurer exodus from California.",
    proposedBy: {
      name: "Ricardo Lara",
      organization: "California Department of Insurance",
      type: "government_agency",
    },
    proposedDate: "2023-09-21",
    topics: ["insurance", "wildfire_recovery"],
    status: "incorporated",
    statusLabel: "Incorporated into Regulation",
    url: "https://www.insurance.ca.gov",
    summary:
      "Directly addresses the insurance crisis that left many Altadena homeowners uninsured or under-insured before the Eaton Fire. The catastrophe modeling allowance gives insurers a path back to the market; the mandatory-writing requirement is intended to protect high-risk areas like Altadena.",
    relatedBills: ["SB 505", "AB 226", "SBX2 1"],
    isHighlighted: true,
    relevanceScore: 10,
  },
  {
    id: "prop-rand-insurance-backstop",
    title: "State-Backed Reinsurance Pool for Wildfire Risk",
    description:
      "RAND Corporation researchers have proposed creating a California state-backed reinsurance facility that would absorb catastrophic wildfire losses above a threshold, reducing the tail risk that drives private insurers to exit the market. The proposal pairs reinsurance with mandatory risk disclosure and graduated mitigation requirements for homeowners.",
    proposedBy: {
      name: "RAND Corporation Research Staff",
      organization: "RAND Corporation",
      type: "think_tank",
    },
    proposedDate: "2024-03-01",
    topics: ["insurance", "wildfire_recovery", "disaster_relief"],
    status: "gaining_support",
    statusLabel: "Gaining Legislative Attention",
    url: "https://www.rand.org",
    summary:
      "A reinsurance backstop would stabilize the private market and prevent the kind of wholesale insurer retreat that forced Altadena homeowners onto the FAIR Plan. Several CA legislators have cited RAND's research in hearings on post-fire insurance reform.",
    relatedBills: ["SBX2 1", "SB 505"],
    isHighlighted: true,
    relevanceScore: 9,
  },
  {
    id: "prop-newsom-100day-recovery",
    title: "100-Day Wildfire Recovery Executive Framework",
    description:
      "Governor Newsom's executive action package announced following the January 2025 LA fires: suspension of CEQA review for rebuilding on existing footprints, executive order waiving certain permitting fees, emergency authorization of debris removal contracts, and direction to the insurance commissioner to expedite claims review. Also includes a directive to CPUC to investigate utility liability.",
    proposedBy: {
      name: "Gov. Gavin Newsom",
      organization: "Office of the Governor",
      type: "politician",
    },
    proposedDate: "2025-01-14",
    topics: ["rebuilding", "debris_removal", "insurance", "utilities", "wildfire_recovery"],
    status: "incorporated",
    statusLabel: "Enacted via Executive Order",
    url: "https://www.gov.ca.gov",
    summary:
      "Several of these executive actions directly affect Altadena: the CEQA suspension speeds up rebuilding permits, and the debris removal authorization accelerated the Army Corps timeline in the Eaton Fire zone. Some provisions are being codified into permanent law through the emergency legislative session.",
    relatedBills: ["ABX2 1", "SBX2 4", "ABX2 7"],
    isHighlighted: true,
    relevanceScore: 10,
  },
  {
    id: "prop-united-policyholders-claims-standards",
    title: "Wildfire Claims Fair Play Standards",
    description:
      "United Policyholders, a nonprofit consumer advocacy group, has proposed a model bill establishing mandatory standards for wildfire insurance claims: minimum timelines for claim acknowledgment and payment, prohibition on lowball initial offers without written justification, extended Additional Living Expense (ALE) coverage periods to 36 months for declared disasters, and a public adjuster access guarantee.",
    proposedBy: {
      name: "Amy Bach",
      organization: "United Policyholders",
      type: "advocacy_group",
    },
    proposedDate: "2024-11-15",
    topics: ["insurance", "disaster_relief", "wildfire_recovery"],
    status: "under_review",
    statusLabel: "Under Legislative Review",
    url: "https://uphelp.org",
    summary:
      "Eaton Fire survivors have reported delayed claim payments and ALE running out before they can rebuild. These standards would give policyholders enforceable rights and set a floor on insurer behavior during the claims process.",
    relatedBills: ["SB 505", "AB 226"],
    isHighlighted: false,
    relevanceScore: 8,
  },
  {
    id: "prop-headwaters-mitigation-funding",
    title: "Pre-Disaster Mitigation Funding Reform",
    description:
      "Headwaters Economics proposes restructuring federal and state wildfire spending to shift resources from post-fire disaster relief toward proactive community-level mitigation: Community Wildfire Protection Plans (CWPPs), home retrofit assistance programs, and defensible space incentive grants. The proposal argues that the current funding model creates a perverse incentive to underinvest in prevention.",
    proposedBy: {
      name: "Headwaters Economics Research Team",
      organization: "Headwaters Economics",
      type: "think_tank",
    },
    proposedDate: "2024-06-10",
    topics: ["wildfire_recovery", "disaster_relief", "environment", "public_safety"],
    status: "gaining_support",
    statusLabel: "Referenced in Federal Legislation",
    url: "https://headwaterseconomics.org",
    summary:
      "A community like Altadena, which sits at the wildland-urban interface, would benefit directly from a mitigation-first funding model: retrofit grants for older homes, defensible space assistance, and neighborhood-scale fuel management. This framework is being incorporated into several federal wildfire reform proposals.",
    relatedBills: ["HR 517"],
    isHighlighted: false,
    relevanceScore: 7,
  },
  {
    id: "prop-altadena-town-council-rebuild-framework",
    title: "Altadena Community Rebuild Framework",
    description:
      "The Altadena Town Council, in coordination with neighborhood associations, has put forward a community-driven rebuilding framework that calls for: anti-displacement protections ensuring renters and long-term lower-income residents can return; design review guidelines that preserve neighborhood character; expedited permits for residents rebuilding their primary residence; and a community land trust pilot for the most vulnerable displaced households.",
    proposedBy: {
      name: "Altadena Town Council",
      organization: "Altadena Town Council",
      type: "citizen_movement",
    },
    proposedDate: "2025-02-01",
    topics: ["rebuilding", "housing", "wildfire_recovery"],
    status: "gaining_support",
    statusLabel: "Submitted to LA County",
    summary:
      "This proposal speaks directly to Altadena-specific concerns: that wealthier buyers and developers will outcompete fire survivors for land, that the neighborhood's historic character will be lost, and that the most vulnerable residents—renters, seniors, lower-income homeowners—will be permanently displaced. The land trust pilot is the most novel element.",
    relatedBills: ["ABX2 1"],
    isHighlighted: true,
    relevanceScore: 10,
  },
  {
    id: "prop-calfire-vegetation-management",
    title: "CAL FIRE Accelerated Vegetation Management Plan",
    description:
      "CAL FIRE's long-range plan to treat up to one million acres per year of high-risk forest and shrubland through prescribed burns, mechanical fuel removal, and managed grazing. The plan calls for streamlined environmental review for prescribed burns, expanded use of Indigenous cultural burning practices, and a statewide network of fuel break corridors along major highways and ridgelines.",
    proposedBy: {
      name: "CAL FIRE Leadership",
      organization: "California Department of Forestry and Fire Protection",
      type: "government_agency",
    },
    proposedDate: "2024-08-20",
    topics: ["environment", "public_safety", "wildfire_recovery", "evacuation"],
    status: "under_review",
    statusLabel: "Partially Funded, Awaiting Full Authorization",
    url: "https://www.fire.ca.gov",
    summary:
      "Fuel management above and around Altadena's foothill interface is critical to reducing future fire risk. CAL FIRE's plan includes the Angeles National Forest corridor, directly relevant to the terrain that fed the Eaton Fire. Full implementation requires both legislative funding and CEQA streamlining.",
    relatedBills: ["AB 9"],
    isHighlighted: false,
    relevanceScore: 7,
  },
  {
    id: "prop-rebuild-altadena-land-trust",
    title: "Community Land Trust for Eaton Fire Survivors",
    description:
      "A coalition of Altadena residents and housing advocates is organizing a community land trust (CLT) that would acquire parcels in the fire zone and offer permanently affordable homeownership to fire survivors who might otherwise be unable to compete with cash buyers and developers. The CLT model separates land ownership (held by the trust) from home ownership (held by the resident), removing land from speculative market pressure.",
    proposedBy: {
      name: "Rebuild Altadena Coalition",
      organization: "Rebuild Altadena Coalition",
      type: "citizen_movement",
    },
    proposedDate: "2025-01-28",
    topics: ["housing", "wildfire_recovery", "rebuilding"],
    status: "gaining_support",
    statusLabel: "Organizing & Fundraising",
    summary:
      "Altadena has historically been one of LA County's most racially and economically diverse unincorporated communities. Without proactive intervention, fire recovery typically accelerates displacement and gentrification. A CLT is one of the most proven tools for preventing that outcome. This proposal is community-initiated and not yet tied to any government program.",
    relatedBills: [],
    isHighlighted: true,
    relevanceScore: 9,
  },
  {
    id: "prop-third-way-federal-disaster-finance",
    title: "Federal Disaster Finance Reform — From Recovery to Resilience",
    description:
      "Third Way, a center-left think tank, proposes restructuring federal disaster finance so that FEMA's Hazard Mitigation Grant Program is funded at parity with disaster recovery spending. The proposal also calls for a federal wildfire insurance backstop modeled on the National Flood Insurance Program (NFIP), which would provide a government reinsurance layer and standardize coverage terms nationally.",
    proposedBy: {
      name: "Third Way Climate & Energy Team",
      organization: "Third Way",
      type: "think_tank",
    },
    proposedDate: "2024-09-30",
    topics: ["fema", "disaster_relief", "insurance", "wildfire_recovery"],
    status: "circulating",
    statusLabel: "Circulating in Policy Circles",
    summary:
      "A federal wildfire insurance backstop—analogous to NFIP for floods—would be transformative for communities like Altadena where the private market has largely failed. If adopted, it would guarantee baseline coverage availability regardless of insurer behavior. The FEMA reform component would also unlock more pre-disaster funding for at-risk communities.",
    relatedBills: ["HR 517", "S 154"],
    isHighlighted: false,
    relevanceScore: 7,
  },
  {
    id: "prop-cpuc-utility-accountability",
    title: "Utility Wildfire Liability & Accountability Reform",
    description:
      "The California Public Utilities Commission has proposed expanding its wildfire mitigation plan review process to include independent third-party audits of utility compliance, enforceable milestones with financial penalties for missed targets, and a requirement that utilities publicly disclose equipment condition data in high-risk zones. Consumer advocates have pushed to pair this with rate-case reform that limits cost pass-through for self-caused fires.",
    proposedBy: {
      name: "CPUC Safety & Enforcement Division",
      organization: "California Public Utilities Commission",
      type: "government_agency",
    },
    proposedDate: "2024-12-05",
    topics: ["utilities", "public_safety", "wildfire_recovery"],
    status: "under_review",
    statusLabel: "Open for Public Comment",
    url: "https://www.cpuc.ca.gov",
    summary:
      "Southern California Edison equipment has been identified as a potential ignition source under investigation in connection with the Eaton Fire. Stronger CPUC oversight and liability rules would affect SCE's obligations to Altadena residents, including whether ratepayers or shareholders bear the cost of fire damage.",
    relatedBills: ["SBX2 5", "AB 1054"],
    isHighlighted: true,
    relevanceScore: 9,
  },
];
