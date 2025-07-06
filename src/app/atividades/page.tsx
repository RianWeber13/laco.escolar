'use client';

import "./atividades.css";
import NavBar from "../navbar/navBar";
import { useState, FormEvent } from "react";

// Dados estáticos iniciais
const turmasMock = [
  "6º Ano A",
  "6º Ano B",
  "7º Ano A",
  "7º Ano B",
  "8º Ano A",
  "8º Ano B",
];

const atividadesIniciais = [
    { turma: "8º Ano A", titulo: "Leitura de Livro", descricao: "Ler o capítulo 5 do livro 'A Moreninha' e fazer um resumo." },
    { turma: "7º Ano A", titulo: "Pesquisa de História", descricao: "Pesquisar sobre a Revolução Francesa e apresentar os pontos principais." },
    { turma: "6º Ano B", titulo: "Exercícios de Matemática", descricao: "Resolver os problemas de fração da página 88." }
];

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState(atividadesIniciais);
  const [form, setForm] = useState({ turma: "", titulo: "", descricao: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.turma || !form.titulo || !form.descricao) return;
    
    // Adiciona a nova atividade no início da lista
    setAtividades([form, ...atividades]); 
    
    // Limpa o formulário
    setForm({ turma: "", titulo: "", descricao: "" });
  };

  return (
    <div className="atividades-page-wrapper">
      <NavBar onLogout={() => {}} />
      <div className="container-atividades">
        <h1 className="main-title-atividades">Painel de Atividades</h1>
        
        {/* Container principal com o fundo laranja */}
        <div className="atividades-container">
          
          {/* Formulário para adicionar nova atividade */}
          <div className="form-container">
            <h2 className="form-title">Adicionar Nova Atividade</h2>
            <form className="atividade-form" onSubmit={handleSubmit}>
              <select
                name="turma"
                value={form.turma}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="" disabled>Selecione a turma</option>
                {turmasMock.map(turma => (
                  <option key={turma} value={turma}>{turma}</option>
                ))}
              </select>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Título da atividade"
                required
                className="form-input"
              />
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição da atividade..."
                required
                className="form-textarea"
                rows={4}
              />
              <button type="submit" className="form-button">Adicionar</button>
            </form>
          </div>

          {/* Divisória */}
          <hr className="form-divider" />

          {/* Grid com as atividades existentes */}
          <div className="atividades-grid">
            {atividades.map((atividade, index) => (
              <div key={index} className="atividade-card">
                <div className="card-header">
                  <span className="card-turma">{atividade.turma}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-titulo">{atividade.titulo}</h3>
                  <p className="card-descricao">{atividade.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}