"use client";
import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../AuthContext";
import NavBar from "../navbar/navBar";
import { useRouter } from "next/navigation";
import './turmas.css'; // Importa o CSS da página de turmas

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeNovaTurma, setNomeNovaTurma] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const fetchTurmas = async () => {
    setLoading(true);
    const params = new URLSearchParams(filtros);
    const res = await fetch(`/api/turmas?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
        const data = await res.json();
        setTurmas(data.turmas || []);
    } else {
        console.error("Falha ao buscar turmas");
        setTurmas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
        fetchTurmas();
    }
    // eslint-disable-next-line
  }, [token]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTurmas();
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNomeNovaTurma("");
  };

  const handleCreateTurma = async (e: FormEvent) => {
    e.preventDefault();
    if (!nomeNovaTurma.trim()) {
      alert("O nome da turma não pode ser vazio.");
      return;
    }

    const res = await fetch('/api/turmas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome: nomeNovaTurma }),
    });

    if (res.ok) {
      alert("Turma criada com sucesso!");
      handleCloseModal();
      fetchTurmas(); // Atualiza a lista de turmas
    } else {
      const errorData = await res.json();
      alert(`Falha ao criar turma: ${errorData.error?.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeleteTurma = async (turmaId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta turma? Isso não pode ser desfeito.")) {
        const res = await fetch(`/api/turmas/${turmaId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            alert("Turma excluída com sucesso!");
            fetchTurmas(); // Atualiza a lista
        } else {
            const errorData = await res.json();
            alert(`Falha ao excluir turma: ${errorData.error || 'Erro desconhecido'}`);
        }
    }
  };

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <div className="turmas-page-wrapper">
        <div className="container-turmas">
          <div className="page-header">
            <h1 className="page-title">Gerenciar Turmas</h1>
             {(user?.role === 'DIRETOR' || user?.role === 'COORDENADOR') && (
              <button onClick={handleOpenModal} className="btn btn-primary">
                + Adicionar Turma
              </button>
            )}
          </div>
          
          <form onSubmit={handleBuscar} className="filtros-form">
            <input name="nome" value={filtros.nome} onChange={handleFiltroChange} placeholder="Nome da turma" className="filtro-input" />
            <input name="professorId" value={filtros.professorId} onChange={handleFiltroChange} placeholder="ID do Professor" className="filtro-input" />
            <input name="alunoId" value={filtros.alunoId} onChange={handleFiltroChange} placeholder="ID do Aluno" className="filtro-input" />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
          ) : (
            <div className="table-wrapper">
              <table className="turmas-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Professores</th>
                    <th>Alunos</th>
                    {(user?.role === 'DIRETOR' || user?.role === 'COORDENADOR') && (
                      <th style={{ textAlign: 'center' }}>Ações</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {turmas.map(t => (
                    <tr key={t.id}>
                      <td>{t.nome}</td>
                      <td>{t.professores.map(p => p.nome).join(", ")}</td>
                      <td>{t.alunos.length > 0 ? t.alunos.map(a => a.nome).join(", ") : 'Nenhum aluno'}</td>
                      {(user?.role === 'DIRETOR' || user?.role === 'COORDENADOR') && (
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleDeleteTurma(t.id)}
                            className="btn-delete"
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
            <h2 className="modal-title">Criar Nova Turma</h2>
            <form onSubmit={handleCreateTurma} className="modal-form">
              <input 
                name="nome" 
                value={nomeNovaTurma} 
                onChange={(e) => setNomeNovaTurma(e.target.value)} 
                placeholder="Ex: 9º Ano B - Matutino" 
                required 
                className="modal-input"
              />
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Criar Turma</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
