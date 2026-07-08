import { escapeHtml, formatRelativeTime } from '../utils/tempEmailApi'

export default function InboxView({ messages, onQuickView, searchQuery, onSearchChange }) {
  return (
    <main className="flex flex-col min-h-0 p-3 lg:p-6 lg:pt-6">
      <div className="neo-card rounded-none flex flex-col flex-1 min-h-0 animate-fade-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 lg:px-6 py-3 lg:py-4 neo-divider shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-accent border-3 border-[#000] shrink-0" style={{ boxShadow: '3px 3px 0 0 #000' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--neo-text)' }}>Inbox</h2>
            <span className="neo-badge text-xs font-bold px-2 py-0.5">
              {messages.length}
            </span>
          </div>

          <div className="relative w-full sm:w-48 lg:w-56">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--neo-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth={2.5} />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2.5} />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search sender or subject..."
              className="neo-input rounded-none pl-9 pr-3 py-2 w-full text-xs font-bold"
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!messages || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 lg:py-20" style={{ color: 'var(--neo-text-muted)' }}>
              <div className="w-16 h-16 neo-card rounded-none flex items-center justify-center mb-4" style={{ boxShadow: '4px 4px 0 0 var(--neo-shadow)' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-base font-black" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--neo-text)' }}>No messages yet</p>
              <p className="text-xs font-bold mt-1.5" style={{ color: 'var(--neo-text-muted)' }}>
                {searchQuery ? 'No results for your search' : 'Emails will appear here when received'}
              </p>
            </div>
          ) : (
            <div className="divide-y-[3px] divide-[var(--neo-border)]">
              {messages.slice(0, 20).map((msg) => (
                <div
                  key={msg.id}
                  className="msg-item group flex items-start gap-3 lg:gap-4 px-3 lg:px-6 py-3 lg:py-4 neo-row-hover cursor-pointer"
                  onClick={() => onQuickView(msg)}
                >
                  <div className="w-10 h-10 neo-card rounded-none flex items-center justify-center shrink-0 mt-0.5" style={{ boxShadow: '3px 3px 0 0 var(--neo-shadow)' }}>
                    <span className="text-sm font-black text-accent uppercase">
                      {(msg.from || '?').charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black truncate" style={{ color: 'var(--neo-text)' }}>
                        {escapeHtml(msg.from || 'Unknown')}
                      </span>
                      <span className="text-[11px] whitespace-nowrap shrink-0 font-bold" style={{ color: 'var(--neo-text-muted)' }}>
                        {formatRelativeTime(msg.date)}
                      </span>
                    </div>
                    <p className="text-sm font-bold truncate mt-1 leading-relaxed" style={{ color: 'var(--neo-text-muted)' }}>
                      {escapeHtml(msg.subject || '(No Subject)')}
                    </p>
                    {msg.intro && (
                      <p className="text-xs font-semibold truncate mt-1 leading-relaxed line-clamp-1" style={{ color: 'var(--neo-text-muted)' }}>
                        {escapeHtml(msg.intro)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center shrink-0">
                    <span className="p-2 opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ color: 'var(--neo-text-muted)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
