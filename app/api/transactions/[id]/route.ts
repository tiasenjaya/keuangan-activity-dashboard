// app/api/transactions/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// PATCH /api/transactions/[id] — partial update
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const txId = Number(id)
    if (!txId) {
      return NextResponse.json({ error: 'id tidak valid' }, { status: 400 })
    }

    const body = await req.json().catch(() => ({} as any))

    const data: any = {}
    if (typeof body.kind === 'string' && body.kind.trim()) data.kind = body.kind.trim()
    if (body.date) data.date = new Date(body.date)
    if (Number.isInteger(body.categoryId)) data.categoryId = body.categoryId
    if (body.categoryId === null) data.categoryId = null
    if (typeof body.type === 'string' && body.type.trim()) data.type = body.type.trim()
    if (typeof body.amount === 'number') data.amount = body.amount
    if (typeof body.notes === 'string') data.notes = body.notes
    if (typeof body.isTracked === 'boolean') data.isTracked = body.isTracked
    if (typeof body.trackingLabel === 'string') data.trackingLabel = body.trackingLabel

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'tidak ada field yang diupdate' }, { status: 400 })
    }

    const updated = await prisma.transaction.update({
      where: { id: txId },
      data,
    })

    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'unknown error' }, { status: 500 })
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const txId = Number(id)
    if (!txId) {
      return NextResponse.json({ error: 'id tidak valid' }, { status: 400 })
    }

    await prisma.transaction.delete({ where: { id: txId } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'unknown error' }, { status: 500 })
  }
}
