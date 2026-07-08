import { useState, useEffect, useRef, useCallback } from 'react'
import { Toaster, toast } from 'sonner'
import Navbar from './components/Navbar'
import EmailPanel from './components/EmailPanel'
import InboxView from './components/InboxView'
import QuickViewModal from './components/QuickViewModal'
import {
  generateEmail, fetchInbox, deleteEmail,
  saveSession, loadSession, clearSession,
  saveCachedMessages, loadCachedMessages,
} from './utils/tempEmailApi'

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('neoDarkMode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [messages, setMessages] = useState([])
  const [generating, setGenerating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [quickViewMsg, setQuickViewMsg] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('neoDarkMode', darkMode)
  }, [darkMode])

  useEffect(() => {
    const s = loadSession()
    if (s) {
      setEmail(s.email)
      setPassword(s.password || '')
      setMessages(loadCachedMessages(s.email))
    }
    const saved = localStorage.getItem('tempEmail2AutoRefresh')
    if (saved !== null) setAutoRefresh(saved === 'true')
  }, [])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (autoRefresh && email && password) {
      intervalRef.current = setInterval(() => refreshInbox(true), 10000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoRefresh, email, password])

  const refreshInbox = useCallback(async (silent = false) => {
    if (!email || !password) return
    if (!silent) setRefreshing(true)
    try {
      const data = await fetchInbox(email, password)
      if (data.success && data.emails) {
        setMessages(prev => {
          const merged = [...prev]
          data.emails.forEach(m => {
            const i = merged.findIndex(e => String(e.id) === String(m.id))
            i >= 0 ? merged[i] = m : merged.push(m)
          })
          saveCachedMessages(email, merged)
          return merged
        })
      }
    } catch (err) {
      if (err.message.includes('expired') || err.message.includes('not found')) {
        clearSession(); setEmail(''); setPassword(''); setMessages([])
        toast.error('Email expired')
      } else if (!silent) {
        toast.error(err.message)
      }
    } finally {
      if (!silent) setRefreshing(false)
    }
  }, [email, password])

  const handleGenerate = useCallback(async () => {
    setGenerating(true)
    setMessages([])
    const toastId = toast.loading('Creating your @pomailbox.com email...')
    try {
      const data = await generateEmail()
      setEmail(data.email)
      setPassword(data.password || '')
      saveSession(data.email, data.password, data.expiresAt)
      toast.success('Email generated successfully!', { id: toastId })
      refreshInbox(true)
    } catch (err) {
      toast.error(err.message, { id: toastId })
    } finally {
      setGenerating(false)
    }
  }, [refreshInbox])

  const handleCopy = useCallback(() => {
    if (!email) return
    navigator.clipboard.writeText(email)
      .then(() => toast.success('Email address copied!'))
      .catch(() => toast.error('Failed to copy'))
  }, [email])

  const handleDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete this email?')) return
    try { await deleteEmail(email) } catch { /* ignore */ }
    clearSession(); setEmail(''); setPassword(''); setMessages([])
    toast.success('Email deleted successfully')
  }, [email])

  const filteredMessages = searchQuery
    ? messages.filter(m =>
        (m.from && m.from.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : messages

  return (
    <div className="relative min-h-screen bg-neo">
      <Toaster
        theme={darkMode ? 'dark' : 'light'}
        position="top-center"
        richColors
        closeButton
        duration={2500}
        toastOptions={{
          className: 'neo-toast',
          style: {
            background: 'var(--neo-card)',
            border: '3px solid var(--neo-border)',
            boxShadow: '5px 5px 0 0 var(--neo-shadow)',
            color: 'var(--neo-text)',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />

      <div className="relative z-10 app-grid">
        <Navbar
          email={email}
          messageCount={messages.length}
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => {
            setAutoRefresh(prev => {
              const next = !prev
              localStorage.setItem('tempEmail2AutoRefresh', next)
              return next
            })
          }}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(p => !p)}
        />

        <EmailPanel
          email={email}
          generating={generating}
          refreshing={refreshing}
          onGenerate={handleGenerate}
          onCopy={handleCopy}
          onRefresh={() => refreshInbox(false)}
          onDelete={handleDelete}
          messageCount={messages.length}
        />

        <InboxView
          messages={filteredMessages}
          onQuickView={setQuickViewMsg}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <footer className="md:col-span-2 text-center text-xs py-3 lg:py-5 px-3 lg:px-6 neo-divider" style={{ color: 'var(--neo-text-muted)' }}>
          Emails auto-delete after 60 minutes &middot; No data stored &middot; Open source
        </footer>
      </div>

      <QuickViewModal
        message={quickViewMsg}
        onClose={() => setQuickViewMsg(null)}
      />
    </div>
  )
}
