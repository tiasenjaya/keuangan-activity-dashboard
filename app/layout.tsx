// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Keuangan + Daily Activity',
  description: 'Personal finance & activity tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex">
            <aside className="w-64 bg-white/70 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-4 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold">Menu</div>
                <ThemeToggle />
              </div>
              <nav className="space-y-2 text-sm">
                <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/">📊 Dashboard</Link>
                <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/transactions">🧾 Catat Transaksi</Link>
                <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/categories">📁 Kelola Kategori</Link>
                <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/tracking">📍 Tracking Pengeluaran</Link>
                <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/activities">🗓️ Aktivitas Harian</Link>
                <Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/reports">📤 Laporan & Export</Link>
              </nav>
            </aside>

            <main className="flex-1 p-6 space-y-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
