import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const alunoSchema = z.object({ nome: z.string().min(2).optional(), responsavelId: z.string().optional() });

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
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const { id } = params;
  const aluno = await prisma.aluno.findUnique({ where: { id }, include: { turma: { include: { professores: true } } } });
  if (!aluno) {
    return NextResponse.json({ error: 'Aluno não encontrado.' }, { status: 404 });
  }
  if (
    user.role !== 'DIRETOR' &&
    user.role !== 'COORDENADOR' &&
    !(user.role === 'PROFESSOR' && aluno.turma.professores.some((p) => p.id === user.id))
  ) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const data = await req.json();
  const parsed = alunoSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.aluno.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ aluno: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const { id } = params;
  const aluno = await prisma.aluno.findUnique({ where: { id }, include: { turma: { include: { professores: true } } } });
  if (!aluno) {
    return NextResponse.json({ error: 'Aluno não encontrado.' }, { status: 404 });
  }
  if (
    user.role !== 'DIRETOR' &&
    user.role !== 'COORDENADOR' &&
    !(user.role === 'PROFESSOR' && aluno.turma.professores.some((p) => p.id === user.id))
  ) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  await prisma.aluno.delete({ where: { id } });
  return NextResponse.json({ message: 'Aluno removido com sucesso.' });
} 