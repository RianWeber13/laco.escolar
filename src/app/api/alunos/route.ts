import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const alunoSchema = z.object({
  nome: z.string().min(2),
  turmaId: z.string(),
  responsavelId: z.string(),
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
  if (!user || user.role !== 'PROFESSOR') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const data = await req.json();
  const parsed = alunoSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { nome, turmaId, responsavelId } = parsed.data;
  // Verifica se o professor está atribuído à turma
  const turma = await prisma.turma.findUnique({
    where: { id: turmaId },
    include: { professores: true },
  });
  if (!turma || !turma.professores.some((p) => p.id === user.id)) {
    return NextResponse.json({ error: 'Você não pode cadastrar alunos nesta turma.' }, { status: 403 });
  }
  const aluno = await prisma.aluno.create({
    data: {
      nome,
      turmaId,
      responsavelId,
    },
    include: { turma: true, responsavel: true },
  });
  return NextResponse.json({ aluno }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const turmaId = req.nextUrl.searchParams.get('turmaId');
  const nome = req.nextUrl.searchParams.get('nome');
  const responsavelId = req.nextUrl.searchParams.get('responsavelId');
  if (!turmaId) {
    return NextResponse.json({ error: 'turmaId é obrigatório.' }, { status: 400 });
  }
  let where: any = { turmaId };
  if (nome) where.nome = { contains: nome, mode: 'insensitive' };
  if (responsavelId) where.responsavelId = responsavelId;
  // Professor só vê alunos das suas turmas, responsável só vê alunos dos filhos
  let alunos;
  if (user.role === 'PROFESSOR') {
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: { professores: true },
    });
    if (!turma || !turma.professores.some((p) => p.id === user.id)) {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }
    alunos = await prisma.aluno.findMany({
      where,
      include: { responsavel: true },
    });
  } else if (user.role === 'RESPONSAVEL') {
    alunos = await prisma.aluno.findMany({
      where: { ...where, responsavelId: user.id },
      include: { responsavel: true },
    });
  } else {
    // Diretor e coordenador podem ver todos
    alunos = await prisma.aluno.findMany({
      where,
      include: { responsavel: true },
    });
  }
  return NextResponse.json({ alunos });
} 