// app/api/activities/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// ⬇️ Ubah signature: params jadi Promise, request pakai NextRequest
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({} as any))

  const data: any = {}
  if (typeof body.title === 'string') data.title = body.title
  if (typeof body.description === 'string') data.description = body.description
  if (typeof body.status === 'string') data.status = body.status
  if (typeof body.durationMinutes === 'number') data.durationMinutes = body.durationMinutes
  if (typeof body.tags === 'string') data.tags = body.tags
  if (typeof body.date === 'string' || body.date instanceof Date) data.date = new Date(body.date)

  const updated = await prisma.activity.update({
    where: { id: Number(id) },
    data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.activity.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}