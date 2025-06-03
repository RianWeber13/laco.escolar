// src/app/componentes/navbar/navBar.tsx
"use client";

import Link from 'next/link';
import NavItem, { NavItemInterface } from './navitems';

interface NavBarProps {
  onLogout: () => void;
}

export default function NavBar({ onLogout }: NavBarProps) {
  const items: NavItemInterface[] = [
    { url: '/', label: 'inicio' },
    { url: '/noticias', label: 'noticias' },
    { url: '/eventos', label: 'eventos' },
    { url: '/tarefas', label: 'tarefas' },
    { url: '/comunicacao', label: 'comunicação' },
  ];

  return (
    <header>
      <nav className="navbar">
        <ul className="nav-items">
          {items.map((item, index) => (
            <NavItem key={index} url={item.url} label={item.label} />
          ))}
          <li className="nav-item">
            <button onClick={onLogout} className="nav-link">
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
