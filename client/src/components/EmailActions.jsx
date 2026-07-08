export default function EmailActions({
  email,
  generating,
  refreshing,
  autoRefresh,
  onGenerate,
  onCopy,
  onRefresh,
  onDelete,
  onToggleAutoRefresh,
}) {
  const btnBase = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none'

  return (
    <div className="flex flex-wrap items-center gap-2.5 mt-5">
      <button onClick={onGenerate} disabled={generating} className={`${btnBase} glass-btn-accent text-white`}>
        {generating ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Generating
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Generate
          </>
        )}
      </button>

      <button onClick={onCopy} disabled={!email} className={`${btnBase} glass-btn text-gray-300`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={2} />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2} />
        </svg>
        Copy
      </button>

      <button onClick={onRefresh} disabled={!email || refreshing} className={`${btnBase} glass-btn text-gray-300`}>
        <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <polyline points="23 4 23 10 17 10" strokeWidth={2} />
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" strokeWidth={2} />
        </svg>
        Refresh
      </button>

      <button onClick={onDelete} disabled={!email} className={`${btnBase} glass-btn-danger text-red-300`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" strokeWidth={2} />
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth={2} />
        </svg>
        Delete
      </button>

      <label className="flex items-center gap-2.5 ml-auto text-sm text-gray-500 cursor-pointer select-none group">
        <span className="group-hover:text-gray-400 transition-colors">Auto-refresh</span>
        <div className="relative">
          <input type="checkbox" checked={autoRefresh} onChange={onToggleAutoRefresh} className="sr-only peer" />
          <div className="w-10 h-5 rounded-full glass transition-colors peer-checked:bg-indigo-500/30 peer-checked:border-indigo-400/30" />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white/60 rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-indigo-300" />
        </div>
      </label>
    </div>
  )
}
