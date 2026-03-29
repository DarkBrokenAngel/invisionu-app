'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import { mockCandidates } from '@/data/mockData';
import styles from './admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const { language, isAuthenticated, user } = useStore();
  const lang = language;
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth');
  }, [isAuthenticated, router]);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: candidates.length,
    avgScore: Math.round(candidates.reduce((a, c) => a + c.score, 0) / candidates.length),
    accepted: candidates.filter(c => c.score >= 80).length,
    pending: candidates.filter(c => c.score < 80 && c.score >= 60).length,
  };

  const handleAction = (id, action) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: action } : c));
  };

  const scoreDistribution = [
    { range: '90-100', count: candidates.filter(c => c.score >= 90).length },
    { range: '80-89', count: candidates.filter(c => c.score >= 80 && c.score < 90).length },
    { range: '70-79', count: candidates.filter(c => c.score >= 70 && c.score < 80).length },
    { range: '60-69', count: candidates.filter(c => c.score >= 60 && c.score < 70).length },
    { range: '<60', count: candidates.filter(c => c.score < 60).length },
  ];
  const maxCount = Math.max(...scoreDistribution.map(d => d.count), 1);

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>inVision<span style={{ color: 'var(--neon)' }}>U</span></span>
        </div>
        <span className={styles.adminBadge}>Admin</span>
        <nav className={styles.nav}>
          <button className={styles.navActive}>📊 {t(lang, 'admin.title')}</button>
          <button onClick={() => router.push('/dashboard')}>📋 {t(lang, 'nav.dashboard')}</button>
          <button onClick={() => router.push('/')}>🏠 {t(lang, 'nav.home')}</button>
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <h1 className={styles.title}>{t(lang, 'admin.title')}</h1>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { icon: '👥', value: stats.total, label: t(lang, 'admin.totalApplicants'), color: '#C8FF00' },
            { icon: '📊', value: stats.avgScore, label: t(lang, 'admin.avgScore'), color: '#448AFF' },
            { icon: '✅', value: `${Math.round((stats.accepted / stats.total) * 100)}%`, label: t(lang, 'admin.acceptanceRate'), color: '#00E676' },
            { icon: '⏳', value: stats.pending, label: t(lang, 'admin.pendingReview'), color: '#FFD600' },
          ].map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Score Distribution */}
        <div className={styles.chartCard}>
          <h3>{t(lang, 'admin.scoreDistribution')}</h3>
          <div className={styles.barChart}>
            {scoreDistribution.map((d, i) => (
              <div key={i} className={styles.barGroup}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ height: `${(d.count / maxCount) * 100}%` }}>
                    <span className={styles.barCount}>{d.count}</span>
                  </div>
                </div>
                <span className={styles.barLabel}>{d.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchBar}>
          <input className="input-field" placeholder={t(lang, 'admin.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Candidates Table */}
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>#</span>
            <span>{t(lang, 'leaderboard.name')}</span>
            <span>{lang === 'en' ? 'Region' : lang === 'ru' ? 'Регион' : 'Аймақ'}</span>
            <span>{t(lang, 'leaderboard.score')}</span>
            <span>{lang === 'en' ? 'Status' : lang === 'ru' ? 'Статус' : 'Мәртебе'}</span>
            <span>{lang === 'en' ? 'Actions' : lang === 'ru' ? 'Действия' : 'Әрекеттер'}</span>
          </div>
          {filtered.map((c, i) => (
            <div key={c.id} className={styles.tableRow}>
              <span>{i + 1}</span>
              <span className={styles.candidateName}>
                <span className={styles.candidateAvatar}>{c.avatar}</span>
                {c.name}
              </span>
              <span className={styles.regionTag}>{c.region}</span>
              <span className={styles.scoreCell}>
                <span className={styles.scoreBadge} style={{ '--score-color': c.score >= 80 ? '#00E676' : c.score >= 60 ? '#FFD600' : '#FF5252' }}>{c.score}</span>
              </span>
              <span>
                <span className={`${styles.statusBadge} ${c.status === 'approved' ? styles.approved : c.status === 'rejected' ? styles.rejected : styles.pendingStatus}`}>
                  {c.status || (lang === 'en' ? 'Pending' : lang === 'ru' ? 'Ожидает' : 'Күтуде')}
                </span>
              </span>
              <span className={styles.actions}>
                <button className={styles.approveBtn} onClick={() => handleAction(c.id, 'approved')} title={t(lang, 'admin.approve')}>✓</button>
                <button className={styles.rejectBtn} onClick={() => handleAction(c.id, 'rejected')} title={t(lang, 'admin.reject')}>✗</button>
                <button className={styles.waitlistBtn} onClick={() => handleAction(c.id, 'waitlisted')} title={t(lang, 'admin.waitlist')}>⏳</button>
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
