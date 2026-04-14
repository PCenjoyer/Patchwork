import { Link, NavLink, Outlet } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const { t } = useLanguage();
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand} aria-label={t('brand.home')}>
          <span className={styles.brandMark} aria-hidden="true">▦</span>
          <span className={styles.brandName}>Patchwork</span>
        </Link>
        <nav className={styles.nav} aria-label={t('nav.primary')}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}>
            {t('nav.templates')}
          </NavLink>
          <NavLink to="/documents" className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}>
            {t('nav.documents')}
          </NavLink>
        </nav>
        <div className={styles.headerSpacer} />
        <LanguageToggle />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
