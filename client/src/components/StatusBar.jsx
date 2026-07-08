export default function StatusBar({ status }) {
  const icons = {
    error: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
    success: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  }

  const types = {
    error: { border: 'border-red-500', icon: 'text-red-500' },
    success: { border: 'border-emerald-500', icon: 'text-emerald-500' },
    info: { border: 'border-accent', icon: 'text-accent' },
  }

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        status ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      {status && (
        <div className={`flex items-center gap-3 px-5 py-3 neo-status rounded-none ${types[status.type]?.border || types.info.border}`} style={{ borderLeftWidth: '6px' }}>
          <svg className={`w-4 h-4 shrink-0 ${types[status.type]?.icon || types.info.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icons[status.type] || icons.info}
          </svg>
          <span className="text-sm font-bold" style={{ color: 'var(--neo-text)' }}>{status.message}</span>
        </div>
      )}
    </div>
  )
}
