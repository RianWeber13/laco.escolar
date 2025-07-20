import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const turmaSchema = z.object({
  nome: z.string().min(2),
  professoresIds: z.array(z.string()).optional(),
});

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

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || (user.role !== 'DIRETOR' && user.role !== 'COORDENADOR')) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const data = await req.json();
  const parsed = turmaSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { nome, professoresIds } = parsed.data;
  const turma = await prisma.turma.create({
    data: {
      nome,
      professores: professoresIds && professoresIds.length > 0 ? {
        connect: professoresIds.map((id: string) => ({ id }))
      } : undefined,
    },
    include: { professores: true }
  });
  return NextResponse.json({ turma }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const nome = req.nextUrl.searchParams.get('nome');
  const professorId = req.nextUrl.searchParams.get('professorId');
  const alunoId = req.nextUrl.searchParams.get('alunoId');
  // Diretor e coordenador veem todas, professor só as suas
  let where: any = {};
  if (nome) where.nome = { contains: nome, mode: 'insensitive' };
  if (professorId) where.professores = { some: { id: professorId } };
  if (alunoId) where.alunos = { some: { id: alunoId } };
  let turmas;
  if (user.role === 'DIRETOR' || user.role === 'COORDENADOR') {
    turmas = await prisma.turma.findMany({ where, include: { professores: true, alunos: true } });
  } else if (user.role === 'PROFESSOR') {
    where.professores = { some: { id: user.id } };
    turmas = await prisma.turma.findMany({
      where,
      include: { professores: true, alunos: true }
    });
  } else {
    // Responsável não pode listar turmas
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  return NextResponse.json({ turmas });
} 