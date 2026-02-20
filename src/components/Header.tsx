export default function Header() {
  return (
    <header className="bg-[#304059] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none" aria-hidden>
                🔥
              </span>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">
                  Altadena Fire Law Tracker
                </h1>
                <p className="text-xs text-[#AFC892]">
                  California wildfire &amp; disaster recovery legislation
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://leginfo.legislature.ca.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/60 hover:text-white hidden sm:block transition-colors"
            >
              CA Legislature
            </a>
            <a
              href="https://www.congress.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/60 hover:text-white hidden sm:block transition-colors"
            >
              Congress.gov
            </a>
            <span className="text-xs text-[#AFC892] bg-[#253347] px-2 py-1 rounded font-mono">
              Altadena, CA
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
