# Eaton Fire Legislation Tracker Implementation Plan

## 1. Product Goal

Turn the existing Altadena Fire Law Tracker into a managed, public-facing
legislation tracker focused on bills relevant to the Eaton Fire and community
recovery.

A small group of volunteers will decide which bills appear. Legislative APIs
will supply current official information, while volunteers will provide the
local context that explains why each bill matters.

The initial implementation should remain lightweight:

- Keep the existing Next.js application and Vercel-style deployment.
- Use a Google Sheet as the editorial source of truth.
- Keep legislative API credentials and API requests server-side.
- Avoid a database, user accounts, and a custom admin application initially.
- Remove the Policy Proposals section.

## 2. Product Principles

### Curated, not comprehensive

The public site should show only bills intentionally selected by project
editors. Broad API search results must not automatically become public.

### Clear ownership of data

Legislative APIs should own official facts:

- Official title and bill number
- Current status
- Latest action and action date
- Introduction date
- Sponsors
- Legislative body
- Official source URL

Editors should own local interpretation:

- Whether a bill is published
- Eaton Fire relevance summary
- Topics
- Priority or featured state
- Display notes and ordering

Editorial fields must not overwrite current official status data.

### Low operational burden

The first release should not require maintaining a separate application server,
database, authentication system, queue, or worker. Existing Next.js server
features and caching should be sufficient at the expected scale.

### Trust and transparency

Every bill should link to its official source, show when it was last refreshed,
and make failures or stale data visible rather than silently presenting old
information as current.

## 3. Scope

### In scope for the first managed release

- Public list of selected legislation
- California and federal bills
- Google Sheet managed by approved volunteers
- Exact bill lookup through configured legislation APIs
- Automated status and latest-action refresh
- Editorial Eaton Fire summaries, topics, and featured flags
- Search, filters, sorting, and statistics
- Stable bill detail URLs
- Source attribution and freshness information
- Validation, logging, and basic automated tests
- Migration of valid existing curated bills into the Sheet

### Explicitly out of scope initially

- Policy Proposals
- Public user accounts
- Personal watchlists
- Email or SMS alerts
- Public bill submissions
- A custom admin interface
- Fine-grained editor permissions inside the application
- Multi-tenant trackers for other disasters or communities
- Full legislative text storage
- A historical database of every API response
- LA County measures unless a reliable source is identified

## 4. Proposed Architecture

### Data flow

1. Approved editors update a Google Sheet.
2. The Next.js server reads active rows from the Sheet.
3. Each row identifies one exact bill using jurisdiction, session, provider,
   and provider ID.
4. A provider adapter retrieves current official information for that bill.
5. The application combines official fields with editorial Sheet fields.
6. The normalized result is cached and rendered on the public website.
7. Only active, valid Sheet rows are published.

### Components

#### Google Sheet

The Sheet is the tracked-bill allowlist and editorial workspace. Its sharing
permissions control who can curate the site.

Recommended first implementation: expose a read-only representation to the
application through a published CSV endpoint or a small Google Apps Script JSON
endpoint. Editors retain normal private Sheet editing access.

If publishing the data is unacceptable, use a Google service account and keep
its credentials in deployment environment variables.

#### Next.js server

The existing application already provides the necessary lightweight backend:

- Server Components and route handlers
- Private environment variables
- Server-side external API requests
- Incremental revalidation and fetch caching

All data loading and merge behavior should be centralized in one server module.
The page and `/api/bills` route must use that shared module rather than
maintaining separate implementations.

#### Legislative providers

Use provider adapters behind a common interface. LegiScan can be the initial
primary provider because it covers California and federal legislation.
Congress.gov and OpenStates can remain available as authoritative or fallback
providers where useful.

Provider adapters must fetch exact bills by canonical ID. Existing broad,
hardcoded keyword searches should not determine which bills are public.

## 5. Google Sheet Schema

Use one `Bills` tab with one row per tracked bill.

### Identity and publishing fields

| Column | Required | Description |
| --- | --- | --- |
| `active` | Yes | `TRUE` to publish the bill |
| `provider` | Yes | `legiscan`, `congress`, or `openstates` |
| `provider_id` | Yes | Stable ID used for exact provider lookup |
| `jurisdiction` | Yes | Initially `CA` or `US` |
| `session` | Yes | Legislative session or Congress number |
| `bill_number` | Yes | Human-readable identifier, used for review |

### Editorial fields

| Column | Required | Description |
| --- | --- | --- |
| `why_it_matters` | Yes | Eaton Fire/community relevance summary |
| `topics` | Yes | Pipe-separated approved topic keys |
| `featured` | No | `TRUE` for the most relevant bills |
| `priority` | No | Numeric display priority |
| `editor_notes` | No | Internal notes; never rendered publicly |
| `custom_title` | No | Exceptional editorial display title |

### Operational fields

| Column | Required | Description |
| --- | --- | --- |
| `added_by` | No | Editor name or initials |
| `added_at` | No | Date added to the tracker |
| `reviewed_at` | No | Date editorial context was last reviewed |

The application must ignore unknown columns, reject invalid required values,
and never expose `editor_notes` in public responses.

## 6. Target Data Model

Separate provider-owned and editor-owned data in code instead of representing
both as one ambiguous curated record.

Suggested conceptual types:

```ts
interface TrackedBill {
  active: boolean;
  provider: LegislativeProvider;
  providerId: string;
  jurisdiction: "CA" | "US";
  session: string;
  billNumber: string;
  whyItMatters: string;
  topics: BillTopic[];
  featured: boolean;
  priority?: number;
  customTitle?: string;
  reviewedAt?: string;
}

interface OfficialBill {
  canonicalId: string;
  provider: LegislativeProvider;
  providerId: string;
  billNumber: string;
  title: string;
  description?: string;
  status: BillStatus;
  statusLabel: string;
  statusDate?: string;
  introducedDate?: string;
  sponsors: Sponsor[];
  body: string;
  officialUrl: string;
  lastAction?: string;
  fetchedAt: string;
}

interface PublishedBill extends OfficialBill {
  whyItMatters: string;
  topics: BillTopic[];
  featured: boolean;
  priority?: number;
  dataState: "current" | "stale" | "unavailable";
}
```

The final names may differ, but provider facts and editorial annotations should
remain distinct throughout ingestion and merging.

## 7. Implementation Phases

### Phase 0: Verify provider capabilities and tracked records

Before restructuring the application:

1. Confirm exact-bill lookup operations and quotas for each configured API.
2. Decide which provider is authoritative for California and federal bills.
3. Verify canonical IDs for the existing real bills.
4. Identify and remove any existing records that are proposals, regulations,
   appropriations descriptions, duplicates, or unverifiable bills.
5. Confirm whether Sheet data may be publicly readable.

Deliverable: a verified provider strategy and clean migration inventory.

Acceptance criteria:

- One exact lookup is demonstrated for a California bill.
- One exact lookup is demonstrated for a federal bill.
- Provider IDs survive title or status changes.
- Rate limits support hourly refresh of the expected bill count.

### Phase 1: Simplify the existing product

1. Remove the Policy Proposals tab and proposal-specific UI state.
2. Remove proposal data from the page payload.
3. Remove `ProposalCard`, proposal types, and curated proposal data after
   confirming they have no remaining use.
4. Update navigation, metadata, disclaimer, footer copy, and product language.
5. Rename “Most Relevant to Altadena” to the final agreed featured label.

Deliverable: a legislation-only public tracker using the existing data source.

Acceptance criteria:

- No Policy Proposal UI or proposal count remains.
- Existing bill search, filters, sorting, and cards still work.
- The production build and lint checks pass.

### Phase 2: Centralize and harden data loading

1. Move page/API loading into a shared server-only service.
2. Define a common provider adapter contract.
3. Normalize canonical bill IDs and bill-number formatting.
4. Replace silent catches with structured error reporting.
5. Add runtime validation for provider responses and normalized records.
6. Make the page and `/api/bills` route consume the same service.
7. Add unit tests for normalization, merging, status mapping, and deduplication.

Deliverable: one tested ingestion path independent of the storage choice.

Acceptance criteria:

- Page and API route return the same bill set.
- A provider failure does not crash the public page.
- Invalid records are excluded and logged with a useful reason.
- No API credentials can appear in browser payloads or logs.

### Phase 3: Add the Google Sheet allowlist

1. Create the Sheet and protect its header/schema.
2. Implement the Sheet fetcher and row parser.
3. Validate required fields and topic values.
4. Filter inactive rows before provider requests.
5. Ensure internal columns are stripped from public objects.
6. Migrate verified current tracked bills into the Sheet.
7. Replace `CURATED_BILLS` as the production source of tracked selections.
8. Keep a temporary fallback only during migration; remove it afterward.

Deliverable: adding or disabling a valid Sheet row changes the public tracker
without a code commit.

Acceptance criteria:

- Editors can add, feature, annotate, and disable bills in the Sheet.
- Changes appear after the configured cache interval.
- Malformed rows do not become public.
- A Sheet outage serves the last successful cached result where available.
- No `editor_notes` value appears in HTML or `/api/bills`.

### Phase 4: Implement exact-bill enrichment

1. Add exact lookup methods to provider adapters.
2. Fetch only active Sheet records.
3. Use provider data for official fields and Sheet data for editorial fields.
4. Remove broad keyword search ingestion from the public data path.
5. Add bounded concurrency, timeouts, retries, and quota-aware caching.
6. Record `fetchedAt` and derive current/stale/unavailable states.
7. Define fallback behavior when one bill cannot be refreshed.

Recommended fallback:

- Continue showing the last cached official record.
- Mark it stale with its last successful refresh time.
- Do not replace official fields with editor-entered guesses.
- Hide a record only if it has never loaded successfully or is explicitly
  disabled.

Deliverable: selected bills automatically display current official status.

Acceptance criteria:

- Updating a bill at its provider changes the site after revalidation.
- Unselected search results never appear.
- Provider failure is visible operationally and does not fabricate a status.
- Curated annotations remain intact across official updates.

### Phase 5: Add stable bill detail pages

1. Add a route such as `/bills/[canonicalId]`.
2. Use readable, collision-safe canonical IDs.
3. Show full public metadata, Eaton Fire relevance, source attribution, and
   freshness.
4. Add bill-specific metadata for sharing and search engines.
5. Link cards to the internal detail page while retaining the official link.
6. Return a proper not-found response for inactive or unknown bills.

Deliverable: every tracked bill has a stable public permalink.

Acceptance criteria:

- Bill URLs remain stable when titles or statuses change.
- Detail pages are server-rendered and shareable.
- Inactive bills are no longer publicly accessible unless an archival policy
  is intentionally added.

### Phase 6: Operations, documentation, and launch readiness

1. Replace the default README with setup, deployment, Sheet, and API guidance.
2. Add an environment-variable example file that contains names only.
3. Document the volunteer curation workflow.
4. Add tests for Sheet parsing and provider fixtures.
5. Add a CI workflow for lint, tests, and production build.
6. Add basic monitoring for Sheet/provider failures and stale records.
7. Verify accessibility, mobile behavior, metadata, and external links.
8. Review all migrated editorial summaries for accuracy and tone.

Deliverable: a maintainable release that another volunteer can operate.

Acceptance criteria:

- A new maintainer can deploy from repository documentation.
- An editor can add a bill using written instructions.
- Failed refreshes produce an actionable signal.
- Public pages clearly show sources and freshness.

## 8. Volunteer Workflow for the First Release

Until a custom admin interface is justified:

1. Search for the bill on LegiScan, Congress.gov, OpenStates, or the official
   legislature website.
2. Confirm the jurisdiction, session, bill number, and canonical provider ID.
3. Add a row to the Sheet with `active` set to `FALSE`.
4. Write the Eaton Fire relevance summary and choose approved topics.
5. Have a second editor review the identity and summary.
6. Set `active` to `TRUE`.
7. Confirm the bill appears after cache revalidation.

The Sheet should include instructions, topic definitions, and example rows on a
separate protected `Instructions` tab.

## 9. Testing Strategy

### Unit tests

- Sheet row parsing and validation
- Topic parsing
- Provider response normalization
- Status inference where a provider lacks structured status
- Canonical ID generation
- Official/editorial field merge precedence
- Deduplication
- Stale-data state calculation

### Integration tests

- Google Sheet fixture to published bill response
- Successful and failed exact provider lookups
- Partial provider failure
- Empty or unavailable Sheet
- Cache/fallback behavior
- Public API redaction of internal fields

### End-to-end tests

- Public search, filters, and sorting
- Featured filter
- Card-to-detail navigation
- Official external link
- Disabled bill removal
- Mobile layout and keyboard navigation

Live provider APIs should not be required for routine CI. Use recorded,
sanitized fixtures and reserve limited live smoke tests for manual validation.

## 10. Security and Privacy

- Never expose legislative or Google service credentials to client code.
- Do not use `NEXT_PUBLIC_` variables for secrets.
- Treat all Sheet cells as untrusted input and validate before rendering.
- Render editorial text as plain text unless HTML sanitization is deliberately
  introduced.
- Do not expose internal editor notes through page props, APIs, logs, or error
  messages.
- Restrict Sheet editing through Google permissions.
- If Apps Script is used, expose only read operations needed by the public app.
- Apply reasonable timeouts and response-size limits to external requests.

## 11. Key Risks and Mitigations

### Provider IDs and APIs differ

Mitigation: use a provider adapter interface and store both canonical internal
IDs and provider IDs.

### Current curated data may contain stale or unverifiable records

Mitigation: require verification during migration; do not bulk-copy every
existing record into the new Sheet.

### Spreadsheet schema drift

Mitigation: protect headers, validate every row, provide an Instructions tab,
and report rejected rows.

### Provider outages or quotas

Mitigation: cache successful records, use bounded refreshes, display freshness,
and avoid broad searches during public requests.

### Google Sheet becomes an accidental public admin API

Mitigation: expose read-only data only, omit internal fields from published
views, and use a service account if public read access is unacceptable.

### Duplicate logic diverges again

Mitigation: place all loading, normalization, and merging in one server-only
service consumed by both pages and route handlers.

## 12. Decision Gates

The following decisions should be made before Phase 3:

1. Can the app's subset of Sheet data be publicly readable?
2. Is LegiScan the primary provider for both California and federal bills?
3. What is the final list of editorial topics?
4. What should the featured label say publicly?
5. Should inactive bills disappear or remain in a public archive?
6. What refresh interval is appropriate for API quotas?

The following decision should be deferred until the Sheet workflow has been
used in practice:

### Do volunteers need a custom admin application?

Build one only if editors cannot reliably identify provider IDs, validation
errors are too frequent, or audit/permission requirements outgrow Google
Sheets.

If an admin application becomes necessary, consider Supabase for authentication
and persistence rather than adding authenticated write access to Google Sheets.
The public provider adapters and normalized bill model from this plan can remain
unchanged.

## 13. Definition of Done

The first managed release is complete when:

- The public site contains only intentionally selected legislation.
- Policy Proposals have been removed.
- Approved volunteers can manage selections and editorial context without code
  changes.
- Each selected bill is refreshed by exact provider ID.
- Official status fields cannot be overridden by stale editorial data.
- Every bill has a stable detail URL and official source link.
- The site reports freshness and handles partial upstream failures safely.
- Data ingestion and merge behavior have automated tests.
- Setup, deployment, and volunteer workflows are documented.
- No separate database or custom admin application is required to operate the
  release.
