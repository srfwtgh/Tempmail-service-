export default function Header() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass mb-5">
        <svg className="w-7 h-7 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          Temp Mail
        </span>
      </h1>
      <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide uppercase">
        Disposable Email Service
      </p>
    </div>
  )
}
