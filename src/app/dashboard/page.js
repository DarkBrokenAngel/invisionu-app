'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import styles from './main.module.css';
import RadarChart from '@/components/RadarChart';

function ProgressRing({ progress, size = 140, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    setTimeout(() => {
      setOffset(circumference - (progress / 100) * circumference);
    }, 300);
  }, [progress, circumference]);

  return (
    <div className={styles.progressRing}>
      <svg width={size} height={size}>
        <circle className={styles.ringBg} cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
        <circle className={styles.ringProgress} cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>
      <div className={styles.ringText}>
        <span className={styles.ringPercent}>{progress}%</span>
        <span className={styles.ringLabel}>Complete</span>
      </div>
    </div>
  );
}

function XPBar({ xp, nextLevel, progress }) {
  return (
    <div className={styles.xpBar}>
      <div className={styles.xpTrack}>
        <div className={styles.xpFill} style={{ width: `${progress}%`, transition: 'width 1s ease-out' }} />
      </div>
      <div className={styles.xpInfo}>
        <span>{xp} XP</span>
        {nextLevel && <span>{nextLevel.minXP} XP</span>}
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const router = useRouter();
  const { language, user, xp, getLevel, getNextLevel, getLevelProgress, getProgress, achievements,
    interviewCompleted, cvUploaded, motivationSubmitted, earlyAppApplied, interviewScores } = useStore();
  const lang = language;
  const level = getLevel();
  const nextLevel = getNextLevel();
  const levelProgress = getLevelProgress();
  const appProgress = getProgress();

  const quickActions = [
    { icon: '🪪', title: lang === 'en' ? 'Holographic ID' : 'Голографический ID', path: '/dashboard/profile', done: true, color: '#FF0055' },
    { icon: '🤖', title: t(lang, 'dashboard.startInterview'), path: '/dashboard/interview', done: interviewCompleted, color: '#C8FF00' },
    { icon: '📄', title: t(lang, 'dashboard.uploadCV'), path: '/dashboard/cv', done: cvUploaded, color: '#00E676' },
    { icon: '✍️', title: t(lang, 'dashboard.writeLetter'), path: '/dashboard/motivation', done: motivationSubmitted, color: '#448AFF' },
    { icon: '🏆', title: t(lang, 'dashboard.viewLeaderboard'), path: '/dashboard/leaderboard', done: false, color: '#FFD600' },
  ];

  const achievementDefs = {
    profile_complete: { icon: '✅', name: lang === 'en' ? 'Profile Complete' : lang === 'ru' ? 'Профиль заполнен' : 'Профиль толтырылды' },
    early_bird: { icon: '🐦', name: t(lang, 'dashboard.earlyBird') },
    interview_done: { icon: '🎤', name: lang === 'en' ? 'Interview Done' : lang === 'ru' ? 'Интервью пройдено' : 'Сұхбат аяқталды' },
    perfect_score: { icon: '💯', name: t(lang, 'dashboard.perfectScore') },
    cv_uploaded: { icon: '📄', name: lang === 'en' ? 'CV Uploaded' : lang === 'ru' ? 'CV загружено' : 'CV жүктелді' },
    motivation_done: { icon: '✍️', name: lang === 'en' ? 'Letter Done' : lang === 'ru' ? 'Письмо написано' : 'Хат жазылды' },
  };

  return (
    <div className={styles.page}>
      {/* Welcome Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.welcomeTitle}>{t(lang, 'dashboard.welcome')}, {user?.name || 'User'} 👋</h1>
          <p className={styles.welcomeSubtitle}>
            {lang === 'en' ? "Here's your application overview" : lang === 'ru' ? 'Обзор вашей заявки' : 'Өтінім шолуы'}
          </p>
        </div>
        <div className={styles.levelBadge}>
          <span className={styles.levelEmoji}>{level.emoji}</span>
          <div>
            <div className={styles.levelName}>{level.name}</div>
            <div className={styles.levelXP}>{xp} XP</div>
          </div>
        </div>
      </div>

      {/* Top Row */}
      <div className={styles.topRow}>
        {/* Progress Card */}
        <div className={`${styles.card} ${styles.progressCard}`}>
          <h3 className={styles.cardTitle}>{t(lang, 'dashboard.progress')}</h3>
          <ProgressRing progress={appProgress} />
          <div className={styles.progressSteps}>
            <div className={`${styles.progressStep} ${true ? styles.stepDone : ''}`}>✅ {lang === 'en' ? 'Account' : lang === 'ru' ? 'Аккаунт' : 'Аккаунт'}</div>
            <div className={`${styles.progressStep} ${interviewCompleted ? styles.stepDone : ''}`}>{interviewCompleted ? '✅' : '⬜'} {t(lang, 'nav.interview')}</div>
            <div className={`${styles.progressStep} ${cvUploaded ? styles.stepDone : ''}`}>{cvUploaded ? '✅' : '⬜'} {t(lang, 'nav.cv')}</div>
            <div className={`${styles.progressStep} ${motivationSubmitted ? styles.stepDone : ''}`}>{motivationSubmitted ? '✅' : '⬜'} {t(lang, 'nav.motivation')}</div>
          </div>
        </div>

        {/* Level Card */}
        <div className={`${styles.card} ${styles.levelCard}`}>
          <h3 className={styles.cardTitle}>{t(lang, 'dashboard.level')}</h3>
          <div className={styles.levelDisplay}>
            <span className={styles.levelBigEmoji}>{level.emoji}</span>
            <span className={styles.levelBigName}>{level.name}</span>
          </div>
          <XPBar xp={xp} nextLevel={nextLevel} progress={levelProgress} />
          {nextLevel && (
            <p className={styles.nextLevelText}>
              {t(lang, 'dashboard.nextLevel')}: {nextLevel.emoji} {nextLevel.name} ({nextLevel.minXP - xp} XP {lang === 'en' ? 'to go' : lang === 'ru' ? 'осталось' : 'қалды'})
            </p>
          )}
        </div>

        {/* Score Summary */}
        {interviewScores && (
          <div className={`${styles.card} ${styles.scoreCard}`}>
            <h3 className={styles.cardTitle}>{t(lang, 'interview.score')}</h3>
            <div className={styles.scoreBig}>{interviewScores.overall}</div>
            
            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
              <RadarChart 
                scores={interviewScores} 
                categories={[
                  { key: 'motivation', label: t(lang, 'interview.motivation') },
                  { key: 'experience', label: t(lang, 'interview.experience') },
                  { key: 'skills', label: t(lang, 'interview.skills') },
                  { key: 'potential', label: t(lang, 'interview.potential') },
                ]}
                size={180}
              />
            </div>

            <div className={styles.scoreBreakdown}>
              {['motivation', 'experience', 'skills', 'potential'].map(cat => (
                <div key={cat} className={styles.scoreRow}>
                  <span>{t(lang, `interview.${cat}`)}</span>
                  <div className={styles.scoreBarTrack}>
                    <div className={styles.scoreBarFill} style={{ width: `${interviewScores[cat]}%` }} />
                  </div>
                  <span className={styles.scoreVal}>{interviewScores[cat]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t(lang, 'dashboard.quickActions')}</h3>
        <div className={styles.actionsGrid}>
          {quickActions.map((action, i) => (
            <button key={i} className={`${styles.actionCard} ${action.done ? styles.actionDone : ''}`} onClick={() => router.push(action.path)}>
              <div className={styles.actionIcon} style={{ '--action-color': action.color }}>{action.icon}</div>
              <span className={styles.actionTitle}>{action.title}</span>
              {action.done && <span className={styles.actionCheck}>✓</span>}
              <div className={styles.actionArrow}>→</div>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t(lang, 'dashboard.achievements')}</h3>
        <div className={styles.achievementsGrid}>
          {Object.entries(achievementDefs).map(([id, def]) => {
            const unlocked = achievements.includes(id);
            return (
              <div key={id} className={`${styles.achievementCard} ${unlocked ? styles.achievementUnlocked : ''}`}>
                <span className={styles.achievementIcon}>{def.icon}</span>
                <span className={styles.achievementName}>{def.name}</span>
                {unlocked && <span className={styles.achievementBadge}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
