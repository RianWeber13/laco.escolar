import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user || (user.role !== 'DIRETOR' && user.role !== 'COORDENADOR')) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const { id } = params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
  }
  if (user.role === 'COORDENADOR' && target.role === 'DIRETOR') {
    return NextResponse.json({ error: 'Coordenador não pode remover diretor.' }, { status: 403 });
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: 'Usuário removido com sucesso.' });
} 