"use client";
import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../AuthContext";
import NavBar from "../navbar/navBar";
import { useRouter } from "next/navigation";
import './usuarios.css'; // Importa o CSS da página

// Define a interface para o objeto de usuário
interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  telefone: string;
  cpf: string;
}

// Define o tipo para os dados do novo usuário no formulário
type NovoUsuario = Omit<Usuario, 'id'> & { senha?: string };

export default function UsuariosPage() {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ nome: "", email: "", cpf: "", role: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState<NovoUsuario>({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    role: "PROFESSOR", // Papel padrão no formulário
  });
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    const params = new URLSearchParams(filtros);
    const res = await fetch(`/api/usuarios?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsuarios(data.usuarios || []);
    } else {
      console.error("Falha ao buscar usuários");
      setUsuarios([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchUsuarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e: FormEvent) => {
    e.preventDefault();
    fetchUsuarios();
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      const res = await fetch(`/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchUsuarios();
      } else {
        const errorData = await res.json();
        alert(`Falha ao excluir usuário: ${errorData.error || 'Erro desconhecido'}`);
      }
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNovoUsuario({ nome: "", email: "", cpf: "", telefone: "", senha: "", role: "PROFESSOR" });
  };

  const handleNovoUsuarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovoUsuario({ ...novoUsuario, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    // Adiciona o papel 'RESPONSAVEL' ao payload antes de enviar
    const payload = { ...novoUsuario, role: novoUsuario.role };
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        alert('Usuário cadastrado com sucesso!');
        handleCloseModal();
        fetchUsuarios();
    } else {
        const errorData = await res.json();
        alert(`Falha no cadastro: ${errorData.error || 'Erro desconhecido'}`);
    }
  };

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <div className="usuarios-page-wrapper">
        <div className="container-usuarios">
          
          <div className="page-header">
            <h1 className="page-title">Gerenciar Usuários</h1>
            {(user?.role === 'DIRETOR' || user?.role === 'COORDENADOR') && (
              <button onClick={handleOpenModal} className="btn btn-primary">
                + Adicionar Usuário
              </button>
            )}
          </div>
          
          <form onSubmit={handleBuscar} className="filtros-form">
            <input name="nome" value={filtros.nome} onChange={handleFiltroChange} placeholder="Nome" className="filtro-input" />
            <input name="email" value={filtros.email} onChange={handleFiltroChange} placeholder="Email" className="filtro-input" />
            <input name="cpf" value={filtros.cpf} onChange={handleFiltroChange} placeholder="CPF" className="filtro-input" />
            <select name="role" value={filtros.role} onChange={handleFiltroChange} className="filtro-select">
              <option value="">Todos os papéis</option>
              <option value="DIRETOR">Diretor</option>
              <option value="COORDENADOR">Coordenador</option>
              <option value="PROFESSOR">Professor</option>
              <option value="RESPONSAVEL">Responsável</option>
            </select>
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
          ) : (
            <div className="table-wrapper">
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Papel</th>
                    {(user?.role === 'DIRETOR' || user?.role === 'COORDENADOR') && (
                      <th style={{ textAlign: 'center' }}>Ações</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.nome}</td>
                      <td>{u.email}</td>
                      <td>{u.cpf}</td>
                      <td>{u.telefone}</td>
                      <td>{u.role.charAt(0) + u.role.slice(1).toLowerCase()}</td>
                      {(user?.role === 'DIRETOR' || user?.role === 'COORDENADOR') && (
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleDelete(u.id)}
                            className="btn-delete"
                            disabled={user?.role === 'COORDENADOR' && u.role === 'DIRETOR'}
                          >
                            Excluir
                          </button>
                        </td>
                      )}
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
            <h2 className="modal-title">Cadastrar Novo Usuário</h2>
            <form onSubmit={handleRegister} className="modal-form">
              <input name="nome" value={novoUsuario.nome} onChange={handleNovoUsuarioChange} placeholder="Nome completo" required className="modal-input" />
              <input name="email" type="email" value={novoUsuario.email} onChange={handleNovoUsuarioChange} placeholder="Email" required className="modal-input" />
              <input name="senha" type="password" value={novoUsuario.senha} onChange={handleNovoUsuarioChange} placeholder="Senha (mínimo 6 caracteres)" required className="modal-input" />
              <input name="cpf" value={novoUsuario.cpf} onChange={handleNovoUsuarioChange} placeholder="CPF (somente números)" required maxLength={11} className="modal-input" />
              <input name="telefone" value={novoUsuario.telefone} onChange={handleNovoUsuarioChange} placeholder="Telefone" required className="modal-input" />
              <select name="role" value={novoUsuario.role} onChange={handleNovoUsuarioChange} required className="modal-input">
                {user?.role === 'DIRETOR' && <option value="DIRETOR">Diretor</option>}
                <option value="COORDENADOR">Coordenador</option>
                <option value="PROFESSOR">Professor</option>
                <option value="RESPONSAVEL">Responsável</option>
              </select>
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
