import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const responsavelSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  cpf: z.string().regex(/^\d{11}$/),
  telefone: z.string().min(8),
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
  if (!user || (user.role !== 'DIRETOR' && user.role !== 'COORDENADOR' && user.role !== 'PROFESSOR')) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const data = await req.json();
  const parsed = responsavelSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { nome, email, senha, cpf, telefone } = parsed.data;
  // Verifica unicidade de email e cpf
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { cpf }] }
  });
  if (exists) {
    return NextResponse.json({ error: 'Email ou CPF já cadastrado.' }, { status: 409 });
  }
  const responsavel = await prisma.user.create({
    data: {
      nome,
      email,
      senha, // Em produção, use hash!
      cpf,
      telefone,
      role: 'RESPONSAVEL',
      createdById: user.id,
    },
  });
  return NextResponse.json({ responsavel: { id: responsavel.id, nome: responsavel.nome, email: responsavel.email } }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 401 });
  }
  const nome = req.nextUrl.searchParams.get('nome');
  const email = req.nextUrl.searchParams.get('email');
  const cpf = req.nextUrl.searchParams.get('cpf');
  // Diretor, coordenador e professor podem listar todos, responsável só vê a si mesmo
  let where: any = { role: 'RESPONSAVEL' };
  if (nome) where.nome = { contains: nome, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (cpf) where.cpf = { contains: cpf };
  let responsaveis;
  if (user.role === 'RESPONSAVEL') {
    responsaveis = await prisma.user.findMany({ where: { ...where, id: user.id } });
  } else {
    responsaveis = await prisma.user.findMany({ where });
  }
  return NextResponse.json({ responsaveis });
} 