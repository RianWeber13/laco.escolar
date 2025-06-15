"use client";

import Link from 'next/link';
import NavItem, { NavItemInterface } from './navitems';
import { usePathname } from 'next/navigation';
import  './navbar.css'; 


interface NavBarProps {
  onLogout: () => void;
}

export default function NavBar({ onLogout }: NavBarProps) {
  const items: NavItemInterface[] = [
    { url: '/noticias', label: 'Notícias' },
    { url: '/calendario', label: 'Calendário Escolar' },
    { url: '/atividades', label: 'Atividades' },
    { url: '/comunicacao', label: 'Comunicação' },
  ];

  const pathname = usePathname();

  return (
    <header className="navbar">
      <nav>
        <ul className="navItems">
          {items.map((item, index) => (
            <NavItem 
              key={index} 
              url={item.url} 
              label={item.label}
              isActive={pathname === item.url}
            />
          ))}
          <li className="navItem">
            <button onClick={onLogout} className="btnSair">
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
