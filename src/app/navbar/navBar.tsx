'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavItem, { NavItemInterface } from './navitems';
import { usePathname } from 'next/navigation';
import './navbar.css';
import { FaBars } from 'react-icons/fa';

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
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpenMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Seção da Logo */}
        <div className="logo-section">
          <Image src="/images/logoweb.png" alt="Laço Escolar Logo" width={100} height={100} />
          <span className="logo-text">LAÇO ESCOLAR</span>
        </div>

        {/* Seção dos Links de Navegação */}
        <nav className="nav-section">
          <button className="btnmobile" onClick={() => setOpenMenu(!openMenu)}>
            <FaBars />
          </button>
          <ul className={`nav-items ${openMenu ? 'open' : ''}`}>
            {items.map((item, index) => (
              <NavItem 
                key={index} 
                url={item.url} 
                label={item.label}
                isActive={pathname === item.url}
              />
            ))}
          </ul>
        </nav>

        {/* Seção do Usuário */}
        <div className="user-section">
          <div className="user-info">
            <span className="user-name">Docente Ana</span>
            <span className="user-details">Escola Estadual La Salle | Turma 8ºA - Matutino</span>
          </div>
          <button onClick={onLogout} className="btn-sair">
            SAIR
          </button>
        </div>
      </div>
    </header>
  );
}