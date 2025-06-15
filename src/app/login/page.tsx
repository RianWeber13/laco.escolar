"use client";

import "./login.css";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface LoginProps {
  onLoginSuccess?: () => void;
  logoSrc?: string;
  logoAlt?: string;
  title?: string;
  subtitle?: string;
}

export default function LoginComponent({
  logoSrc = "/logo-escola.png",
  logoAlt = "Logo da Escola",
  title = "Acesso ao Sistema",
  subtitle = "Laço Escolar",
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // Hook para redirecionamento

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

    if (email === "teste@escola.com" && password === "123") {
      router.push("/noticias"); // Redireciona para /noticias
    } else {
      setError("Email ou senha inválidos.");
    }

    setIsLoading(false);
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={120}
          height={60}
          className="logo"
        />
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="loginForm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            disabled={isLoading}
            required
          />
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
``
