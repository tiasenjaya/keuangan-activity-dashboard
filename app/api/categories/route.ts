export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const list = await prisma.category.findMany({
    orderBy: [{ name: 'asc' }],
  })
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  try {
    const { name, kind } = await req.json() as {
      name: string
      kind: 'INCOME' | 'EXPENSE' | 'BOTH'
    }
    if (!name || !kind) {
      return NextResponse.json({ error: 'name & kind wajib' }, { status: 400 })
    }
    const created = await prisma.category.create({ data: { name, kind } })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
