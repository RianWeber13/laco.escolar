"use client";

import "./calendario.css";
import NavBar from "../navbar/navBar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Calendario() {
  const router = useRouter();
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [tipoSelecionado, setTipoSelecionado] = useState("letivo");
  const [diasMarcados, setDiasMarcados] = useState({});

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleDiaClick = (dia) => {
    const chave = `${ano}-${mes + 1}-${dia}`;
    setDiasMarcados((prev) => {
      const novo = { ...prev };
      if (tipoSelecionado === "limpar") {
        delete novo[chave];
      } else {
        novo[chave] = {
          tipo: tipoSelecionado,
          nome: tipoSelecionado === "feriado" ? "Feriado" : ""
        };
      }
      return novo;
    });
  };

  const getClasseDia = (dia) => {
    const chave = `${ano}-${mes + 1}-${dia}`;
    return diasMarcados[chave]?.tipo || "";
  };

  const getTituloDia = (dia) => {
    const chave = `${ano}-${mes + 1}-${dia}`;
    return diasMarcados[chave]?.nome || "";
  };

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();

  useEffect(() => {
    async function carregarFeriados() {
      try {
        const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
        const feriados = await res.json();

        const novos = {};
        feriados.forEach((f) => {
          const data = new Date(f.date + "T00:00:00");
          const chave = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
          novos[chave] = {
            tipo: "feriado",
            nome: f.name
          };
        });

        setDiasMarcados((prev) => ({ ...novos, ...prev }));
      } catch (error) {
        console.error("Erro ao carregar feriados:", error);
      }
    }

    carregarFeriados();
  }, [ano]);

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <div className="calendario-container">
        <h1>Calendário Escolar</h1>

        <div className="controles">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
            {nomesMeses.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
            {Array.from({ length: 11 }, (_, i) => ano - 5 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <div className="tipo-select">
            {["letivo", "facultativo", "evento", "limpar"].map((tipo) => (
              <label key={tipo}>
                <input
                  type="radio"
                  name="tipo"
                  value={tipo}
                  checked={tipoSelecionado === tipo}
                  onChange={() => setTipoSelecionado(tipo)}
                />
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="calendario-grid">
          {diasSemana.map((dia, i) => (
            <div key={i} className="dia cabecalho">{dia}</div>
          ))}

          {Array.from({ length: primeiroDiaSemana }, (_, i) => (
            <div key={`vazio-${i}`} className="dia vazio"></div>
          ))}

          {Array.from({ length: diasNoMes }, (_, i) => {
            const dia = i + 1;
            return (
              <div
                key={dia}
                className={`dia ${getClasseDia(dia)}`}
                onClick={() => handleDiaClick(dia)}
                title={getTituloDia(dia)}
              >
                {dia}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
