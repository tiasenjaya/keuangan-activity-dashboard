'use client'
import useSWR from 'swr'
import { useMemo, useState } from 'react'
const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function Page() {
  const { data: tx, mutate } = useSWR('/api/transactions', fetcher)

  // Hanya yang expense & sedang di-track
  const tracked = useMemo(
    () => (tx || []).filter((t: any) => t.kind === 'EXPENSE' && t.isTracked),
    [tx]
  )

  const [pickedId, setPickedId] = useState<number | null>(null)
  const selected = tracked.find((t: any) => t.id === pickedId) || null
  const daysSince =
    selected ? Math.floor((Date.now() - new Date(selected.date).getTime()) / 86400000) : null

  async function untrack(id: number) {
    if (!confirm('Batalkan tracking transaksi ini?')) return
    await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isTracked: false, trackingLabel: null }),
    })
    setPickedId(null)
    mutate()
  }

  async function removeTx(id: number) {
    if (!confirm('Hapus transaksi ini secara permanen?')) return
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    setPickedId(null)
    mutate()
  }

  async function resetAllTracking() {
    if (!confirm('Reset semua status tracking?')) return
    await fetch('/api/transactions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resetTracking' }),
    })
    setPickedId(null)
    mutate()
  }

  async function purgeAll() {
    if (!confirm('HAPUS SEMUA transaksi? Tindakan ini tidak bisa dibatalkan.')) return
    if (!confirm('Yakin 100%?')) return
    await fetch('/api/transactions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
    setPickedId(null)
    mutate()
  }

  return (
    <div className="space-y-6">
      <h1 className="h1">Tracking Pengeluaran</h1>

      <div className="container-card">
        <div className="label mb-2">Pilih yang sedang di-track</div>
        <select
          className="input"
          value={pickedId ?? ''}
          onChange={(e) => setPickedId(Number(e.target.value) || null)}
        >
          <option value="">(Pilih)</option>
          {tracked.map((r: any) => (
            <option key={r.id} value={r.id}>
              #{r.id} • {new Date(r.date).toISOString().slice(0, 10)} • {r.category?.name || '-'} • Rp{' '}
              {new Intl.NumberFormat('id-ID').format(r.amount)}
            </option>
          ))}
        </select>

        {selected && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="container-card">
              <div className="label">Tanggal</div>
              <div className="kpi">{new Date(selected.date).toISOString().slice(0, 10)}</div>
            </div>
            <div className="container-card">
              <div className="label">Kategori</div>
              <div className="kpi">{selected.category?.name || '-'}</div>
            </div>
            <div className="container-card">
              <div className="label">Jumlah</div>
              <div className="kpi">Rp {new Intl.NumberFormat('id-ID').format(selected.amount)}</div>
            </div>
          </div>
        )}

        {selected && (
          <div className="mt-4 flex items-center gap-2">
            <div className="label">Sudah berlalu</div>
            <div className="kpi">{daysSince} hari</div>
            <div className="flex-1" />
            <button className="btn-outline" onClick={() => untrack(selected.id)}>Untrack</button>
            <button className="btn-outline" onClick={() => removeTx(selected.id)}>Hapus</button>
          </div>
        )}
      </div>

      <div className="container-card">
        <div className="h2 mb-3">Semua yang Di-track</div>
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th><th>Label</th><th>Kategori</th><th>Jumlah</th><th>Hari</th><th></th>
            </tr>
          </thead>
          <tbody>
            {tracked.map((r: any) => {
              const d = new Date(r.date)
              const days = Math.floor((Date.now() - d.getTime()) / 86400000)
              return (
                <tr key={r.id}>
                  <td>{d.toISOString().slice(0, 10)}</td>
                  <td>{r.trackingLabel || '-'}</td>
                  <td>{r.category?.name || '-'}</td>
                  <td>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(r.amount)}
                  </td>
                  <td>{days} hari</td>
                  <td className="text-right">
                    <button className="btn-outline" onClick={() => untrack(r.id)}>Untrack</button>{' '}
                    <button className="btn-outline" onClick={() => removeTx(r.id)}>Hapus</button>
                  </td>
                </tr>
              )
            })}
            {!tracked.length && (
              <tr>
                <td colSpan={6} className="text-slate-500">Belum ada yang di-track.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex gap-2">
          <button className="btn-outline" onClick={resetAllTracking}>Reset Tracking</button>
          <button className="btn" onClick={purgeAll}>Hapus Semua Transaksi</button>
        </div>
      </div>
    </div>
  )
}
