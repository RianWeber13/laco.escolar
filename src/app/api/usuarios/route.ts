import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const updateUserSchema = z.object({
  nome: z.string().min(3).optional(),
  telefone: z.string().min(8).optional(),
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

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const role = req.nextUrl.searchParams.get('role');
  const nome = req.nextUrl.searchParams.get('nome');
  const email = req.nextUrl.searchParams.get('email');
  const cpf = req.nextUrl.searchParams.get('cpf');
  // Diretor vê todos, coordenador vê todos exceto diretores, professor vê só responsáveis e alunos, responsável não pode listar
  let where: any = {};
  if (role) where.role = role;
  if (nome) where.nome = { contains: nome, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (cpf) where.cpf = { contains: cpf };
  if (user.role === 'DIRETOR') {
    // vê todos
  } else if (user.role === 'COORDENADOR') {
    where.role = { not: 'DIRETOR' };
  } else if (user.role === 'PROFESSOR') {
    where.role = { in: ['RESPONSAVEL'] };
  } else {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const usuarios = await prisma.user.findMany({ where, select: { id: true, nome: true, email: true, role: true, telefone: true, cpf: true } });
  return NextResponse.json({ usuarios });
}

export async function PATCH(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const data = await req.json();
  const parsed = updateUserSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
    select: { id: true, nome: true, email: true, role: true, telefone: true, cpf: true },
  });
  return NextResponse.json({ usuario: updated });
} 