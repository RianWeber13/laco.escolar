"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

interface Turma {
  id: string;
  nome: string;
  professores: { id: string; nome: string }[];
  alunos: { id: string; nome: string }[];
}

export default function TurmasPage() {
  const { token, user } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ nome: "", professorId: "", alunoId: "" });

  const fetchTurmas = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.nome) params.append("nome", filtros.nome);
    if (filtros.professorId) params.append("professorId", filtros.professorId);
    if (filtros.alunoId) params.append("alunoId", filtros.alunoId);
    const res = await fetch(`/api/turmas?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTurmas(data.turmas || []);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchTurmas();
    // eslint-disable-next-line
  }, [token]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTurmas();
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Turmas</h1>
      <form onSubmit={handleBuscar} style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input name="nome" value={filtros.nome} onChange={handleFiltroChange} placeholder="Nome da turma" style={{ flex: 1, minWidth: 120 }} />
        <input name="professorId" value={filtros.professorId} onChange={handleFiltroChange} placeholder="ID do Professor" style={{ flex: 1, minWidth: 120 }} />
        <input name="alunoId" value={filtros.alunoId} onChange={handleFiltroChange} placeholder="ID do Aluno" style={{ flex: 1, minWidth: 120 }} />
        <button type="submit" style={{ padding: "0.5rem 1.5rem", borderRadius: 8, background: "#ff9d57", color: "#fff", border: 0, fontWeight: 700 }}>Buscar</button>
      </form>
      {loading ? (
        <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fde6ce" }}>
              <th style={{ padding: 8, borderRadius: 8 }}>Nome</th>
              <th style={{ padding: 8 }}>Professores</th>
              <th style={{ padding: 8 }}>Alunos</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map(t => (
              <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{t.nome}</td>
                <td style={{ padding: 8 }}>{t.professores.map(p => p.nome).join(", ")}</td>
                <td style={{ padding: 8 }}>{t.alunos.map(a => a.nome).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 