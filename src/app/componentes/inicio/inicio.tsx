"use client";

import NavBar from "../navbar/navBar";
import styles from "./inicio.module.css";

export default function InicioPage() {
  const handleLogout = () => {
    console.log("Usuário saiu.");
  };

  return (
    <div className={styles.container}>
      <NavBar onLogout={handleLogout} />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Notícias</h1>

        <section className={styles.newsCard}>
          <div className={styles.author}>
            <div className={styles.avatar}></div>
            <span className={styles.authorName}>Eliane Vaz</span>
          </div>
          <h2 className={styles.newsTitle}>Campanha do Agasalho – 5º Ano A:</h2>
          <p className={styles.newsText}>
            A turma do 5º Ano A está promovendo uma campanha do agasalho. Pedimos a todos que contribuam com roupas e cobertores em bom estado, que serão entregues para famílias em situação de vulnerabilidade. As doações podem ser deixadas na sala de aula até o dia 15 de março.
          </p>
        </section>

        <section className={styles.newsCard}>
          <div className={styles.author}>
            <div className={styles.avatar}></div>
            <span className={styles.authorName}>Rodrigo Dias</span>
          </div>
          <h2 className={styles.newsTitle}>Premiação da Turma B:</h2>
          <p className={styles.newsText}>
            Parabenizamos a Turma B, que ganhou o prêmio de melhor desempenho acadêmico do mês! A turma se destacou em diversas disciplinas, mostrando grande dedicação e esforço. Continuem assim, alunos, estamos muito orgulhosos de vocês!
          </p>
        </section>

        <section className={styles.newsCard}>
          <div className={styles.author}>
            <div className={styles.avatar}></div>
            <span className={styles.authorName}>Eliane Vaz</span>
          </div>
          <h2 className={styles.newsTitle}>Premiação da Turma B:</h2>
          <p className={styles.newsText}>
            Parabenizamos a Turma B, que ganhou o prêmio de melhor desempenho acadêmico do mês! A turma se destacou em diversas disciplinas, mostrando grande dedicação e esforço. Continuem assim, alunos, estamos muito orgulhosos de vocês!
          </p>
        </section>
      </main>
    </div>
  );
}
