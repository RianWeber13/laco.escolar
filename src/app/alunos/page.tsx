"use client";
import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../AuthContext";
import NavBar from "../navbar/navBar";
import { useRouter } from "next/navigation";
import './alunos.css'; // Importa o CSS da página de alunos

// Interfaces para os dados
interface Aluno {
  id: string;
  nome: string;
  turma: { id: string; nome: string };
  responsavel: { id: string; nome: string };
}
interface Turma {
  id: string;
  nome: string;
}
interface Responsavel {
  id: string;
  nome: string;
}

export default function AlunosPage() {
  const { token, user } = useAuth();
  const router = useRouter();

  // Estados da página
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para o formulário de novo aluno
  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    turmaId: "",
    responsavelId: "",
  });

  // Funções de busca de dados
  const fetchAlunos = async () => {
    setLoading(true);
    const res = await fetch(`/api/alunos`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setAlunos(data.alunos || []);
    }
    setLoading(false);
  };

  const fetchTurmasEResponsaveis = async () => {
    // Busca turmas
    const turmasRes = await fetch('/api/turmas', { headers: { Authorization: `Bearer ${token}` } });
    if (turmasRes.ok) {
      const data = await turmasRes.json();
      setTurmas(data.turmas || []);
    }
    // Busca responsáveis
    const respRes = await fetch('/api/usuarios?role=RESPONSAVEL', { headers: { Authorization: `Bearer ${token}` } });
    if (respRes.ok) {
      const data = await respRes.json();
      setResponsaveis(data.usuarios || []);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAlunos();
      fetchTurmasEResponsaveis();
    }
    // eslint-disable-next-line
  }, [token]);

  // Funções de manipulação de eventos
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNovoAluno({ nome: "", turmaId: "", responsavelId: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovoAluno({ ...novoAluno, [e.target.name]: e.target.value });
  };

  const handleCreateAluno = async (e: FormEvent) => {
    e.preventDefault();
    if (!novoAluno.nome || !novoAluno.turmaId || !novoAluno.responsavelId) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    const res = await fetch('/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(novoAluno),
    });
    if (res.ok) {
        alert("Aluno cadastrado com sucesso!");
        handleCloseModal();
        fetchAlunos();
    } else {
        const err = await res.json();
        alert(`Erro ao cadastrar aluno: ${err.error}`);
    }
  };

  const handleDeleteAluno = async (alunoId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
        const res = await fetch(`/api/alunos/${alunoId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            alert("Aluno excluído com sucesso!");
            fetchAlunos();
        } else {
            const err = await res.json();
            alert(`Erro ao excluir aluno: ${err.error}`);
        }
    }
  };

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <div className="alunos-page-wrapper">
        <div className="container-alunos">
          <div className="page-header">
            <h1 className="page-title">Gerenciar Alunos</h1>
            <button onClick={handleOpenModal} className="btn btn-primary">
              + Adicionar Aluno
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>Carregando...</div>
          ) : (
            <div className="table-wrapper">
              <table className="alunos-table">
                <thead>
                  <tr>
                    <th>Nome do Aluno</th>
                    <th>Turma</th>
                    <th>Responsável</th>
                    <th style={{ textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map(aluno => (
                    <tr key={aluno.id}>
                      <td>{aluno.nome}</td>
                      <td>{aluno.turma?.nome || 'N/A'}</td>
                      <td>{aluno.responsavel?.nome || 'N/A'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => handleDeleteAluno(aluno.id)} className="btn-delete">
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
            <h2 className="modal-title">Cadastrar Novo Aluno</h2>
            <form onSubmit={handleCreateAluno} className="modal-form">
              <input name="nome" value={novoAluno.nome} onChange={handleInputChange} placeholder="Nome completo do aluno" required className="modal-input" />
              <select name="turmaId" value={novoAluno.turmaId} onChange={handleInputChange} required className="modal-input">
                <option value="">Selecione a Turma</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
              <select name="responsavelId" value={novoAluno.responsavelId} onChange={handleInputChange} required className="modal-input">
                <option value="">Selecione o Responsável</option>
                {responsaveis.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </select>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Cadastrar Aluno</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}