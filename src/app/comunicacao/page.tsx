'use client';
import "./comunicacao.css";
import NavBar from "../navbar/navBar";
import { useState } from "react";

// Mock de dados
const turmasMock = [
  { nome: "6º Ano A", pais: ["Maria Silva", "João Souza"] },
  { nome: "7º Ano B", pais: ["Ana Lima", "Carlos Dias"] }
];

export default function ChatProfessor() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string | null>(null);
  const [paiSelecionado, setPaiSelecionado] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState<{ [key: string]: string[] }>({});

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!turmaSelecionada || !paiSelecionado || !mensagem) return;
    const key = `${turmaSelecionada}-${paiSelecionado}`;
    setConversas({
      ...conversas,
      [key]: [...(conversas[key] || []), `Professor: ${mensagem}`]
    });
    setMensagem('');
  }

  function handleSelectTurma(turma: string) {
    setTurmaSelecionada(turma);
    setPaiSelecionado(null);
  }

  function handleSelectPai(pai: string) {
    setPaiSelecionado(pai);
  }

  const chatKey = turmaSelecionada && paiSelecionado ? `${turmaSelecionada}-${paiSelecionado}` : null;
  const mensagens = chatKey ? conversas[chatKey] || [] : [];

  return (
    <>
      <NavBar onLogout={() => {}} />
      <div className="container centralizada">
        <h1>Comunicação com Responsáveis</h1>
        {!turmaSelecionada ? (
          <>
            <h2>Selecione uma turma</h2>
            <div className="card-box centralizada">
              {turmasMock.map(turma => (
                <div
                  key={turma.nome}
                  className="card"
                  onClick={() => handleSelectTurma(turma.nome)}
                >
                  <span className="card-title">{turma.nome}</span>
                </div>
              ))}
            </div>
          </>
        ) : !paiSelecionado ? (
          <>
            <h2>Turma: {turmaSelecionada}</h2>
            <h3>Selecione um responsável</h3>
            <div className="card-box centralizada">
              {turmasMock.find(t => t.nome === turmaSelecionada)?.pais.map(pai => (
                <div
                  key={pai}
                  className="card"
                  onClick={() => handleSelectPai(pai)}
                >
                  <span className="card-title">{pai}</span>
                </div>
              ))}
            </div>
            <button className="voltar-btn" onClick={() => setTurmaSelecionada(null)}>Voltar</button>
          </>
        ) : (
          <div className="chat-main">
            <div className="chat-header">
              <h2>Chat com {paiSelecionado} ({turmaSelecionada})</h2>
              <button className="voltar-btn" onClick={() => setPaiSelecionado(null)}>Voltar</button>
            </div>
            <div className="chat-messages">
              {mensagens.map((msg, i) => (
                <div key={i} className="chat-msg">{msg}</div>
              ))}
            </div>
            <form className="chat-form" onSubmit={handleSend}>
              <input
                type="text"
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                required
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}