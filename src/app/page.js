'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import styles from './page.module.css';
import AntigravityCheck from '@/components/AntigravityCheck';

/* ===== Gradient Mesh Background (Google-style animated blobs) ===== */
function GradientMesh() {
  return (
    <div className={styles.meshBg}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      <div className={styles.blob4} />
      <div className={styles.meshNoise} />
    </div>
  );
}

/* ===== Smooth counter ===== */
function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ===== Typewriter ===== */
function TypewriterText({ texts, speed = 80 }) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) setCharIndex(charIndex + 1);
        else setTimeout(() => setIsDeleting(true), 2000);
      } else {
        if (charIndex > 0) setCharIndex(charIndex - 1);
        else { setIsDeleting(false); setTextIndex((textIndex + 1) % texts.length); }
      }
    }, isDeleting ? 40 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed]);

  return (
    <span className={styles.typewriter}>
      {texts[textIndex].substring(0, charIndex)}
      <span className={styles.cursor}>|</span>
    </span>
  );
}

/* ===== Scroll Reveal ===== */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealed : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ===== Navbar ===== */
function Navbar({ lang, setLang }) {
  const router = useRouter();
  const { isAuthenticated, theme, toggleTheme } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.navContent}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>inVision<span className="text-neon">U</span></span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>{t(lang, 'nav.features')}</a>
          <a href="#about" className={styles.navLink}>{t(lang, 'nav.about')}</a>
          <div className={styles.langSwitcher}>
            <button className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`${styles.langBtn} ${lang === 'ru' ? styles.langActive : ''}`} onClick={() => setLang('ru')}>RU</button>
            <button className={`${styles.langBtn} ${lang === 'kz' ? styles.langActive : ''}`} onClick={() => setLang('kz')}>KZ</button>
          </div>
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isAuthenticated ? (
            <button className="btn-neon" onClick={() => router.push('/dashboard')}>{t(lang, 'nav.dashboard')}</button>
          ) : (
            <button className="btn-neon" onClick={() => router.push('/auth')}>{t(lang, 'nav.apply')}</button>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ===== Main Page ===== */
export default function Home() {
  const { language, setLanguage } = useStore();
  const [lang, setLang] = useState('en');
  const router = useRouter();

  useEffect(() => { setLang(language); }, [language]);
  const handleSetLang = (l) => { setLang(l); setLanguage(l); };

  const typewriterTexts = {
    en: ['Future Leaders', 'Innovators', 'Problem Solvers', 'Change Makers'],
    ru: ['Будущих лидеров', 'Инноваторов', 'Решателей проблем', 'Создателей перемен'],
    kz: ['Болашақ көшбасшыларды', 'Инноваторларды', 'Мәселе шешушілерді', 'Өзгеріс жасаушыларды'],
  };

  return (
    <main className={styles.main}>
      <Navbar lang={lang} setLang={handleSetLang} />

      {/* Hero — clean, spacious, Google-style */}
      <section className={styles.hero}>
        <GradientMesh />
        <div className={styles.heroContent}>
          <div className={styles.heroAnimation}>
            <AntigravityCheck loop={true} size={100} />
          </div>
          <Reveal>
            <div className={styles.heroBadge}>{t(lang, 'hero.badge')}</div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className={styles.heroTitle}>
              {t(lang, 'hero.title1')}{' '}
              <span className="text-gradient">{t(lang, 'hero.titleHighlight')}</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <h2 className={styles.heroSubtitle}>
              {lang === 'en' ? 'Discovering ' : lang === 'ru' ? 'Открываем ' : 'Ашамыз '}
              <TypewriterText texts={typewriterTexts[lang]} />
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <p className={styles.heroDesc}>{t(lang, 'hero.subtitle')}</p>
          </Reveal>
          <Reveal delay={400}>
            <div className={styles.heroCta}>
              <button className="btn-neon" onClick={() => router.push('/auth')} style={{ padding: '16px 40px', fontSize: '16px' }}>
                {t(lang, 'hero.cta')} →
              </button>
              <button className="btn-outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '16px 40px', fontSize: '16px' }}>
                {t(lang, 'hero.ctaSecondary')}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats bar */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {[
            { end: 100, suffix: '%', label: t(lang, 'hero.stats.scholarships') },
            { end: 2000, suffix: '+', label: t(lang, 'hero.stats.students') },
            { end: 5, suffix: '+', label: t(lang, 'hero.stats.campuses') },
            { end: 15, suffix: '%', label: t(lang, 'hero.stats.acceptance') },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}><AnimatedCounter end={s.end} suffix={s.suffix} /></div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {[...Array(3)].map((_, group) => (
            <div key={group} className={styles.marqueeGroup}>
              {['AI-POWERED', '•', 'GAMIFIED', '•', 'MULTILINGUAL', '•', 'REAL-TIME', '•', 'INVISION U', '•', 'DECENTRATHON 5.0', '•', 'SMART SCREENING', '•'].map((text, i) => (
                <span key={i} className={text === '•' ? styles.marqueeDot : styles.marqueeItem}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className={styles.features}>
        <Reveal><div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t(lang, 'features.title')}</h2>
          <p className={styles.sectionSubtitle}>{t(lang, 'features.subtitle')}</p>
        </div></Reveal>
        <div className={styles.featuresGrid}>
          {[
            { icon: '🤖', title: t(lang, 'features.aiInterview.title'), desc: t(lang, 'features.aiInterview.desc') },
            { icon: '📊', title: t(lang, 'features.cvAnalysis.title'), desc: t(lang, 'features.cvAnalysis.desc') },
            { icon: '✍️', title: t(lang, 'features.motivationLetter.title'), desc: t(lang, 'features.motivationLetter.desc') },
            { icon: '🎮', title: t(lang, 'features.gamification.title'), desc: t(lang, 'features.gamification.desc') },
            { icon: '⏰', title: t(lang, 'features.earlyApp.title'), desc: t(lang, 'features.earlyApp.desc') },
            { icon: '❄️', title: t(lang, 'features.scholarship.title'), desc: t(lang, 'features.scholarship.desc') },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className={styles.howItWorks}>
        <Reveal><div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{lang === 'en' ? 'How It Works' : lang === 'ru' ? 'Как это работает' : 'Қалай жұмыс істейді'}</h2>
          <p className={styles.sectionSubtitle}>
            {lang === 'en' ? 'Your journey from application to acceptance in 4 simple steps' : lang === 'ru' ? 'Ваш путь от заявки до зачисления в 4 простых шага' : 'Өтінімнен қабылдауға дейінгі 4 қарапайым қадам'}
          </p>
        </div></Reveal>
        <div className={styles.stepsGrid}>
          {[
            { num: '01', icon: '📝', title: lang === 'en' ? 'Create Account' : lang === 'ru' ? 'Создайте аккаунт' : 'Аккаунт жасаңыз', desc: lang === 'en' ? 'Register and complete your profile to get started' : lang === 'ru' ? 'Зарегистрируйтесь и заполните профиль' : 'Тіркеліңіз және профиліңізді толтырыңыз' },
            { num: '02', icon: '🤖', title: lang === 'en' ? 'AI Evaluation' : lang === 'ru' ? 'Оценка ИИ' : 'AI Бағалау', desc: lang === 'en' ? 'Complete the AI interview, upload CV, and write your motivation letter' : lang === 'ru' ? 'Пройдите AI интервью, загрузите CV и напишите мотивационное письмо' : 'AI сұхбаттан өтіңіз, CV жүктеңіз және мотивациялық хат жазыңыз' },
            { num: '03', icon: '📊', title: lang === 'en' ? 'Get Scored' : lang === 'ru' ? 'Получите оценку' : 'Бағаңызды алыңыз', desc: lang === 'en' ? 'AI analyzes your responses and provides comprehensive scoring' : lang === 'ru' ? 'ИИ анализирует ваши ответы и предоставляет комплексную оценку' : 'AI жауаптарыңызды талдайды және жан-жақты баға береді' },
            { num: '04', icon: '🎉', title: lang === 'en' ? 'Get Results' : lang === 'ru' ? 'Узнайте результат' : 'Нәтижені біліңіз', desc: lang === 'en' ? 'Receive your acceptance with a cinematic reveal experience' : lang === 'ru' ? 'Получите результат с кинематографической презентацией' : 'Кинематографиялық тәжірибемен нәтижеңізді алыңыз' },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <Reveal>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              {lang === 'en' ? 'Ready to Begin?' : lang === 'ru' ? 'Готовы начать?' : 'Бастауға дайынсыз ба?'}
            </h2>
            <p className={styles.ctaDesc}>
              {lang === 'en' ? 'Join thousands of applicants discovering their potential with AI.' : lang === 'ru' ? 'Присоединяйтесь к тысячам кандидатов, открывающих свой потенциал с ИИ.' : 'AI арқылы әлеуетін ашатын мыңдаған кандидаттарға қосылыңыз.'}
            </p>
            <button className="btn-neon" onClick={() => router.push('/auth')} style={{ padding: '18px 48px', fontSize: '18px' }}>
              {t(lang, 'hero.cta')} →
            </button>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◆</span>
              <span className={styles.logoText}>inVision<span className="text-neon">U</span></span>
            </div>
            <p className={styles.footerTagline}>{t(lang, 'footer.tagline')}</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>{t(lang, 'footer.quickLinks')}</h4>
            <a href="#features">{t(lang, 'nav.features')}</a>
            <a href="#about">{t(lang, 'nav.about')}</a>
            <a href="https://invisionu.education" target="_blank" rel="noopener noreferrer">Official Site</a>
          </div>
          <div className={styles.footerLinks}>
            <h4>{t(lang, 'footer.contact')}</h4>
            <a href="mailto:info@invisionu.education">info@invisionu.education</a>
            <a href="tel:+77710707370">+7 771 070 73 70</a>
            <span>Satbayev University, Almaty</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>{t(lang, 'footer.rights')}</span>
        </div>
      </footer>
    </main>
  );
}
