import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const mensagemSchema = z.object({
  texto: z.string().min(1),
  turmaId: z.string(),
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
  const parsed = mensagemSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { texto, turmaId } = parsed.data;
  // Verifica se o professor está atribuído à turma
  const turma = await prisma.turma.findUnique({
    where: { id: turmaId },
    include: { professores: true },
  });
  if (!turma || !turma.professores.some((p) => p.id === user.id)) {
    return NextResponse.json({ error: 'Você não pode enviar mensagens para esta turma.' }, { status: 403 });
  }
  const mensagem = await prisma.mensagem.create({
    data: {
      texto,
      turmaId,
      autorId: user.id,
    },
    include: { turma: true, autor: true },
  });
  return NextResponse.json({ mensagem }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const turmaId = req.nextUrl.searchParams.get('turmaId');
  const texto = req.nextUrl.searchParams.get('texto');
  const autorId = req.nextUrl.searchParams.get('autorId');
  const dataInicio = req.nextUrl.searchParams.get('dataInicio');
  const dataFim = req.nextUrl.searchParams.get('dataFim');
  if (!turmaId) {
    return NextResponse.json({ error: 'turmaId é obrigatório.' }, { status: 400 });
  }
  // Professor só vê mensagens das suas turmas, responsável só vê mensagens das turmas dos filhos
  let turma;
  if (user.role === 'PROFESSOR') {
    turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: { professores: true },
    });
    if (!turma || !turma.professores.some((p) => p.id === user.id)) {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }
  } else if (user.role === 'RESPONSAVEL') {
    const aluno = await prisma.aluno.findFirst({ where: { turmaId, responsavelId: user.id } });
    if (!aluno) {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }
  } else if (user.role !== 'DIRETOR' && user.role !== 'COORDENADOR') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  let where: any = { turmaId };
  if (texto) where.texto = { contains: texto, mode: 'insensitive' };
  if (autorId) where.autorId = autorId;
  if (dataInicio || dataFim) {
    where.data = {};
    if (dataInicio) where.data.gte = new Date(dataInicio);
    if (dataFim) where.data.lte = new Date(dataFim);
  }
  const mensagens = await prisma.mensagem.findMany({
    where,
    include: { autor: true },
    orderBy: { data: 'desc' },
  });
  return NextResponse.json({ mensagens });
} 