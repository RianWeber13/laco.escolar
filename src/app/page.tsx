// src/app/page.tsx
"use client";

import LoginComponent from "./componentes/login/login";

export default function HomePage() {
  const handleLoginSuccess = () => {
    alert("Login realizado com sucesso! Redirecionando...");
  };

  return (
    <main>
      <LoginComponent onLoginSuccess={handleLoginSuccess} />
    </main>
  );
}
