'use client'

import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'

const fetcher = (u: string) => fetch(u).then(r => r.json())

function CategoryRow({ cat }: { cat: any }) {
  const { mutate } = useSWRConfig()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState<string>(cat.name)
  // kolom di DB = `kind`, tapi API PATCH menerima `type`
  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'BOTH'>(cat.kind)

  async function save() {
    await fetch(`/api/categories/${cat.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type }),
    })
    setEditing(false)
    await mutate('/api/categories') // refresh daftar dari cache SWR
  }

  async function remove() {
    await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
    await mutate('/api/categories')
  }

  if (editing) {
    return (
      <tr>
        <td>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </td>
        <td>
          <select className="input" value={type} onChange={e => setType(e.target.value as any)}>
            <option value="INCOME">Pemasukan</option>
            <option value="EXPENSE">Pengeluaran</option>
            <option value="BOTH">Keduanya</option>
          </select>
        </td>
        <td className="text-right space-x-2">
          <button className="btn" onClick={save}>Simpan</button>
          <button
            className="btn-outline"
            onClick={() => { setEditing(false); setName(cat.name); setType(cat.kind); }}
          >
            Batal
          </button>
          <button className="btn-outline" onClick={remove}>Hapus</button>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{cat.name}</td>
      <td>
        {cat.kind === 'INCOME' ? 'Pemasukan' :
         cat.kind === 'EXPENSE' ? 'Pengeluaran' : 'Keduanya'}
      </td>
      <td className="text-right space-x-2">
        <button className="btn-outline" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn-outline" onClick={remove}>Hapus</button>
      </td>
    </tr>
  )
}

export default function Page() {
  const { data: categories, mutate } = useSWR('/api/categories', fetcher)

  async function submit(form: FormData) {
    const body = {
      name: String(form.get('name') || ''),
      kind: String(form.get('kind') || 'EXPENSE'), // 'INCOME'|'EXPENSE'|'BOTH'
    }
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    ;(document.getElementById('cat-form') as HTMLFormElement).reset()
    await mutate()
  }

  return (
    <div className="space-y-6">
      <h1 className="h1">Kelola Kategori</h1>

      <form id="cat-form" action={submit} className="container-card grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="label">Nama kategori</div>
          <input name="name" className="input" placeholder="mis: Makan/Minum" />
        </div>
        <div>
          <div className="label">Jenis</div>
          <select name="kind" className="input" defaultValue="EXPENSE">
            <option value="EXPENSE">Pengeluaran</option>
            <option value="INCOME">Pemasukan</option>
            <option value="BOTH">Keduanya</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="btn" type="submit">Tambah</button>
        </div>
      </form>

      <div className="container-card">
        <div className="h2 mb-3">Daftar Kategori</div>
        <table className="table">
          <thead>
            <tr><th>Nama</th><th>Jenis</th><th></th></tr>
          </thead>
          <tbody>
            {categories?.map((c: any) => <CategoryRow key={c.id} cat={c} />)}
            {!categories?.length && (
              <tr><td colSpan={3} className="text-slate-500">Belum ada kategori.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
