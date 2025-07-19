import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const professoresSchema = z.object({
  professoresIds: z.array(z.string()).min(1)
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
  const parsed = professoresSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { professoresIds } = parsed.data;
  const turma = await prisma.turma.update({
    where: { id },
    data: {
      professores: {
        set: professoresIds.map((pid: string) => ({ id: pid }))
      }
    },
    include: { professores: true }
  });
  return NextResponse.json({ turma });
} 