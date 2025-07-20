import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';


const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const roleSchema = z.object({
  role: z.enum(['DIRETOR', 'COORDENADOR', 'PROFESSOR', 'RESPONSAVEL'])
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user || (user.role !== 'DIRETOR' && user.role !== 'COORDENADOR')) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const { id } = params;
  const data = await req.json();
  const parsed = roleSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { role } = parsed.data;
  if (user.role === 'COORDENADOR' && role === 'DIRETOR') {
    return NextResponse.json({ error: 'Coordenador não pode promover para diretor.' }, { status: 403 });
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, nome: true, email: true, role: true },
  });
  return NextResponse.json({ usuario: updated });
} 