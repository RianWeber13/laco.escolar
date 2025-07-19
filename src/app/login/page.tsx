"use client";

import "./login.css";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const ok = await login(email, password);
    if (!ok) {
      setError("Email ou senha inválidos.");
    } else {
      router.push("/noticias");
    }
  };

  return (
    <div className="login-page-wrapper">
      <main className="main-container">
        <div className="illustration-section">
          <Image
            src="/images/login-illustration.png"
            alt="Ilustração de uma pessoa ajudando uma criança com os estudos"
            fill
            className="illustration-image"
            priority
          />
        </div>

        <div className="form-section">
          <div className="login-box">
            <div className="logo-container">
              <Image
                src="/images/logoweb.png"
                alt="Logo Laço Escolar"
                width={300}
                height={300}
              />
            </div>
            <h1 className="title">Laço Escolar</h1>
            <p className="subtitle">Acesse o sistema</p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled={loading}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={loading}
                required
              />
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}