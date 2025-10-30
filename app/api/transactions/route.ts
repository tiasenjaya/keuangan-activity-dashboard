import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET & POST kamu tetap...
export async function GET() {
  const data = await prisma.transaction.findMany({
    include: { category: true },
    orderBy: { date: 'desc' },
    take: 100,
  })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { date, kind, categoryId, type, amount, notes, isTracked, trackingLabel } = body
  if (!date || !['INCOME', 'EXPENSE'].includes(kind) || typeof amount !== 'number') {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }
  const created = await prisma.transaction.create({
    data: {
      date: new Date(date),
      kind,
      categoryId,
      type,
      amount,
      notes,
      isTracked: !!isTracked,
      trackingLabel,
    },
  })
  return NextResponse.json(created)
}

// NEW: reset semua flag tracking
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (body?.action === 'resetTracking') {
    await prisma.transaction.updateMany({ data: { isTracked: false, trackingLabel: null } })
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// NEW: hapus semua transaksi (full reset)
export async function DELETE(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (body?.all === true) {
    await prisma.transaction.deleteMany()
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Specify {all:true}' }, { status: 400 })
}
