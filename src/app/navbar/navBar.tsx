import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    <header className="navbar">
      <nav>
        <button className="btnmobile" onClick={() => setOpenMenu(!openMenu)}>
          <FaBars />
        </button>
        <ul className={`navItems ${openMenu ? 'open' : ''}`}>
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
