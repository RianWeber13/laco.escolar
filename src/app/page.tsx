// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import LoginComponent from "./componentes/login/login";
import Inicio from "./componentes/inicio/inicio";

export default function HomePage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/inicio/inicio.tsx"); // Redireciona corretamente para a página /inicio
  };

  return (
    <main>
      <LoginComponent onLoginSuccess={handleLoginSuccess} />
    </main>
  );
}
