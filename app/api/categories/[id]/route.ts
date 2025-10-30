export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }   // ⮜ params adalah Promise
) {
  try {
    const { id: idStr } = await ctx.params;   // ⮜ await dulu
    const id = Number(idStr);

    const raw = await req.text();
    console.log('PATCH /api/categories/[id] -> id =', id);
    console.log('RAW BODY =', raw);

    let body: any = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { body = {}; }

    const data: any = {};
    if (typeof body.name === 'string' && body.name.trim() !== '') data.name = body.name.trim();
    if (typeof body.type === 'string' && body.type.trim() !== '') data.kind = body.type as 'INCOME' | 'EXPENSE' | 'BOTH';
    if (typeof body.kind === 'string' && body.kind.trim() !== '') data.kind = body.kind as 'INCOME' | 'EXPENSE' | 'BOTH';

    if (!id || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'id atau field update kosong' }, { status: 400 });
    }

    const updated = await prisma.category.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

