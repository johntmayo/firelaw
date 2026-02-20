interface Props {
  congressConfigured: boolean;
  openStatesConfigured: boolean;
  legiscanConfigured?: boolean;
}

const ExternalIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const ApiLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-medium transition-colors"
  >
    {label}
    <ExternalIcon />
  </a>
);

export default function ApiKeyNotice({
  congressConfigured,
  openStatesConfigured,
  legiscanConfigured,
}: Props) {
  const anyConfigured = congressConfigured || openStatesConfigured || legiscanConfigured;
  if (anyConfigured) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
      <div className="flex items-start gap-3">
        <span className="text-blue-500 mt-0.5 text-lg">ℹ</span>
        <div>
          <p className="font-semibold text-blue-800 mb-1">
            Showing curated bill data
          </p>
          <p className="text-blue-700 mb-2">
            Add a free API key to fetch live bill data from official sources.
            Add to{" "}
            <code className="bg-blue-100 px-1 rounded text-xs">.env.local</code>.
            LegiScan is the easiest — it covers both federal and California state bills in one key.
          </p>
          <div className="flex flex-wrap gap-3">
            <ApiLink
              href="https://legiscan.com/legiscan-register"
              label="Get LegiScan API key (recommended)"
            />
            <ApiLink
              href="https://api.congress.gov/sign-up"
              label="Get Congress.gov API key"
            />
            <ApiLink
              href="https://openstates.org/accounts/profile/"
              label="Get OpenStates API key"
            />
          </div>
          <p className="text-xs text-blue-600 mt-2">
            All APIs are free. See{" "}
            <code className="bg-blue-100 px-1 rounded">.env.local.example</code>{" "}
            in the project root for setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
