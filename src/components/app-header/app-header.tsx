import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

import styles from './app-header.module.css';

type THeaderLinkConfig = {
  to: string;
  label: string;
  extraClass?: string;
  Icon: typeof BurgerIcon;
};

type THeaderLinkProps = THeaderLinkConfig;

const HeaderLink = ({
  to,
  label,
  Icon,
  extraClass,
}: THeaderLinkProps): React.JSX.Element => (
  <NavLink
    key={to}
    to={to}
    className={({ isActive }) =>
      `${styles.link} ${extraClass ?? ''} ${isActive ? styles.link_active : ''}`
    }
  >
    {({ isActive }) => (
      <>
        <Icon type={isActive ? 'primary' : 'secondary'} />
        <p className="text text_type_main-default ml-2">{label}</p>
      </>
    )}
  </NavLink>
);

const leftLinks: THeaderLinkConfig[] = [
  { to: '/', label: 'Конструктор', Icon: BurgerIcon },
  { to: '/feed', label: 'Лента заказов', Icon: ListIcon, extraClass: 'ml-10' },
];

const rightLinks: THeaderLinkConfig[] = [
  { to: '/profile', label: 'Личный кабинет', Icon: ProfileIcon },
];

export const AppHeader = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {leftLinks.map((link) => (
            <HeaderLink key={link.to} {...link} />
          ))}
        </div>
        <div className={styles.logo}>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className={styles.menu_part_right}>
          {rightLinks.map((link) => (
            <HeaderLink key={link.to} {...link} />
          ))}
        </div>
      </nav>
    </header>
  );
};
