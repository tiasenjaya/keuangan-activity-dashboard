// app/api/summary/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  // Ambil minimal kolom yang dibutuhkan
  const tx = await prisma.transaction.findMany({
    select: { kind: true, amount: true },
  })

  let income = 0, expense = 0
  for (const t of tx) {
    if (t.kind === 'INCOME') income += t.amount
    else if (t.kind === 'EXPENSE') expense += t.amount
  }

  return NextResponse.json({ income, expense, saldo: income - expense })
}
