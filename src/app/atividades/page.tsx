'use client';
import "./atividades.css";
import NavBar from "../navbar/navBar";
import { useState } from "react";

// Mock de dados iniciais
const turmasMock = [
  "6º Ano A",
  "6º Ano B",
  "7º Ano A",
  "7º Ano B"
];

export default function Atividades() {
  const [atividades, setAtividades] = useState([
    { turma: "6º Ano A", titulo: "Redação", descricao: "Escreva um texto sobre meio ambiente." },
    { turma: "7º Ano B", titulo: "Matemática", descricao: "Resolver exercícios da página 42." }
  ]);
  const [form, setForm] = useState({ turma: "", titulo: "", descricao: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAtividades([{ ...form }, ...atividades]);
    setForm({ turma: "", titulo: "", descricao: "" });
  }

  return (
    <>
      <NavBar onLogout={() => {}} />
      <div className="container centralizada">
        <h1>Atividades</h1>
        <form className="atividade-form" onSubmit={handleSubmit}>
          <select
            name="turma"
            value={form.turma}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a turma</option>
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
          />
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Descrição da atividade"
            required
          />
          <button type="submit">Adicionar Atividade</button>
        </form>
        <div className="card-box centralizada">
          {atividades.map((a, i) => (
            <div key={i} className="card atividade-card">
              <span className="atividade-turma">{a.turma}</span>
              <span className="atividade-titulo">{a.titulo}</span>
              <span className="atividade-descricao">{a.descricao}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}