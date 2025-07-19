"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

interface Mensagem {
  id: string;
  texto: string;
  data: string;
  autor: { id: string; nome: string };
}

export default function MensagensPage() {
  const { token, user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ turmaId: "", texto: "", autorId: "", dataInicio: "", dataFim: "" });

  const fetchMensagens = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.turmaId) params.append("turmaId", filtros.turmaId);
    if (filtros.texto) params.append("texto", filtros.texto);
    if (filtros.autorId) params.append("autorId", filtros.autorId);
    if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
    if (!filtros.turmaId) {
      setMensagens([]);
      setLoading(false);
      return;
    }
    const res = await fetch(`/api/mensagens?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMensagens(data.mensagens || []);
    setLoading(false);
  };

  useEffect(() => {
    if (token && filtros.turmaId) fetchMensagens();
    // eslint-disable-next-line
  }, [token, filtros.turmaId]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMensagens();
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Mensagens</h1>
      <form onSubmit={handleBuscar} style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input name="turmaId" value={filtros.turmaId} onChange={handleFiltroChange} placeholder="ID da Turma" style={{ flex: 1, minWidth: 120 }} />
        <input name="texto" value={filtros.texto} onChange={handleFiltroChange} placeholder="Texto" style={{ flex: 1, minWidth: 120 }} />
        <input name="autorId" value={filtros.autorId} onChange={handleFiltroChange} placeholder="ID do Autor" style={{ flex: 1, minWidth: 120 }} />
        <input name="dataInicio" value={filtros.dataInicio} onChange={handleFiltroChange} placeholder="Data início (YYYY-MM-DD)" style={{ flex: 1, minWidth: 120 }} />
        <input name="dataFim" value={filtros.dataFim} onChange={handleFiltroChange} placeholder="Data fim (YYYY-MM-DD)" style={{ flex: 1, minWidth: 120 }} />
        <button type="submit" style={{ padding: "0.5rem 1.5rem", borderRadius: 8, background: "#ff9d57", color: "#fff", border: 0, fontWeight: 700 }}>Buscar</button>
      </form>
      {loading ? (
        <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fde6ce" }}>
              <th style={{ padding: 8, borderRadius: 8 }}>Texto</th>
              <th style={{ padding: 8 }}>Autor</th>
              <th style={{ padding: 8 }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {mensagens.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{m.texto}</td>
                <td style={{ padding: 8 }}>{m.autor?.nome || "-"}</td>
                <td style={{ padding: 8 }}>{new Date(m.data).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 