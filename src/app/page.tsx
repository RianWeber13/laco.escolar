// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import LoginComponent from "./login/page";
import NavBar from "./navbar/navBar";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


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
      <LoginComponent />
    </main>
  );
}