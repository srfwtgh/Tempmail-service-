import { useState } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { formatFullDate } from '../utils/tempEmailApi'

function resolveCidImages(html, attachments) {
  if (!html || !attachments || attachments.length === 0) return html
  let result = html
  attachments.forEach(att => {
    if (att.contentId && att.content) {
      const cid = att.contentId.replace(/[<>]/g, '')
      result = result.replace(new RegExp(`cid:${cid}`, 'g'), `data:${att.contentType};base64,${att.content}`)
    }
  })
  return result
}

function extractText(msg) {
  const raw =
    msg.text?.trim() ||
    msg.body?.trim() ||
    msg.content?.trim() ||
    msg.textBody?.trim() ||
    msg.intro?.trim() ||
    msg.snippet?.trim() ||
    msg.preview?.trim()
  if (raw) return raw
  if (msg.html) {
    const d = document.createElement('div')
    d.innerHTML = msg.html
    return (d.textContent || d.innerText || '').trim()
  }
  return ''
}

function escapeHtml(text) {
  if (!text) return ''
  const d = document.createElement('div')
  d.textContent = text
  return d.innerHTML
}

export default function QuickViewModal({ message, onClose }) {
  const [showHtml, setShowHtml] = useState(true)
  if (!message) return null

  const rawHtml = resolveCidImages(message.html || message.htmlBody, message.attachments)
  const textContent = extractText(message)
  const hasHtml = Boolean(rawHtml)
  const content = rawHtml || textContent
  const hasContent = content.length > 0

  let renderedText = ''
  if (textContent) {
    try {
      renderedText = DOMPurify.sanitize(marked.parse(textContent))
    } catch {
      renderedText = escapeHtml(textContent)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 neo-backdrop" />

      <div
        className="relative w-full flex flex-col neo-card animate-scale-in rounded-none md:rounded-none md:max-w-3xl md:max-h-[85vh] md:m-3 lg:max-w-4xl lg:max-h-[90vh] lg:m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 lg:px-6 pt-4 lg:pt-6 pb-4 neo-divider shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className="text-base lg:text-xl font-black truncate" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--neo-text)' }}>
              {escapeHtml(message.subject || '(No Subject)')}
            </h2>
            <div className="flex flex-col gap-y-0.5 mt-2 text-xs font-bold" style={{ color: 'var(--neo-text-muted)' }}>
              <span>From: {escapeHtml(message.from || 'Unknown')}</span>
              <span>Date: {formatFullDate(message.date)}</span>
            </div>
          </div>
          <button onClick={onClose} className="neo-btn rounded-none p-2 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toggle */}
        {hasHtml && (
          <div className="flex items-center gap-3 px-4 lg:px-6 pt-3 pb-2 shrink-0">
            <button
              onClick={() => setShowHtml(true)}
              className={`px-3 py-1 text-xs font-bold rounded-none transition-all ${showHtml ? 'neo-btn-accent' : 'neo-btn'}`}
            >
              HTML
            </button>
            <button
              onClick={() => setShowHtml(false)}
              className={`px-3 py-1 text-xs font-bold rounded-none transition-all ${!showHtml ? 'neo-btn-accent' : 'neo-btn'}`}
            >
              Plain Text
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 lg:px-6 py-4 text-sm leading-relaxed break-words" style={{ color: 'var(--neo-text)' }}>
          {!hasContent ? (
            <div className="flex flex-col items-center justify-center py-14" style={{ color: 'var(--neo-text-muted)' }}>
              <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <p className="text-sm font-black">No content available</p>
            </div>
          ) : hasHtml && showHtml ? (
            <div className="max-w-full [&_img]:max-w-full [&_table]:max-w-full [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_a]:text-accent [&_a]:underline [&_a]:font-bold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawHtml, { ADD_TAGS: ['style'], ADD_ATTR: ['target'] }) }} />
          ) : (
            <div
              className="prose prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-a:text-accent prose-strong:font-black"
              style={{ color: 'var(--neo-text)' }}
              dangerouslySetInnerHTML={{ __html: renderedText || escapeHtml(textContent || content) }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 lg:px-6 py-4 neo-divider shrink-0">
          <button onClick={onClose} className="neo-btn-accent rounded-none px-5 py-2 text-sm font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
