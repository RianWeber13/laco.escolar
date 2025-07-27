import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.mensagem.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const senhaHash = await bcrypt.hash('123456', 10);

  // Diretor
  const diretor = await prisma.user.create({
    data: {
      nome: 'João Silva',
      email: 'joao.silva@escola.com',
      senha: senhaHash,
      cpf: '12345678901',
      telefone: '(11) 99999-1111',
      role: 'DIRETOR',
    },
  });

  // Coordenadores
  const coordenador1 = await prisma.user.create({
    data: {
      nome: 'Maria Santos',
      email: 'maria.santos@escola.com',
      senha: senhaHash,
      cpf: '12345678902',
      telefone: '(11) 99999-2222',
      role: 'COORDENADOR',
      createdById: diretor.id,
    },
  });

  const coordenador2 = await prisma.user.create({
    data: {
      nome: 'Pedro Oliveira',
      email: 'pedro.oliveira@escola.com',
      senha: senhaHash,
      cpf: '12345678903',
      telefone: '(11) 99999-3333',
      role: 'COORDENADOR',
      createdById: diretor.id,
    },
  });

  // Professores
  const professor1 = await prisma.user.create({
    data: {
      nome: 'Ana Costa',
      email: 'ana.costa@escola.com',
      senha: senhaHash,
      cpf: '12345678904',
      telefone: '(11) 99999-4444',
      role: 'PROFESSOR',
      createdById: coordenador1.id,
    },
  });

  const professor2 = await prisma.user.create({
    data: {
      nome: 'Carlos Ferreira',
      email: 'carlos.ferreira@escola.com',
      senha: senhaHash,
      cpf: '12345678905',
      telefone: '(11) 99999-5555',
      role: 'PROFESSOR',
      createdById: coordenador1.id,
    },
  });

  const professor3 = await prisma.user.create({
    data: {
      nome: 'Lucia Mendes',
      email: 'lucia.mendes@escola.com',
      senha: senhaHash,
      cpf: '12345678906',
      telefone: '(11) 99999-6666',
      role: 'PROFESSOR',
      createdById: coordenador2.id,
    },
  });

  // Responsáveis
  const responsavel1 = await prisma.user.create({
    data: {
      nome: 'Roberto Almeida',
      email: 'roberto.almeida@email.com',
      senha: senhaHash,
      cpf: '12345678907',
      telefone: '(11) 99999-7777',
      role: 'RESPONSAVEL',
      createdById: coordenador1.id,
    },
  });

  const responsavel2 = await prisma.user.create({
    data: {
      nome: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      senha: senhaHash,
      cpf: '12345678908',
      telefone: '(11) 99999-8888',
      role: 'RESPONSAVEL',
      createdById: coordenador1.id,
    },
  });

  const responsavel3 = await prisma.user.create({
    data: {
      nome: 'Marcos Souza',
      email: 'marcos.souza@email.com',
      senha: senhaHash,
      cpf: '12345678909',
      telefone: '(11) 99999-9999',
      role: 'RESPONSAVEL',
      createdById: coordenador2.id,
    },
  });

  const responsavel4 = await prisma.user.create({
    data: {
      nome: 'Patricia Rocha',
      email: 'patricia.rocha@email.com',
      senha: senhaHash,
      cpf: '12345678910',
      telefone: '(11) 99999-0000',
      role: 'RESPONSAVEL',
      createdById: coordenador2.id,
    },
  });

  // Criar turmas
  const turma1 = await prisma.turma.create({
    data: {
      nome: '9º Ano A - Matutino',
      professores: {
        connect: [{ id: professor1.id }, { id: professor2.id }],
      },
    },
  });

  const turma2 = await prisma.turma.create({
    data: {
      nome: '9º Ano B - Matutino',
      professores: {
        connect: [{ id: professor2.id }, { id: professor3.id }],
      },
    },
  });

  const turma3 = await prisma.turma.create({
    data: {
      nome: '8º Ano A - Vespertino',
      professores: {
        connect: [{ id: professor1.id }, { id: professor3.id }],
      },
    },
  });

  const turma4 = await prisma.turma.create({
    data: {
      nome: '8º Ano B - Vespertino',
      professores: {
        connect: [{ id: professor2.id }],
      },
    },
  });

  // Criar alunos
  const aluno1 = await prisma.aluno.create({
    data: {
      nome: 'Lucas Almeida',
      turmaId: turma1.id,
      responsavelId: responsavel1.id,
    },
  });

  const aluno2 = await prisma.aluno.create({
    data: {
      nome: 'Julia Lima',
      turmaId: turma1.id,
      responsavelId: responsavel2.id,
    },
  });

  const aluno3 = await prisma.aluno.create({
    data: {
      nome: 'Gabriel Souza',
      turmaId: turma2.id,
      responsavelId: responsavel3.id,
    },
  });

  const aluno4 = await prisma.aluno.create({
    data: {
      nome: 'Sofia Rocha',
      turmaId: turma2.id,
      responsavelId: responsavel4.id,
    },
  });

  const aluno5 = await prisma.aluno.create({
    data: {
      nome: 'Matheus Costa',
      turmaId: turma3.id,
      responsavelId: responsavel1.id,
    },
  });

  const aluno6 = await prisma.aluno.create({
    data: {
      nome: 'Isabella Ferreira',
      turmaId: turma3.id,
      responsavelId: responsavel2.id,
    },
  });

  const aluno7 = await prisma.aluno.create({
    data: {
      nome: 'Rafael Mendes',
      turmaId: turma4.id,
      responsavelId: responsavel3.id,
    },
  });

  const aluno8 = await prisma.aluno.create({
    data: {
      nome: 'Valentina Silva',
      turmaId: turma4.id,
      responsavelId: responsavel4.id,
    },
  });

  // Criar mensagens
  await prisma.mensagem.create({
    data: {
      texto: 'Bom dia! Lembrem-se que hoje temos prova de matemática às 10h.',
      turmaId: turma1.id,
      autorId: professor1.id,
    },
  });

  await prisma.mensagem.create({
    data: {
      texto: 'Não se esqueçam de trazer o material para a aula de ciências amanhã.',
      turmaId: turma1.id,
      autorId: professor2.id,
    },
  });

  await prisma.mensagem.create({
    data: {
      texto: 'Parabéns a todos pelo excelente trabalho na feira de ciências!',
      turmaId: turma2.id,
      autorId: professor2.id,
    },
  });

  await prisma.mensagem.create({
    data: {
      texto: 'Reunião de pais marcada para próxima sexta-feira às 19h.',
      turmaId: turma2.id,
      autorId: coordenador1.id,
    },
  });

  await prisma.mensagem.create({
    data: {
      texto: 'Lembrem-se de entregar o trabalho de história até sexta-feira.',
      turmaId: turma3.id,
      autorId: professor3.id,
    },
  });

  await prisma.mensagem.create({
    data: {
      texto: 'Amanhã teremos uma atividade especial de educação física.',
      turmaId: turma4.id,
      autorId: professor2.id,
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log(`- 1 Diretor: ${diretor.nome}`);
  console.log(`- 2 Coordenadores: ${coordenador1.nome}, ${coordenador2.nome}`);
  console.log(`- 3 Professores: ${professor1.nome}, ${professor2.nome}, ${professor3.nome}`);
  console.log(`- 4 Responsáveis: ${responsavel1.nome}, ${responsavel2.nome}, ${responsavel3.nome}, ${responsavel4.nome}`);
  console.log(`- 4 Turmas: ${turma1.nome}, ${turma2.nome}, ${turma3.nome}, ${turma4.nome}`);
  console.log(`- 8 Alunos`);
  console.log(`- 6 Mensagens`);
  console.log('\n🔑 Credenciais de acesso:');
  console.log('Email: joao.silva@escola.com | Senha: 123456 (Diretor)');
  console.log('Email: maria.santos@escola.com | Senha: 123456 (Coordenador)');
  console.log('Email: ana.costa@escola.com | Senha: 123456 (Professor)');
  console.log('Email: roberto.almeida@email.com | Senha: 123456 (Responsável)');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 