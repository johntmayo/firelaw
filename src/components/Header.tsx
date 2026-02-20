export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none" aria-hidden>
                🔥
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Altadena Fire Law Tracker
                </h1>
                <p className="text-xs text-gray-500">
                  California wildfire & disaster recovery legislation
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://leginfo.legislature.ca.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700 hidden sm:block transition-colors"
            >
              CA Legislature
            </a>
            <a
              href="https://www.congress.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700 hidden sm:block transition-colors"
            >
              Congress.gov
            </a>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded font-mono">
              Altadena, CA
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
