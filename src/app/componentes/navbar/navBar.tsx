// src/app/componentes/navbar/navBar.tsx
"use client";

import Link from 'next/link';
import NavItem, { NavItemInterface } from './navitems';
import styles from "./navbar.module.css";

interface NavBarProps {
  onLogout: () => void;
}

export default function NavBar({ onLogout }: NavBarProps) {
  const items: NavItemInterface[] = [
    { url: '/', label: 'Início' },
    { url: '/noticias', label: 'Notícias' },
    { url: '/eventos', label: 'Eventos' },
    { url: '/tarefas', label: 'Tarefas' },
    { url: '/comunicacao', label: 'Comunicação' },
  ];

  return (
    <header className={styles.navbar}>
      <nav>
        <ul className={styles.navItems}>
          {items.map((item, index) => (
            <NavItem key={index} url={item.url} label={item.label} />
          ))}
          <li className={styles.navItem}>
            <button onClick={onLogout} className={styles.navLink}>
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
