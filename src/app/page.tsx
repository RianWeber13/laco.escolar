// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import LoginComponent from "./componentes/login/login";
import Inicio from "./componentes/inicio/inicio";
import NavBar from "./componentes/navbar/navBar";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn");
    if (logged === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <main>
        <LoginComponent onLoginSuccess={() => setIsLoggedIn(true)} />
      </main>
    );
  }

  return (
    <main>
      <NavBar onLogout={handleLogout} />
      <Inicio />
    </main>
  );
}
