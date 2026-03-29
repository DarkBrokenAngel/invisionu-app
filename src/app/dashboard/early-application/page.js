'use client';
import { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import styles from './early.module.css';

export default function EarlyApplicationPage() {
  const { language, earlyAppApplied, applyEarly, addActivity } = useStore();
  const lang = language;
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown to a future deadline
  useEffect(() => {
    const deadline = new Date('2026-05-15T23:59:59');
    const updateCountdown = () => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApply = () => {
    applyEarly();
    addActivity({ type: 'early', message: 'Applied for early application' });
  };

  const benefits = [
    { icon: '⚡', title: t(lang, 'earlyApp.priorityReview'), desc: t(lang, 'earlyApp.priorityReviewDesc') },
    { icon: '🎯', title: t(lang, 'earlyApp.bonusXP'), desc: t(lang, 'earlyApp.bonusXPDesc') },
    { icon: '🎓', title: t(lang, 'earlyApp.mentoring'), desc: t(lang, 'earlyApp.mentoringDesc') },
    { icon: '📋', title: t(lang, 'earlyApp.shortlist'), desc: t(lang, 'earlyApp.shortlistDesc') },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>⏰ {t(lang, 'earlyApp.title')}</h1>
        <p className={styles.subtitle}>{t(lang, 'earlyApp.subtitle')}</p>
      </div>

      {/* Countdown */}
      <div className={styles.countdownCard}>
        <h3 className={styles.countdownLabel}>{t(lang, 'earlyApp.deadline')}</h3>
        <div className={styles.countdownGrid}>
          {[
            { value: countdown.days, label: lang === 'en' ? 'Days' : lang === 'ru' ? 'Дней' : 'Күн' },
            { value: countdown.hours, label: lang === 'en' ? 'Hours' : lang === 'ru' ? 'Часов' : 'Сағат' },
            { value: countdown.minutes, label: lang === 'en' ? 'Minutes' : lang === 'ru' ? 'Минут' : 'Минут' },
            { value: countdown.seconds, label: lang === 'en' ? 'Seconds' : lang === 'ru' ? 'Секунд' : 'Секунд' },
          ].map((item, i) => (
            <div key={i} className={styles.countdownItem}>
              <span className={styles.countdownNum}>{String(item.value).padStart(2, '0')}</span>
              <span className={styles.countdownUnit}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className={styles.benefitsSection}>
        <h3 className={styles.benefitsTitle}>{t(lang, 'earlyApp.benefits')}</h3>
        <div className={styles.benefitsGrid}>
          {benefits.map((b, i) => (
            <div key={i} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>{b.icon}</div>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.ctaCard}>
        {earlyAppApplied ? (
          <div className={styles.appliedState}>
            <div className={styles.appliedIcon}>✅</div>
            <h2>{t(lang, 'earlyApp.applied')}</h2>
            <p className={styles.appliedBadge}>+500 XP 🎉</p>
          </div>
        ) : (
          <>
            <p className={styles.ctaText}>
              {lang === 'en' ? 'Apply early to unlock exclusive benefits and boost your chances!' : lang === 'ru' ? 'Подайте заявку раньше, чтобы получить эксклюзивные преимущества!' : 'Ерте өтінім беріңіз және артықшылықтарды алыңыз!'}
            </p>
            <button className="btn-neon" onClick={handleApply} style={{ padding: '16px 40px', fontSize: '16px' }}>
              {t(lang, 'earlyApp.applyEarly')} →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
