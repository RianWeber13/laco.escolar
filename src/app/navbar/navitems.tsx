import Link from 'next/link';

export interface NavItemInterface {
  url: string;
  label: string;
  isActive?: boolean;
}

export default function NavItem(props: NavItemInterface) {
  return (
    <li className="navItem">
      <Link href={props.url} 
      className={`navLink ${props.isActive ? 'active' : ''}`}>
        {props.label}
      </Link>
    </li>
  );
}
