"use client";
import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../AuthContext";
import NavBar from "../navbar/navBar";
import { useRouter } from "next/navigation";
import './responsaveis.css'; // Importa o CSS da página

interface Responsavel {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export default function ResponsaveisPage() {
  const { token, user } = useAuth();
  const router = useRouter();

  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ nome: "", email: "", cpf: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoResponsavel, setNovoResponsavel] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
  });

  const fetchResponsaveis = async () => {
    setLoading(true);
    const params = new URLSearchParams(filtros);
    const res = await fetch(`/api/responsaveis?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
        const data = await res.json();
        setResponsaveis(data.responsaveis || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
        fetchResponsaveis();
    }
    // eslint-disable-next-line
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e: FormEvent) => {
    e.preventDefault();
    fetchResponsaveis();
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNovoResponsavel({ nome: "", email: "", senha: "", cpf: "", telefone: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoResponsavel({ ...novoResponsavel, [e.target.name]: e.target.value });
  };

  const handleCreateResponsavel = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...novoResponsavel, role: 'RESPONSAVEL' };
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
    if (res.ok) {
        alert("Responsável cadastrado com sucesso!");
        handleCloseModal();
        fetchResponsaveis();
    } else {
        const err = await res.json();
        alert(`Erro ao cadastrar: ${err.error}`);
    }
  };

  const handleDeleteResponsavel = async (responsavelId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este responsável?")) {
        const res = await fetch(`/api/responsaveis/${responsavelId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            alert("Responsável excluído com sucesso!");
            fetchResponsaveis();
        } else {
            const err = await res.json();
            alert(`Erro ao excluir: ${err.error}`);
        }
    }
  };

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <div className="responsaveis-page-wrapper">
        <div className="container-responsaveis">
          <div className="page-header">
            <h1 className="page-title">Gerenciar Responsáveis</h1>
            <button onClick={handleOpenModal} className="btn btn-primary">
              + Adicionar Responsável
            </button>
          </div>

          <form onSubmit={handleBuscar} className="filtros-form">
            <input name="nome" value={filtros.nome} onChange={handleFiltroChange} placeholder="Nome" className="filtro-input" />
            <input name="email" value={filtros.email} onChange={handleFiltroChange} placeholder="Email" className="filtro-input" />
            <input name="cpf" value={filtros.cpf} onChange={handleFiltroChange} placeholder="CPF" className="filtro-input" />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>

          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
          ) : (
            <div className="table-wrapper">
              <table className="responsaveis-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {responsaveis.map(r => (
                    <tr key={r.id}>
                      <td>{r.nome}</td>
                      <td>{r.email}</td>
                      <td>{r.cpf}</td>
                      <td>{r.telefone}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => handleDeleteResponsavel(r.id)} className="btn-delete">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Cadastrar Novo Responsável</h2>
            <form onSubmit={handleCreateResponsavel} className="modal-form">
              <input name="nome" value={novoResponsavel.nome} onChange={handleInputChange} placeholder="Nome completo" required className="modal-input" />
              <input name="email" type="email" value={novoResponsavel.email} onChange={handleInputChange} placeholder="Email" required className="modal-input" />
              <input name="senha" type="password" value={novoResponsavel.senha} onChange={handleInputChange} placeholder="Senha (mínimo 6 caracteres)" required className="modal-input" />
              <input name="cpf" value={novoResponsavel.cpf} onChange={handleInputChange} placeholder="CPF (somente números)" required maxLength={11} className="modal-input" />
              <input name="telefone" value={novoResponsavel.telefone} onChange={handleInputChange} placeholder="Telefone" required className="modal-input" />
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
