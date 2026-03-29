'use client';
import { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import styles from './acceptance.module.css';

function Confetti() {
  return (
    <div className={styles.confettiContainer}>
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className={styles.confettiPiece} style={{
          '--x': `${Math.random() * 100}vw`,
          '--delay': `${Math.random() * 2}s`,
          '--duration': `${2 + Math.random() * 3}s`,
          '--color': ['#C8FF00', '#00E676', '#FFD600', '#448AFF', '#FF5252', '#E040FB'][Math.floor(Math.random() * 6)],
          '--size': `${6 + Math.random() * 8}px`,
          '--rotation': `${Math.random() * 720}deg`,
        }} />
      ))}
    </div>
  );
}

function TypewriterLetter({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <span>{displayed}</span>;
}

export default function AcceptancePage() {
  const { language, user, acceptanceStatus, setAcceptanceStatus, getProgress, interviewScores } = useStore();
  const lang = language;
  const [phase, setPhase] = useState('envelope'); // envelope, opening, revealed
  const [showLetter, setShowLetter] = useState(false);
  const progress = getProgress();

  // Determine acceptance based on score
  useEffect(() => {
    if (acceptanceStatus === 'pending' && interviewScores) {
      const score = interviewScores.overall;
      if (score >= 75) setAcceptanceStatus('accepted');
      else if (score >= 55) setAcceptanceStatus('waitlisted');
      else setAcceptanceStatus('rejected');
    }
  }, [interviewScores, acceptanceStatus, setAcceptanceStatus]);

  const handleOpen = () => {
    setPhase('opening');
    setTimeout(() => setPhase('revealed'), 2000);
  };

  const status = acceptanceStatus;
  const name = user?.name || 'Candidate';

  const letterText = {
    accepted: {
      en: `Dear ${name},\n\nWe are thrilled to inform you that you have been accepted to inVision U for the 2026-2027 academic year!\n\nYour application demonstrated exceptional motivation, outstanding skills, and remarkable potential. You stood out among thousands of applicants with your unique perspective and genuine commitment to making a positive impact.\n\nYou have been awarded a Full Scholarship, covering tuition, accommodation, and living expenses.\n\nNext Steps:\n• Confirm your enrollment by June 15, 2026\n• Complete the pre-arrival orientation online\n• Join our welcome community of fellow admitted students\n\nWe look forward to welcoming you to our campus at Satbayev University, Almaty.\n\nWith warm regards,\nThe inVision U Admissions Committee`,
      ru: `Уважаемый(ая) ${name},\n\nМы рады сообщить, что вы приняты в inVision U на 2026-2027 учебный год!\n\nВаша заявка продемонстрировала исключительную мотивацию, выдающиеся навыки и замечательный потенциал.\n\nВам присуждена Полная стипендия.\n\nСледующие шаги:\n• Подтвердите зачисление до 15 июня 2026\n• Пройдите онлайн-ориентацию\n• Присоединяйтесь к сообществу принятых студентов\n\nС наилучшими пожеланиями,\nПриёмная комиссия inVision U`,
      kz: `Құрметті ${name},\n\ninVision U-ға 2026-2027 оқу жылына қабылданғаныңызды хабарлаймыз!\n\nСіздің өтінімініз ерекше мотивацияны, тамаша дағдыларды және керемет әлеуетті көрсетті.\n\nСізге Толық стипендия берілді.\n\nКелесі қадамдар:\n• 2026 жылдың 15 маусымына дейін тіркелуді растаңыз\n• Онлайн бағдарлау бағдарламасынан өтіңіз\n\nІзгі тілектермен,\ninVision U Қабылдау комиссиясы`,
    },
  };

  if (progress < 50) {
    return (
      <div className={styles.page}>
        <div className={styles.lockedCard}>
          <div className={styles.lockedIcon}>🔒</div>
          <h2>{lang === 'en' ? 'Complete Your Application' : lang === 'ru' ? 'Завершите заявку' : 'Өтінімді аяқтаңыз'}</h2>
          <p>{lang === 'en' ? 'Complete at least 50% of your application to view your results.' : lang === 'ru' ? 'Заполните хотя бы 50% заявки для просмотра результатов.' : 'Нәтижелерді көру үшін өтінімнің кемінде 50%-ын толтырыңыз.'}</p>
          <div className={styles.lockedBar}>
            <div className={styles.lockedFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.lockedPercent}>{progress}% → 50%</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {phase === 'revealed' && status === 'accepted' && <Confetti />}

      {phase === 'envelope' && (
        <div className={styles.envelopeScene}>
          <div className={styles.spotlight} />
          <div className={styles.envelope} onClick={handleOpen}>
            <div className={styles.envelopeBody}>
              <div className={styles.envelopeSeal}>◆</div>
              <div className={styles.envelopeText}>inVision U</div>
            </div>
            <p className={styles.openText}>{t(lang, 'acceptance.openEnvelope')}</p>
            <div className={styles.pulseRing} />
          </div>
        </div>
      )}

      {phase === 'opening' && (
        <div className={styles.openingScene}>
          <div className={styles.envelopeOpening}>
            <div className={styles.envelopeFlapOpen} />
            <div className={styles.letterSliding} />
          </div>
          <p className={styles.checkingText}>{t(lang, 'acceptance.checking')}</p>
        </div>
      )}

      {phase === 'revealed' && (
        <div className={styles.revealedScene}>
          {status === 'accepted' && (
            <>
              <div className={styles.acceptedHeader}>
                <div className={styles.acceptedIcon}>🎉</div>
                <h1 className={styles.acceptedTitle}>{t(lang, 'acceptance.accepted')}</h1>
                <p className={styles.acceptedMsg}>{t(lang, 'acceptance.acceptedMsg')}</p>
                <div className={styles.scholarshipBadge}>
                  🎓 {t(lang, 'acceptance.scholarshipInfo')}
                </div>
              </div>

              {!showLetter && (
                <button className="btn-neon" onClick={() => setShowLetter(true)} style={{ margin: '20px auto', display: 'block', padding: '14px 32px' }}>
                  📜 {t(lang, 'acceptance.viewLetter')}
                </button>
              )}

              {showLetter && (
                <div className={styles.letterCard}>
                  <div className={styles.letterLogo}>◆ inVision U</div>
                  <div className={styles.letterContent}>
                    <TypewriterLetter text={letterText.accepted[lang] || letterText.accepted.en} />
                  </div>
                </div>
              )}

              <button className="btn-outline" style={{ margin: '20px auto', display: 'block' }}>
                🔗 {t(lang, 'acceptance.share')}
              </button>
            </>
          )}

          {status === 'waitlisted' && (
            <div className={styles.waitlistCard}>
              <div className={styles.waitlistIcon}>⏳</div>
              <h1 className={styles.waitlistTitle}>{t(lang, 'acceptance.waitlisted')}</h1>
              <p className={styles.waitlistMsg}>{t(lang, 'acceptance.waitlistedMsg')}</p>
            </div>
          )}

          {status === 'rejected' && (
            <div className={styles.rejectedCard}>
              <div className={styles.rejectedIcon}>💙</div>
              <h1 className={styles.rejectedTitle}>{t(lang, 'acceptance.rejected')}</h1>
              <p className={styles.rejectedMsg}>{t(lang, 'acceptance.rejectedMsg')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
