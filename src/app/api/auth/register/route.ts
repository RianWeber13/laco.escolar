import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const userSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  cpf: z.string().regex(/^\d{11}$/),
  telefone: z.string().min(8),
  role: z.enum(['DIRETOR', 'COORDENADOR', 'PROFESSOR', 'RESPONSAVEL']),
  createdById: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parsed = userSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { nome, email, senha, cpf, telefone, role, createdById } = parsed.data;

    // Verifica unicidade de email e cpf
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { cpf }] }
    });
    if (exists) {
      return NextResponse.json({ error: 'Email ou CPF já cadastrado.' }, { status: 409 });
    }

    // TODO: Adicionar hash de senha (bcrypt) em produção
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha, // Em produção, use hash!
        cpf,
        telefone,
        role,
        createdById: createdById || null,
      },
    });
    return NextResponse.json({ user: { id: user.id, nome: user.nome, email: user.email, role: user.role } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao cadastrar usuário.' }, { status: 500 });
  }
} 