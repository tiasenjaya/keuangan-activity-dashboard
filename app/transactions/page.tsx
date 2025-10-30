'use client'

import useSWR from 'swr'
import CurrencyInput from '@/components/CurrencyInput'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Page() {
  // Ambil kategori & transaksi terbaru
  const { data: categories } = useSWR('/api/categories', fetcher)
  const { data: recent, mutate } = useSWR('/api/transactions', fetcher)

  // Jenis transaksi sebagai string union (bukan enum Prisma)
  const [jenis, setJenis] = useState<'INCOME' | 'EXPENSE'>('INCOME')
  const [amount, setAmount] = useState<number>(0)

  // Tampilkan kategori sesuai jenis + yang 'BOTH'
  const cats = (categories || []).filter(
    (c: any) => c.kind === jenis || c.kind === 'BOTH'
  )

  // Submit form
  async function submit(form: FormData) {
    const body = {
      date: String(form.get('date')),
      kind: jenis, // 'INCOME' | 'EXPENSE'
      categoryId: form.get('categoryId') ? Number(form.get('categoryId')) : null,
      type: String(form.get('type') || ''),
      amount,
      notes: String(form.get('notes') || ''),
      isTracked: !!form.get('track'),
      trackingLabel: String(form.get('trackLabel') || '')
    }

    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    ;(document.getElementById('tx-form') as HTMLFormElement).reset()
    setAmount(0)
    mutate()
  }

  return (
    <div className="space-y-6">
      <h1 className="h1">Catat Transaksi</h1>

      <form id="tx-form" action={submit} className="container-card grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="label">Tanggal</div>
          <input className="input" name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} />
        </div>

        <div>
          <div className="label">Kategori</div>
          <select className="input" name="categoryId" defaultValue="">
            <option value="">(Tidak ada)</option>
            {cats?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="label">Jumlah (Rp)</div>
          <CurrencyInput value={amount} onChange={setAmount} />
        </div>

        <div>
          <div className="label">Jenis</div>
          <select
            className="input"
            value={jenis}
            onChange={(e) => setJenis(e.target.value as 'INCOME' | 'EXPENSE')}
          >
            <option value="INCOME">Pemasukan</option>
            <option value="EXPENSE">Pengeluaran</option>
          </select>
        </div>

        <div>
          <div className="label">Jenis/Metode (opsional)</div>
          <input className="input" name="type" placeholder="mis: tunai, debit, e-wallet" />
        </div>

        <div>
          <div className="label">Catatan (opsional)</div>
          <input className="input" name="notes" placeholder="mis: beli kopi, gaji bulan Okt" />
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <input id="track" name="track" type="checkbox" />
          <label htmlFor="track">Tandai untuk Tracking?</label>
          <input className="input ml-4" name="trackLabel" placeholder="Nama Tracking (opsional)" />
        </div>

        <div className="md:col-span-3">
          <button className="btn" type="submit">Simpan</button>
        </div>
      </form>

      <div className="container-card">
        <div className="h2 mb-3">Riwayat Terbaru</div>
        <table className="table">
          <thead>
            <tr><th>Tanggal</th><th>Jenis</th><th>Kategori</th><th>Jumlah</th><th>Catatan</th></tr>
          </thead>
          <tbody>
            {recent?.map((r: any) => (
              <tr key={r.id}>
                <td>{new Date(r.date).toISOString().slice(0,10)}</td>
                <td>{r.kind === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}</td>
                <td>{r.category?.name || '-'}</td>
                <td>{new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(r.amount)}</td>
                <td>{r.notes || ''}</td>
              </tr>
            ))}
            {!recent?.length && (
              <tr><td colSpan={5} className="text-slate-500">Belum ada transaksi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
