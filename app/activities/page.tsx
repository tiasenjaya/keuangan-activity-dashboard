'use client'
import useSWR from 'swr'
const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function Page() {
  const { data: acts, mutate } = useSWR('/api/activities', fetcher)

  async function submit(form: FormData) {
    const body = {
      date: String(form.get('date')),
      title: String(form.get('title')),
      description: String(form.get('description') || ''),
      status: String(form.get('status') || 'TODO'),
      durationMinutes: Number(form.get('duration') || 0),
      tags: String(form.get('tags') || ''),
    }
    await fetch('/api/activities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    ;(document.getElementById('act-form') as HTMLFormElement).reset()
    mutate()
  }

  async function setStatus(id: number, status: string) {
    await fetch(`/api/activities/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    mutate()
  }

  async function remove(id: number) {
    await fetch(`/api/activities/${id}`, { method: 'DELETE' })
    mutate()
  }

  return (
    <div className="space-y-6">
      <h1 className="h1">Aktivitas Harian</h1>
      <form
        id="act-form"
        action={submit}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div><div className="label">Tanggal</div><input className="input" name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} /></div>
        <div><div className="label">Judul</div><input className="input" name="title" /></div>
        <div><div className="label">Status</div>
          <select className="input" name="status" defaultValue="TODO">
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div className="md:col-span-3"><div className="label">Deskripsi</div><input className="input" name="description" /></div>
        <div><div className="label">Durasi (menit)</div><input className="input" name="duration" type="number" min={0} step={5} /></div>
        <div><div className="label">Tags</div><input className="input" name="tags" placeholder="mis: olahraga, kerja" /></div>
        <div className="md:col-span-3"><button className="btn" type="submit">Simpan</button></div>
      </form>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="h2 mb-3">Daftar Aktivitas</div>
        <table className="table">
          <thead><tr><th>Tanggal</th><th>Judul</th><th>Status</th><th>Durasi</th><th>Tags</th><th></th></tr></thead>
          <tbody>
            {acts?.map((a: any) => (
              <tr key={a.id}>
                <td>{new Date(a.date).toISOString().slice(0,10)}</td>
                <td>{a.title}</td>
                <td>
                  <select className="input" defaultValue={a.status} onChange={(e) => setStatus(a.id, e.target.value)}>
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>
                <td>{a.durationMinutes || 0} mnt</td>
                <td>{a.tags || ''}</td>
                <td className="text-right">
                  <button className="btn-outline" onClick={() => remove(a.id)}>Hapus</button>
                </td>
              </tr>
            ))}
            {!acts?.length && <tr><td colSpan={6} className="text-slate-500">Belum ada aktivitas.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
