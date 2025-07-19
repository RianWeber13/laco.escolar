import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const responsavelSchema = z.object({ nome: z.string().min(3).optional(), telefone: z.string().min(8).optional() });

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const token = auth.replace('Bearer ', '');
    return jwt.verify(token, JWT_SECRET) as { id: string, role: string };
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user || (user.role !== 'DIRETOR' && user.role !== 'COORDENADOR' && user.role !== 'PROFESSOR')) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const { id } = params;
  const data = await req.json();
  const parsed = responsavelSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.user.update({ where: { id, role: 'RESPONSAVEL' }, data: parsed.data });
  return NextResponse.json({ responsavel: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user || (user.role !== 'DIRETOR' && user.role !== 'COORDENADOR' && user.role !== 'PROFESSOR')) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const { id } = params;
  await prisma.user.delete({ where: { id, role: 'RESPONSAVEL' } });
  return NextResponse.json({ message: 'Responsável removido com sucesso.' });
} 