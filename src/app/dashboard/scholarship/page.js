'use client';
import { useState } from 'react';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import styles from './scholarship.module.css';

export default function ScholarshipPage() {
  const { language, scholarshipFrozen, freezeDuration, frozenAt, freezeScholarship, unfreezeScholarship, addActivity } = useStore();
  const lang = language;
  const [selectedDuration, setSelectedDuration] = useState('semester');
  const [showConfirm, setShowConfirm] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleFreeze = () => {
    setAnimating(true);
    setTimeout(() => {
      freezeScholarship(selectedDuration);
      addActivity({ type: 'scholarship', message: `Froze scholarship for ${selectedDuration}` });
      setShowConfirm(false);
      setAnimating(false);
    }, 1500);
  };

  const handleUnfreeze = () => {
    setAnimating(true);
    setTimeout(() => {
      unfreezeScholarship();
      addActivity({ type: 'scholarship', message: 'Unfroze scholarship' });
      setAnimating(false);
    }, 1500);
  };

  const durations = [
    { key: 'semester', label: t(lang, 'scholarship.semester'), months: 6 },
    { key: 'oneYear', label: t(lang, 'scholarship.oneYear'), months: 12 },
    { key: 'twoYears', label: t(lang, 'scholarship.twoYears'), months: 24 },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>❄️ {t(lang, 'scholarship.title')}</h1>
        <p className={styles.subtitle}>{t(lang, 'scholarship.subtitle')}</p>
      </div>

      {/* Status */}
      <div className={`${styles.statusCard} ${scholarshipFrozen ? styles.statusFrozen : styles.statusActive}`}>
        <div className={styles.statusIcon}>{scholarshipFrozen ? '🧊' : '✅'}</div>
        <div>
          <div className={styles.statusLabel}>{t(lang, 'scholarship.status')}</div>
          <div className={styles.statusValue}>
            {scholarshipFrozen ? t(lang, 'scholarship.frozen') : t(lang, 'scholarship.active')}
          </div>
        </div>
        {scholarshipFrozen && (
          <div className={styles.frozenInfo}>
            <span>{t(lang, 'scholarship.duration')}: {freezeDuration}</span>
          </div>
        )}
      </div>

      {/* Ice Animation */}
      {animating && (
        <div className={styles.iceAnimation}>
          <div className={styles.iceParticles}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={styles.iceParticle} style={{
                '--x': `${Math.random() * 200 - 100}px`,
                '--y': `${Math.random() * -150 - 50}px`,
                '--delay': `${Math.random() * 0.5}s`,
                '--size': `${4 + Math.random() * 8}px`,
              }}>❄️</div>
            ))}
          </div>
          <p>{scholarshipFrozen ? '🔥 Unfreezing...' : '❄️ Freezing...'}</p>
        </div>
      )}

      {!scholarshipFrozen && !animating && (
        <>
          {/* Duration Selector */}
          <div className={styles.durationSection}>
            <h3>{t(lang, 'scholarship.duration')}</h3>
            <div className={styles.durationGrid}>
              {durations.map(d => (
                <button key={d.key} className={`${styles.durationCard} ${selectedDuration === d.key ? styles.durationActive : ''}`}
                  onClick={() => setSelectedDuration(d.key)}>
                  <span className={styles.durationIcon}>📅</span>
                  <span className={styles.durationLabel}>{d.label}</span>
                  <span className={styles.durationMonths}>{d.months} {lang === 'en' ? 'months' : lang === 'ru' ? 'мес.' : 'ай'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className={styles.warningCard}>
            ⚠️ {t(lang, 'scholarship.warning')}
          </div>

          {/* Freeze Button */}
          <button className="btn-neon" onClick={() => setShowConfirm(true)} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
            ❄️ {t(lang, 'scholarship.freeze')}
          </button>

          {showConfirm && (
            <div className={styles.confirmOverlay} onClick={() => setShowConfirm(false)}>
              <div className={styles.confirmCard} onClick={e => e.stopPropagation()}>
                <h3>❄️ {t(lang, 'scholarship.confirm')}?</h3>
                <p>{t(lang, 'scholarship.warning')}</p>
                <div className={styles.confirmActions}>
                  <button className="btn-outline" onClick={() => setShowConfirm(false)}>{t(lang, 'scholarship.cancelFreeze')}</button>
                  <button className="btn-neon" onClick={handleFreeze}>{t(lang, 'scholarship.confirm')}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {scholarshipFrozen && !animating && (
        <button className="btn-neon" onClick={handleUnfreeze} style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '24px' }}>
          🔥 {t(lang, 'scholarship.unfreeze')}
        </button>
      )}
    </div>
  );
}
