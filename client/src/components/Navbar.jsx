export default function Navbar({ email, messageCount, autoRefresh, onToggleAutoRefresh, darkMode, onToggleDark }) {
  return (
    <header className="md:col-span-2 neo-nav sticky top-0 z-30">
      <div className="flex items-center justify-between px-3 lg:px-8 py-2.5 lg:py-3 max-w-full">
        <div className="flex items-center gap-2.5 lg:gap-3">
          <div className="flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 bg-accent border-3 border-[#000] shrink-0" style={{ boxShadow: '3px 3px 0 0 #000' }}>
            <svg className="w-[18px] h-[18px] lg:w-5 lg:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-base lg:text-xl font-black tracking-tight uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--neo-text)' }}>
              Temp Mail
            </h1>
            <p className="hidden lg:block text-[10px] tracking-widest uppercase font-bold leading-none" style={{ color: 'var(--neo-text-muted)' }}>
              Disposable Email
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 lg:gap-3">
          {email && (
            <label className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs font-bold cursor-pointer select-none" style={{ color: 'var(--neo-text-muted)' }}>
              <span className="hidden sm:inline">Auto</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={onToggleAutoRefresh}
                  className="sr-only peer"
                />
                <div className={`neo-toggle-track rounded-none ${autoRefresh ? 'checked' : ''}`} />
                <div className={`neo-toggle-thumb rounded-none ${autoRefresh ? 'checked' : ''}`} />
              </div>
            </label>
          )}

          {email && (
            <span className="hidden lg:inline-flex items-center gap-1.5 neo-badge text-xs font-bold px-2.5 py-1">
              <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              {messageCount} {messageCount === 1 ? 'msg' : 'msgs'}
            </span>
          )}

          <button
            onClick={onToggleDark}
            className="neo-btn rounded-none p-2 flex items-center justify-center"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" strokeWidth={2.5} />
                <line x1="12" y1="1" x2="12" y2="3" strokeWidth={2.5} />
                <line x1="12" y1="21" x2="12" y2="23" strokeWidth={2.5} />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth={2.5} />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth={2.5} />
                <line x1="1" y1="12" x2="3" y2="12" strokeWidth={2.5} />
                <line x1="21" y1="12" x2="23" y2="12" strokeWidth={2.5} />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth={2.5} />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth={2.5} />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <span className="hidden lg:inline text-[10px] tracking-wide font-bold uppercase" style={{ color: 'var(--neo-text-muted)' }}>
            Auto-delete 60min
          </span>
        </div>
      </div>
    </header>
  )
}
