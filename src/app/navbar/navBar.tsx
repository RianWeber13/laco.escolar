'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavItem, { NavItemInterface } from './navitems';
import { usePathname } from 'next/navigation';
import './navbar.css';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

interface NavBarProps {
  onLogout: () => void;
}

export default function NavBar({ onLogout }: NavBarProps) {
  const { user } = useAuth();
  let items: NavItemInterface[] = [];
  if (user) {
    // Permissões para o Diretor
    if (user.role === 'DIRETOR') {
      items = [
        { url: '/noticias', label: 'Notícias' },
        { url: '/calendario', label: 'Calendário Escolar' },
        { url: '/atividades', label: 'Atividades' },
        { url: '/comunicacao', label: 'Comunicação' },
        { url: '/usuarios', label: 'Usuários' },
        { url: '/turmas', label: 'Turmas' },
        { url: '/alunos', label: 'Alunos' },
        { url: '/responsaveis', label: 'Responsáveis' },
      ];
    // Permissões para o Coordenador
    } else if (user.role === 'COORDENADOR') {
      items = [
        { url: '/noticias', label: 'Notícias' },
        { url: '/calendario', label: 'Calendário Escolar' },
        { url: '/atividades', label: 'Atividades' },
        { url: '/comunicacao', label: 'Comunicação' },
        { url: '/turmas', label: 'Turmas' },
        { url: '/alunos', label: 'Alunos' },
        { url: '/responsaveis', label: 'Responsáveis' },
      ];
    // Permissões para o Professor
    } else if (user.role === 'PROFESSOR') {
      items = [
        { url: '/noticias', label: 'Notícias' },
        { url: '/calendario', label: 'Calendário Escolar' },
        { url: '/atividades', label: 'Atividades' },
        { url: '/comunicacao', label: 'Comunicação' },
        { url: '/turmas', label: 'Minhas Turmas' },
        { url: '/alunos', label: 'Alunos' },
        { url: '/responsaveis', label: 'Responsáveis' },
      ];
    // Permissões para o Responsável
    } else if (user.role === 'RESPONSAVEL') {
      items = [
        { url: '/noticias', label: 'Notícias' },
        { url: '/calendario', label: 'Calendário Escolar' },
        { url: '/comunicacao', label: 'Comunicação' },
      ];
    }
  }

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
            <span className="user-name">{user?.nome || 'Usuário'}</span>
            <span className="user-details">{user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : ''}</span>
          </div>
          <button onClick={onLogout} className="btn-sair">
            SAIR
          </button>
        </div>
      </div>
    </header>
  );
}