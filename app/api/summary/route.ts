// app/api/summary/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const tx = await prisma.transaction.findMany({
      select: { kind: true, amount: true },
    })

    let income = 0, expense = 0
    for (const t of tx) {
      if (t.kind === 'INCOME') income += t.amount
      else if (t.kind === 'EXPENSE') expense += t.amount
    }

    return NextResponse.json({ income, expense, saldo: income - expense })
  } catch (e: any) {
    // --- DIAG: tampilkan info non-sensitif untuk bantu debug
    const url = process.env.DATABASE_URL || ''
    const diag = {
      nodeRuntime: true,
      dbHost: (() => { try { return new URL(url).host } catch { return null } })(),
      hasPooler: url.includes('-pooler'),
      hasChannelBindingParam: url.includes('channel_binding'),
      first30: url.slice(0, 30),
      msg: e?.message,
      name: e?.name,
    }
    console.error('SUMMARY_ERROR', diag)
    return NextResponse.json({ error: 'DB_INIT', diag }, { status: 500 })
  }
}
