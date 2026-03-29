'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import styles from './dashboard.module.css';

const navItems = [
  { path: '/dashboard', icon: '📊', key: 'nav.dashboard' },
  { path: '/dashboard/interview', icon: '🤖', key: 'nav.interview' },
  { path: '/dashboard/cv', icon: '📄', key: 'nav.cv' },
  { path: '/dashboard/motivation', icon: '✍️', key: 'nav.motivation' },
  { path: '/dashboard/leaderboard', icon: '🏆', key: 'nav.leaderboard' },
  { path: '/dashboard/acceptance', icon: '🎉', key: 'nav.acceptance' },
  { path: '/dashboard/early-application', icon: '⏰', key: 'nav.earlyApp' },
  { path: '/dashboard/scholarship', icon: '❄️', key: 'nav.scholarship' },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, language, setLanguage, logout, xp, getLevel } = useStore();
  const lang = language;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const level = getLevel();

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            <span className={styles.logoIcon}>◆</span>
            <span className={styles.logoText}>inVision<span style={{ color: 'var(--neon)' }}>U</span></span>
          </div>

          {/* User Info */}
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>{level.emoji}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'User'}</span>
              <span className={styles.userLevel}>{level.name} • {xp} XP</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.navItem} ${pathname === item.path ? styles.navActive : ''}`}
                onClick={() => router.push(item.path)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{t(lang, item.key)}</span>
                {pathname === item.path && <div className={styles.navIndicator} />}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          {/* Language Switcher */}
          <div className={styles.langRow}>
            {['en', 'ru', 'kz'].map(l => (
              <button key={l} className={`${styles.langBtn} ${lang === l ? styles.langActive : ''}`} onClick={() => setLanguage(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className={styles.logoutBtn} onClick={() => { logout(); router.push('/'); }}>
            🚪 {t(lang, 'nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
