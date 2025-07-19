"use client";

import "./calendario.css";
import NavBar from "../navbar/navBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Definição do tipo para o dia marcado (simplificado)
type DiaFeriado = {
  tipo: 'feriado';
  nome: string;
};

type DiasMarcadosState = {
  [chave: string]: DiaFeriado;
};

export default function CalendarioPage() {
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [diasMarcados, setDiasMarcados] = useState<DiasMarcadosState>({});
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Efeito para buscar feriados nacionais
  useEffect(() => {
    async function carregarFeriados() {
      try {
        const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
        const feriadosApi = await res.json();
        
        const novosFeriados: DiasMarcadosState = {};
        feriadosApi.forEach((feriado: { date: string; name: string }) => {
          // CORREÇÃO DA DATA: Adiciona T00:00:00 para forçar o fuso horário local
          const data = new Date(`${feriado.date}T00:00:00`);
          const chave = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
          novosFeriados[chave] = { tipo: "feriado", nome: feriado.name };
        });

        setDiasMarcados(novosFeriados);
      } catch (error) {
        console.error("Erro ao carregar feriados:", error);
      }
    }
    carregarFeriados();
  }, [ano]); // Recarrega os feriados sempre que o ano muda

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  
  // Função para mudar para o mês anterior
  const mesAnterior = () => {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  };

  // Função para mudar para o próximo mês
  const proximoMes = () => {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  };

  return (
    <><NavBar onLogout={handleLogout} />
    <div className="calendario-page-wrapper">
      <div className="container-calendario">
        <div className="calendario-visual-container">
          {/* Header com Navegação e Título */}
          <div className="calendario-header">
            <button onClick={mesAnterior} className="nav-button" title="Mês anterior">‹</button>
            <div className="mes-ano-titulo">{`${nomesMeses[mes]} de ${ano}`}</div>
            <button onClick={proximoMes} className="nav-button" title="Próximo mês">›</button>
          </div>

          {/* Grid do Calendário */}
          <div className="calendario-grid">
            {diasSemana.map((dia, i) => <div key={i} className="dia-semana">{dia}</div>)}
            {Array.from({ length: primeiroDiaSemana }).map((_, i) => <div key={`vazio-${i}`} className="dia-vazio"></div>)}
            {Array.from({ length: diasNoMes }).map((_, i) => {
              const dia = i + 1;
              const chave = `${ano}-${mes + 1}-${dia}`;
              const diaMarcado = diasMarcados[chave];

              // Define a classe: 'feriado' se for feriado, senão 'letivo'
              const classeDia = diaMarcado ? diaMarcado.tipo : 'letivo';

              return (
                <div key={dia} className={`dia-calendario ${classeDia}`}>
                  <span className="numero-dia">{dia}</span>
                  {diaMarcado?.nome && <span className="nome-feriado">{diaMarcado.nome}</span>}
                </div>
              );
            })}
          </div>
          {/* Legenda dentro do container amarelo */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <span style={{ display: 'inline-block', width: 24, height: 24, background: '#fed7d7', border: '1px solid #c53030', borderRadius: 6, verticalAlign: 'middle' }}></span>
              <span style={{ color: '#c53030', fontWeight: 600 }}>Feriado</span>
            </span>
          </div>
        </div>
      </div>
    </div></>
  );
}