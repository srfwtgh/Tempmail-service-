export default function EmailPanel({ email, generating, refreshing, onGenerate, onCopy, onRefresh, onDelete, messageCount }) {
  const iconBtn = 'neo-btn rounded-none p-2.5 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none'
  const btnBase = 'rounded-none px-4 py-3 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'

  return (
    <>
      {/* ── Mobile bar ───────────────────────────────────────── */}
      <div className="md:hidden w-full max-w-full">
        {email ? (
          <div className="flex items-center gap-1.5 px-2.5 py-2 border-b-3 border-[var(--neo-border)] bg-[var(--neo-card)] w-full max-w-full overflow-x-hidden">
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <div className="neo-input rounded-none px-2 py-1.5 text-[11px] w-full truncate font-bold select-all cursor-text">
                {email}
              </div>
              <span className="text-[8px] font-bold text-white bg-accent px-1 py-0.5 tracking-widest uppercase border-3 border-[#000] shrink-0" style={{ boxShadow: '1.5px 1.5px 0 0 #000' }}>
                Live
              </span>
            </div>
            <button onClick={onGenerate} disabled={generating} className="neo-btn-accent rounded-none p-2 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none" title="New">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button onClick={onCopy} disabled={!email} className="neo-btn rounded-none p-2 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none" title="Copy">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="1" ry="1" strokeWidth={2.5} />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2.5} />
              </svg>
            </button>
            <button onClick={onRefresh} disabled={!email || refreshing} className="neo-btn rounded-none p-2 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none" title="Refresh">
              <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="23 4 23 10 17 10" strokeWidth={2.5} />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" strokeWidth={2.5} />
              </svg>
            </button>
            <button onClick={onDelete} disabled={!email} className="neo-btn-danger rounded-none p-2 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none" title="Delete">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" strokeWidth={2.5} />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth={2.5} />
              </svg>
            </button>
          </div>
        ) : (
          <div className="p-3">
            <button onClick={onGenerate} disabled={generating} className="neo-btn-accent rounded-none w-full py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40">
              {generating ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {generating ? 'Creating...' : 'Generate Temp Email'}
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop panel ────────────────────────────────────── */}
      <aside className="hidden md:block p-4 md:p-4 lg:p-6 md:border-r-3 md:border-[var(--neo-border)] md:min-h-0 md:overflow-y-auto">
        <div className="neo-card rounded-none p-5 md:p-5 lg:p-7 animate-fade-up">
          <div className="mb-6">
            <label className="text-[10px] font-bold tracking-widest uppercase mb-2.5 block" style={{ color: 'var(--neo-text-muted)' }}>
              Your email address
            </label>
            <div className="relative">
              <div className="neo-input rounded-none px-4 py-3.5 text-sm w-full select-all cursor-text font-bold">
                {email || <span style={{ color: 'var(--neo-text-muted)', fontWeight: 600 }}>Click below to generate...</span>}
              </div>
              {email && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white bg-accent px-2 py-0.5 tracking-widest uppercase border-3 border-[#000]" style={{ boxShadow: '3px 3px 0 0 #000' }}>
                  Active
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <button onClick={onGenerate} disabled={generating} className={`${btnBase} neo-btn-accent rounded-none`}>
              {generating ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {generating ? 'Creating...' : 'Generate'}
            </button>

            <button onClick={onCopy} disabled={!email} className={`${btnBase} neo-btn rounded-none`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="1" ry="1" strokeWidth={2.5} />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2.5} />
              </svg>
              Copy
            </button>

            <button onClick={onRefresh} disabled={!email || refreshing} className={`${btnBase} neo-btn rounded-none`}>
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="23 4 23 10 17 10" strokeWidth={2.5} />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" strokeWidth={2.5} />
              </svg>
              {refreshing ? 'Checking...' : 'Refresh'}
            </button>

            <button onClick={onDelete} disabled={!email} className={`${btnBase} neo-btn-danger rounded-none`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" strokeWidth={2.5} />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth={2.5} />
              </svg>
              Delete
            </button>
          </div>

          {email && (
            <div className="hidden lg:block neo-divider pt-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div className="neo-card rounded-none px-4 py-3 text-center" style={{ boxShadow: '3px 3px 0 0 var(--neo-shadow)' }}>
                  <p className="text-2xl font-black text-accent leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{messageCount}</p>
                  <p className="text-[10px] font-bold tracking-wider uppercase mt-1.5" style={{ color: 'var(--neo-text-muted)' }}>Messages</p>
                </div>
                <div className="neo-card rounded-none px-4 py-3 text-center" style={{ boxShadow: '3px 3px 0 0 var(--neo-shadow)' }}>
                  <p className="text-2xl font-black leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--neo-text)' }}>
                    {email ? 'Live' : '—'}
                  </p>
                  <p className="text-[10px] font-bold tracking-wider uppercase mt-1.5" style={{ color: 'var(--neo-text-muted)' }}>Status</p>
                </div>
              </div>
            </div>
          )}

          {!email && (
            <p className="text-xs text-center leading-relaxed mt-2 font-bold" style={{ color: 'var(--neo-text-muted)' }}>
              Get a disposable email address instantly.<br />
              No signup required.
            </p>
          )}
        </div>
      </aside>
    </>
  )
}
