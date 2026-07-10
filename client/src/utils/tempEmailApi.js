import { formatDistanceToNow, format } from 'date-fns'

const API_BASE = '/api'

export async function generateEmail() {
  const res = await fetch(`${API_BASE}/generate`, { method: 'POST' })
  const data = await res.json()
  if (!res.ok || !data.success) throw new Error(data.error || 'Failed to generate email')
  return data
}

export async function fetchInbox(email, password) {
  const res = await fetch(`${API_BASE}/inbox`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch inbox')
  return data
}

export async function deleteEmail(email) {
  const res = await fetch(`${API_BASE}/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete email')
  return data
}

export function escapeHtml(text) {
  if (!text) return ''
  const d = document.createElement('div')
  d.textContent = text
  return d.innerHTML
}

export function formatRelativeTime(dateString) {
  if (!dateString) return ''
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return ''
  }
}

export function formatFullDate(dateString) {
  if (!dateString) return ''
  try {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a')
  } catch {
    return ''
  }
}

const SESSION_KEY = 'tempEmail2Session'
const MSGS_KEY = 'tempEmail2Messages'

function encode(str) {
  if (!str) return ''
  try { return btoa(str) } catch { return str }
}

function decode(str) {
  if (!str) return ''
  try { return atob(str) } catch { return str }
}

export function saveSession(email, password, expiresAt) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, password: encode(password), expiresAt, ts: Date.now() }))
}

export function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (s && s.ts > Date.now() - 30 * 60 * 1000) {
      return { ...s, password: decode(s.password) }
    }
    clearSession()
  } catch { clearSession() }
  return null
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(MSGS_KEY)
}

export function saveCachedMessages(email, messages) {
  localStorage.setItem(MSGS_KEY, JSON.stringify({ email, messages }))
}

export function loadCachedMessages(email) {
  try {
    const d = JSON.parse(localStorage.getItem(MSGS_KEY))
    return d?.email === email ? d.messages : []
  } catch { return [] }
}
