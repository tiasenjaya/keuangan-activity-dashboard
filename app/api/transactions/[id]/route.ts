import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const body = await req.json()
  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      isTracked: !!body.isTracked,
      trackingLabel: body.trackingLabel ?? null,
    },
  })
  return NextResponse.json(updated)
}

// NEW: hapus 1 transaksi
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  await prisma.transaction.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
