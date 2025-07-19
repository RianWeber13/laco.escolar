import { NextResponse } from 'next/server';

export async function POST() {
  // Em sistemas JWT stateless, o logout é feito apenas no frontend removendo o token.
  // Aqui apenas retornamos sucesso.
  return NextResponse.json({ message: 'Logout realizado com sucesso.' }, { status: 200 });
} 