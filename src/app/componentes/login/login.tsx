// src/app/componentes/login/login.tsx
"use client";

import { useState, FormEvent } from "react";
import styles from "./login.module.css";
import Image from "next/image";

interface LoginProps {
  onLoginSuccess?: () => void;
  logoSrc?: string;
  logoAlt?: string;
  title?: string;
  subtitle?: string;
}

export default function LoginComponent({
  onLoginSuccess,
  logoSrc = "/logo-escola.png",
  logoAlt = "Logo da Escola",
  title = "Acesso ao Sistema",
  subtitle = "Laço Escolar",
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    await new Promise((res) => setTimeout(res, 1000)); // Simula delay

    if (email === "teste@escola.com" && password === "senha123") {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        alert("Login bem-sucedido!");
      }
    } else {
      setError("Email ou senha inválidos.");
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={120}
          height={60}
          className={styles.logo}
        />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            disabled={isLoading}
            required
          />
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
