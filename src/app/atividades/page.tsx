"use client";

import { useRouter } from "next/navigation";
import "./atividades.css";
import NavBar from "../navbar/navBar";

export default function atividades() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ou sessionStorage
    router.push('/login'); // redireciona para login
  };

  return (
    <div>
      <NavBar onLogout={handleLogout} />
      <h1>Atividades</h1>
    </div>
  );
}
