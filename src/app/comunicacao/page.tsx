'use client';

import "./comunicacao.css";
import NavBar from "../navbar/navBar";
import { useState, FormEvent } from "react";
import Image from 'next/image';

// --- Dados Estáticos (Mock) ---
const turmasMock = [
  {
    nome: "8º A MATUTINO",
    alunos: [
      { id: 1, nome: "Alice Pereira", foto: "/images/avatar.png", responsavel: "Mariana Pereira" },
      { id: 2, nome: "Ana Rodrigues", foto: "/images/avatar.png", responsavel: "Carlos Rodrigues" },
      { id: 3, nome: "Beatriz Silva", foto: "/images/avatar.png", responsavel: "Sandra Silva" },
      { id: 4, nome: "Bruno Oliveira", foto: "/images/avatar.png", responsavel: "Ricardo Oliveira" },
      { id: 5, nome: "Daniel Costa", foto: "/images/avatar.png", responsavel: "Fátima Costa" },
      { id: 6, nome: "Eduardo Almeida", foto: "/images/avatar.png", responsavel: "Paulo Almeida" },
      { id: 7, nome: "Fernanda Lima", foto: "/images/avatar.png", responsavel: "Juliana Lima", notificacao: true },
      { id: 8, nome: "Gabriel Souza", foto: "/images/avatar.png", responsavel: "André Souza" },
      { id: 9, nome: "Isabel Fernandes", foto: "/images/avatar.png", responsavel: "Teresa Fernandes" },
      { id: 10, nome: "João Ribeiro", foto: "/images/avatar.png", responsavel: "Sérgio Ribeiro" },
      { id: 11, nome: "Laura Castro", foto: "/images/avatar.png", responsavel: "Lúcia Castro" },
    ]
  },
  {
    nome: "7º B VESPERTINO",
    alunos: [
      { id: 12, nome: "Carlos Dias", foto: "/images/avatar.png", responsavel: "Marta Dias" },
      { id: 13, nome: "Maria Silva", foto: "/images/avatar.png", responsavel: "José Silva" },
    ]
  }
];

const mensagensMock: { [key: number]: any[] } = {
  7: [
    {
      autor: "Juliana Lima",
      texto: "Bom dia, professora! Espero que esteja tudo bem. A Fernanda chegou em casa um pouco chateada...",
      tipo: "recebida"
    }
  ]
};
// --- Fim dos Dados Estáticos ---

export default function ComunicacaoPage() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState(mensagensMock);

  const handleSelectTurma = (turma: string) => setTurmaSelecionada(turma);
  const handleSelectAluno = (aluno: any) => setAlunoSelecionado(aluno);
  const handleBackToAlunos = () => setAlunoSelecionado(null);
  const handleBackToTurmas = () => setTurmaSelecionada(null);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim() || !alunoSelecionado) return;

    const novaMensagem = { autor: "Você", texto: mensagem, tipo: "enviada" };
    const alunoId = alunoSelecionado.id;

    const novasMensagensParaAluno = [...(mensagens[alunoId] || []), novaMensagem];
    setMensagens({ ...mensagens, [alunoId]: novasMensagensParaAluno });
    setMensagem("");
  };

  const turmaAtual = turmasMock.find(t => t.nome === turmaSelecionada);

  return (
    <><NavBar onLogout={() => { } } /><div className="comunicacao-page-wrapper">
      <div className="container-comunicacao">

        {/* --- VISUALIZAÇÃO 1: SELEÇÃO DE TURMA --- */}
        {!turmaSelecionada && (
          <div className="selection-container">
            <h1 className="main-title">Selecione uma Turma</h1>
            <div className="turma-card-box">
              {turmasMock.map(turma => (
                <div
                  key={turma.nome}
                  className="turma-card"
                  onClick={() => handleSelectTurma(turma.nome)}
                >
                  {turma.nome}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VISUALIZAÇÃO 2: SELEÇÃO DE ALUNO --- */}
        {turmaSelecionada && !alunoSelecionado && (
          <div className="alunos-container">
            <h1 className="main-title">
              <button onClick={handleBackToTurmas} className="back-button" title="Voltar para turmas">
                &#x2190;
              </button>
              Comunicação - {turmaAtual?.nome}
            </h1>
            <div className="alunos-grid">
              {turmaAtual?.alunos.map(aluno => (
                <div
                  key={aluno.id}
                  className="aluno-card"
                  onClick={() => handleSelectAluno(aluno)}
                >
                  {aluno.notificacao && <div className="notification-dot"></div>}
                  <div className="avatar-container">
                    <Image src={aluno.foto} alt={`Foto de ${aluno.nome}`} width={60} height={60} className="avatar-img" />
                  </div>
                  <span className="aluno-nome">{aluno.nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VISUALIZAÇÃO 3: TELA DE CHAT --- */}
        {turmaSelecionada && alunoSelecionado && (
          <div className="chat-container">
            <h1 className="main-title">
              <button onClick={handleBackToAlunos} className="back-button" title="Voltar para lista de alunos">
                &#x2190;
              </button>
              Comunicação - {alunoSelecionado.nome}
            </h1>
            <div className="mensagens-area">
              {(mensagens[alunoSelecionado.id] || []).map((msg, index) => (
                <div key={index} className={`mensagem-balao ${msg.tipo}`}>
                  <div className="mensagem-autor">{msg.autor}</div>
                  <p>{msg.texto}</p>
                </div>
              ))}
            </div>
            <form className="mensagem-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="mensagem-input"
                placeholder={`Mensagem para ${alunoSelecionado.responsavel}...`}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                autoFocus />
              <button type="submit" className="enviar-btn">Enviar</button>
            </form>
          </div>
        )}

      </div>
    </div></>
  );
}