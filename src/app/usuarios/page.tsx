"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  telefone: string;
  cpf: string;
}

export default function UsuariosPage() {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ nome: "", email: "", cpf: "", role: "" });

  const fetchUsuarios = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.nome) params.append("nome", filtros.nome);
    if (filtros.email) params.append("email", filtros.email);
    if (filtros.cpf) params.append("cpf", filtros.cpf);
    if (filtros.role) params.append("role", filtros.role);
    const res = await fetch(`/api/usuarios?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsuarios(data.usuarios || []);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchUsuarios();
    // eslint-disable-next-line
  }, [token]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsuarios();
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Usuários</h1>
      <form onSubmit={handleBuscar} style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input name="nome" value={filtros.nome} onChange={handleFiltroChange} placeholder="Nome" style={{ flex: 1, minWidth: 120 }} />
        <input name="email" value={filtros.email} onChange={handleFiltroChange} placeholder="Email" style={{ flex: 1, minWidth: 120 }} />
        <input name="cpf" value={filtros.cpf} onChange={handleFiltroChange} placeholder="CPF" style={{ flex: 1, minWidth: 100 }} />
        <select name="role" value={filtros.role} onChange={handleFiltroChange} style={{ flex: 1, minWidth: 120 }}>
          <option value="">Todos os papéis</option>
          <option value="DIRETOR">Diretor</option>
          <option value="COORDENADOR">Coordenador</option>
          <option value="PROFESSOR">Professor</option>
          <option value="RESPONSAVEL">Responsável</option>
        </select>
        <button type="submit" style={{ padding: "0.5rem 1.5rem", borderRadius: 8, background: "#ff9d57", color: "#fff", border: 0, fontWeight: 700 }}>Buscar</button>
      </form>
      {loading ? (
        <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fde6ce" }}>
              <th style={{ padding: 8, borderRadius: 8 }}>Nome</th>
              <th style={{ padding: 8 }}>Email</th>
              <th style={{ padding: 8 }}>CPF</th>
              <th style={{ padding: 8 }}>Telefone</th>
              <th style={{ padding: 8 }}>Papel</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{u.nome}</td>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.cpf}</td>
                <td style={{ padding: 8 }}>{u.telefone}</td>
                <td style={{ padding: 8 }}>{u.role.charAt(0) + u.role.slice(1).toLowerCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 