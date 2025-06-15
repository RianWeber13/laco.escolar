"use client";

import "./noticias.css";
import NavBar from "../navbar/navBar";

export default function Noticias() {
  return (
    <div>
      <NavBar onLogout={() => console.log("Logout clicado")} /> {/* ← Adiciona NavBar */}
      <h1>NOTICIAS</h1>
    </div>
  );
}
