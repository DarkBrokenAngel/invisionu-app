'use client';
import { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import { mockCandidates } from '@/data/mockData';
import styles from './leaderboard.module.css';

export default function LeaderboardPage() {
  const { language, user, xp, getLevel, interviewScores } = useStore();
  const lang = language;
  const [candidates, setCandidates] = useState(mockCandidates);
  const [filter, setFilter] = useState('all');

  // Insert current user
  const userScore = interviewScores?.overall || 50;
  const userEntry = {
    id: 'me',
    name: user?.name || 'You',
    region: 'Almaty',
    program: 'Science & Technology',
    score: userScore,
    xp: xp,
    level: getLevel().name,
    avatar: '🧑‍💻',
    change: 0,
    isYou: true,
  };

  const allCandidates = [...candidates, userEntry].sort((a, b) => b.score - a.score);
  const userRank = allCandidates.findIndex(c => c.id === 'me') + 1;

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCandidates(prev => prev.map(c => ({
        ...c,
        score: Math.max(40, Math.min(99, c.score + Math.floor(Math.random() * 3) - 1)),
        change: Math.floor(Math.random() * 5) - 2,
      })));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'all' ? allCandidates :
    allCandidates.filter(c => c.region === filter || c.program === filter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>🏆 {t(lang, 'leaderboard.title')}</h1>
        <p className={styles.subtitle}>{t(lang, 'leaderboard.subtitle')}</p>
      </div>

      {/* Your Position */}
      <div className={styles.yourPosition}>
        <span className={styles.yourLabel}>{t(lang, 'leaderboard.yourPosition')}</span>
        <span className={styles.yourRank}>#{userRank}</span>
        <span className={styles.yourOf}>/ {allCandidates.length}</span>
        <span className={styles.yourScore}>{userScore} pts</span>
      </div>

      {/* Top 3 Podium */}
      <div className={styles.podium}>
        {[1, 0, 2].map((idx) => {
          const c = allCandidates[idx];
          if (!c) return null;
          const place = idx + 1;
          return (
            <div key={idx} className={`${styles.podiumCard} ${styles[`podium${place}`]} ${c.isYou ? styles.podiumYou : ''}`}>
              <div className={styles.podiumMedal}>{place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'}</div>
              <div className={styles.podiumAvatar}>{c.avatar}</div>
              <div className={styles.podiumName}>{c.isYou ? '⭐ You' : c.name}</div>
              <div className={styles.podiumScore}>{c.score} pts</div>
              <div className={styles.podiumBase} style={{ height: place === 1 ? '80px' : place === 2 ? '60px' : '40px' }} />
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {['all', 'Almaty', 'Astana', 'Shymkent'].map(f => (
          <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? t(lang, 'leaderboard.filterAll') : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.colRank}>{t(lang, 'leaderboard.rank')}</span>
          <span className={styles.colName}>{t(lang, 'leaderboard.name')}</span>
          <span className={styles.colScore}>{t(lang, 'leaderboard.score')}</span>
          <span className={styles.colLevel}>{t(lang, 'leaderboard.level')}</span>
          <span className={styles.colChange}>{t(lang, 'leaderboard.change')}</span>
        </div>
        {filtered.map((c, i) => (
          <div key={c.id} className={`${styles.tableRow} ${c.isYou ? styles.tableRowYou : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
            <span className={styles.colRank}>
              <span className={styles.rankNum}>{i + 1}</span>
            </span>
            <span className={styles.colName}>
              <span className={styles.avatar}>{c.avatar}</span>
              <span>{c.isYou ? `⭐ ${c.name}` : c.name}</span>
            </span>
            <span className={styles.colScore}><span className={styles.scoreNum}>{c.score}</span></span>
            <span className={styles.colLevel}>{c.level}</span>
            <span className={`${styles.colChange} ${c.change > 0 ? styles.changeUp : c.change < 0 ? styles.changeDown : ''}`}>
              {c.change > 0 ? `↑${c.change}` : c.change < 0 ? `↓${Math.abs(c.change)}` : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
