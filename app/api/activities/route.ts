import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export async function GET(){
  const data = await prisma.activity.findMany({ orderBy: { date: 'desc' }, take: 100 })
  return NextResponse.json(data)
}
export async function POST(req: Request){
  const b = await req.json()
  if(!b.date || !b.title) return NextResponse.json({ error:'Invalid' }, { status: 400 })
  const created = await prisma.activity.create({ data: {
    date: new Date(b.date), title: b.title, description: b.description, status: b.status, durationMinutes: b.durationMinutes, tags: b.tags
  }})
  return NextResponse.json(created)
}
