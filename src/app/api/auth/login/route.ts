// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Importe o bcrypt

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

async function ensureMasterUser() {
  const masterEmail = 'admin@master.com';
  const master = await prisma.user.findUnique({ where: { email: masterEmail } });
  if (!master) {
    // Criptografa a senha do usuário master
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        nome: 'Master Admin',
        email: masterEmail,
        senha: hashedPassword, // Salva a senha criptografada
        cpf: '00000000000',
        telefone: '000000000',
        role: 'DIRETOR',
      },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureMasterUser();
    const data = await req.json();
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { email, senha } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // Compara a senha enviada com a senha criptografada no banco
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return NextResponse.json({ error: 'Email ou senha inválidos.' }, { status: 401 });
    }

    // Gerar token JWT simples
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return NextResponse.json({
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
      token,
    });
  } catch {
    return NextResponse.json({ error: 'Erro ao autenticar.' }, { status: 500 });
  }
}