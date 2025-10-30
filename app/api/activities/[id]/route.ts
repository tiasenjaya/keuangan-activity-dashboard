import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const b = await req.json()
  const updated = await prisma.activity.update({
    where: { id },
    data: {
      title: b.title,
      description: b.description,
      status: b.status,
      durationMinutes: b.durationMinutes,
      tags: b.tags,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.activity.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
