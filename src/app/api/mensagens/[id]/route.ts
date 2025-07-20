import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const { id } = params;
  const mensagem = await prisma.mensagem.findUnique({ where: { id } });
  if (!mensagem) {
    return NextResponse.json({ error: 'Mensagem não encontrada.' }, { status: 404 });
  }
  if (
    user.role !== 'DIRETOR' &&
    user.role !== 'COORDENADOR' &&
    !(user.role === 'PROFESSOR' && mensagem.autorId === user.id)
  ) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  await prisma.mensagem.delete({ where: { id } });
  return NextResponse.json({ message: 'Mensagem removida com sucesso.' });
} 