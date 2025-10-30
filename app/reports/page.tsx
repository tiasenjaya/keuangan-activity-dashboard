'use client'
import useSWR from 'swr'
import { useMemo, useState } from 'react'
const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function Page() {
  const { data: tx } = useSWR('/api/transactions', fetcher)

  const [from, setFrom] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10))
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0,10))
  const [kind, setKind] = useState<'ALL'|'INCOME'|'EXPENSE'>('ALL')

  const filtered = useMemo(() => {
    const f = (tx || []).filter((t: any) => {
      const d = new Date(t.date).toISOString().slice(0,10)
      const passDate = (!from || d >= from) && (!to || d <= to)
      const passKind = kind === 'ALL' ? true : t.kind === kind
      return passDate && passKind
    })
    return f
  }, [tx, from, to, kind])

  const byCat = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of filtered) {
      const key = `${r.kind}|${r.category?.name || '(Tidak ada)'}`
      m.set(key, (m.get(key) || 0) + r.amount)
    }
    return Array.from(m.entries()).map(([k, v]) => {
      const [knd, cat] = k.split('|')
      return { kind: knd, category: cat, amount: v }
    }).sort((a,b) => a.kind.localeCompare(b.kind) || b.amount - a.amount)
  }, [filtered])

  function downloadCSV() {
    const rows = [['date','kind','category','type','amount','notes']]
    for (const r of filtered) rows.push([
      new Date(r.date).toISOString().slice(0,10),
      r.kind, r.category?.name || '', r.type || '', String(r.amount), r.notes || ''
    ])
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'transaksi.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const totalIn = filtered.filter((r:any)=>r.kind==='INCOME').reduce((a:number,b:any)=>a+b.amount,0)
  const totalOut = filtered.filter((r:any)=>r.kind==='EXPENSE').reduce((a:number,b:any)=>a+b.amount,0)

  return (
    <div className="space-y-6">
      <h1 className="h1">Laporan & Export</h1>

      <div className="container-card grid grid-cols-1 md:grid-cols-4 gap-4">
        <div><div className="label">Dari</div><input className="input" type="date" value={from} onChange={(e)=>setFrom(e.target.value)} /></div>
        <div><div className="label">Sampai</div><input className="input" type="date" value={to} onChange={(e)=>setTo(e.target.value)} /></div>
        <div><div className="label">Jenis</div>
          <select className="input" value={kind} onChange={(e)=>setKind(e.target.value as any)}>
            <option value="ALL">Semua</option>
            <option value="INCOME">Pemasukan</option>
            <option value="EXPENSE">Pengeluaran</option>
          </select>
        </div>
        <div className="flex items-end"><button className="btn" onClick={downloadCSV}>⬇️ Export CSV</button></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="container-card"><div className="label">Total Pemasukan</div><div className="kpi">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(totalIn)}</div></div>
        <div className="container-card"><div className="label">Total Pengeluaran</div><div className="kpi">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(totalOut)}</div></div>
        <div className="container-card"><div className="label">Saldo</div><div className="kpi">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(totalIn-totalOut)}</div></div>
      </div>

      <div className="container-card">
        <div className="h2 mb-3">Ringkas per Kategori</div>
        <table className="table">
          <thead><tr><th>Jenis</th><th>Kategori</th><th>Jumlah</th></tr></thead>
          <tbody>
            {byCat.map((r:any,i:number)=>(
              <tr key={i}>
                <td>{r.kind==='INCOME'?'Pemasukan':'Pengeluaran'}</td>
                <td>{r.category}</td>
                <td>{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(r.amount)}</td>
              </tr>
            ))}
            {!byCat.length && <tr><td colSpan={3} className="text-slate-500">Belum ada data.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
