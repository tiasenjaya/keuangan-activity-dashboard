'use client'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import useSWR from 'swr'

const fetcher = (u: string) => fetch(u, { cache: 'no-store' }).then(r => r.json())
const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })

export default function Page() {
  const { data } = useSWR('/api/summary', fetcher, { revalidateOnFocus: false })
  const s = data ?? { income: 0, expense: 0, saldo: 0 }

  return (
    <div className="space-y-6">
      <h1 className="h1">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="container-card">
          <div className="text-sm">Total Pemasukan</div>
          <div className="kpi">{idr.format(s.income)}</div>
        </div>
        <div className="container-card">
          <div className="text-sm">Total Pengeluaran</div>
          <div className="kpi">{idr.format(s.expense)}</div>
        </div>
        <div className="container-card">
          <div className="text-sm">Saldo</div>
          <div className="kpi">{idr.format(s.saldo)}</div>
        </div>
      </div>
    </div>
  )
}
