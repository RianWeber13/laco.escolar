"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
  responsavel: { id: string; nome: string };
}

export default function AlunosPage() {
  const { token, user } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ nome: "", turmaId: "", responsavelId: "" });

  const fetchAlunos = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.turmaId) params.append("turmaId", filtros.turmaId);
    if (filtros.nome) params.append("nome", filtros.nome);
    if (filtros.responsavelId) params.append("responsavelId", filtros.responsavelId);
    if (!filtros.turmaId) {
      setAlunos([]);
      setLoading(false);
      return;
    }
    const res = await fetch(`/api/alunos?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAlunos(data.alunos || []);
    setLoading(false);
  };

  useEffect(() => {
    if (token && filtros.turmaId) fetchAlunos();
    // eslint-disable-next-line
  }, [token, filtros.turmaId]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAlunos();
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Alunos</h1>
      <form onSubmit={handleBuscar} style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input name="turmaId" value={filtros.turmaId} onChange={handleFiltroChange} placeholder="ID da Turma" style={{ flex: 1, minWidth: 120 }} />
        <input name="nome" value={filtros.nome} onChange={handleFiltroChange} placeholder="Nome do aluno" style={{ flex: 1, minWidth: 120 }} />
        <input name="responsavelId" value={filtros.responsavelId} onChange={handleFiltroChange} placeholder="ID do Responsável" style={{ flex: 1, minWidth: 120 }} />
        <button type="submit" style={{ padding: "0.5rem 1.5rem", borderRadius: 8, background: "#ff9d57", color: "#fff", border: 0, fontWeight: 700 }}>Buscar</button>
      </form>
      {loading ? (
        <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fde6ce" }}>
              <th style={{ padding: 8, borderRadius: 8 }}>Nome</th>
              <th style={{ padding: 8 }}>Turma</th>
              <th style={{ padding: 8 }}>Responsável</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map(a => (
              <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{a.nome}</td>
                <td style={{ padding: 8 }}>{a.turmaId}</td>
                <td style={{ padding: 8 }}>{a.responsavel?.nome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 