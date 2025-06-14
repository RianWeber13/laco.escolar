import Link from 'next/link';
import styles from "./navbar.module.css";

export interface NavItemInterface {
  url: string;
  label: string;
}

export default function NavItem(props: NavItemInterface) {
  return (
    <li className={styles.navItem}>
      <Link href={props.url} className={styles.navLink}>
        {props.label}
      </Link>
    </li>
  );
}
