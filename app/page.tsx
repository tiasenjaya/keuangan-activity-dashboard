import { prisma } from '@/lib/prisma'
import { currencyIDR } from '@/lib/utils'
async function getSummary(){
  const tx = await prisma.transaction.findMany()
  const income = tx.filter(t=>t.kind==='INCOME').reduce((a,b)=>a+b.amount,0)
  const expense = tx.filter(t=>t.kind==='EXPENSE').reduce((a,b)=>a+b.amount,0)
  return { income, expense, saldo: income-expense }
}
export default async function Page(){
  const s = await getSummary()
  return (
    <div className="space-y-6">
      <h1 className="h1">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="container-card"><div className="text-sm text-slate-500">Total Pemasukan</div><div className="kpi">{currencyIDR.format(s.income)}</div></div>
        <div className="container-card"><div className="text-sm text-slate-500">Total Pengeluaran</div><div className="kpi">{currencyIDR.format(s.expense)}</div></div>
        <div className="container-card"><div className="text-sm text-slate-500">Saldo</div><div className="kpi">{currencyIDR.format(s.saldo)}</div></div>
      </div>
    </div>
  )
}
