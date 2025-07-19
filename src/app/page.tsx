// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import LoginComponent from "./login/page";
import NavBar from "./navbar/navBar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn");
    if (logged === "true") setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    router.push("/noticias");
  };

  if (!isLoggedIn) {
    return (
      <main>
        <LoginComponent onLoginSuccess={handleLoginSuccess} />
      </main>
    );
  }

  return (
    <main>
      <NavBar onLogout={handleLogout} />
      {/* Conteúdo principal do sistema pode ser adicionado aqui */}
    </main>
  );
}