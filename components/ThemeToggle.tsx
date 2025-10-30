'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hindari mismatch: render ikon hanya setelah komponen mount di client
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Placeholder aman saat SSR (tanpa ikon dinamis)
    return (
      <button aria-label="Toggle theme" className="btn-outline flex items-center gap-2">
        <span className="hidden sm:inline">Theme</span>
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="btn-outline flex items-center gap-2"
      suppressHydrationWarning
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
