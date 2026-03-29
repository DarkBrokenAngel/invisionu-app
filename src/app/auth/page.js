'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import styles from './auth.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('candidate');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verCode, setVerCode] = useState('');
  const [flipState, setFlipState] = useState(''); // 'out', 'in', ''
  const [error, setError] = useState('');
  const router = useRouter();
  const { language, login, register, isAuthenticated, verifyEmail, isEmailVerified } = useStore();
  const lang = language;

  useEffect(() => {
    if (isAuthenticated && isEmailVerified && !success && !isVerifying) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isEmailVerified, router, success, isVerifying]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      login({ email, role, name: email.split('@')[0] });
      
      setFlipState('out');
      setTimeout(() => {
        setSuccess(true);
        setFlipState('in');
        setTimeout(() => setFlipState(''), 50);
        setTimeout(() => router.push(role === 'admin' ? '/admin' : '/dashboard'), 1500);
      }, 300);
    } else {
      if (!fullName || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      register({ email, name: fullName, role });
      
      setFlipState('out');
      setTimeout(() => {
        setIsVerifying(true);
        setFlipState('in');
        setTimeout(() => setFlipState(''), 50);
        setLoading(false);
      }, 300);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (verCode !== '1234') {
      setError('Invalid code. (Hint: Use 1234)');
      return;
    }
    setError('');
    setLoading(true);
    verifyEmail();
    
    setFlipState('out');
    setTimeout(() => {
      setIsVerifying(false);
      setSuccess(true);
      setFlipState('in');
      setTimeout(() => setFlipState(''), 50);
      setTimeout(() => router.push(role === 'admin' ? '/admin' : '/dashboard'), 1500);
    }, 300);
  };

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />

      {/* Back to Home */}
      <button className={styles.backBtn} onClick={() => router.push('/')}>
        ← {t(lang, 'nav.home')}
      </button>

      {/* Auth Card */}
      <div className={`${styles.authCard} ${success ? styles.authSuccess : ''} ${flipState === 'out' ? styles.flipOut : flipState === 'in' ? styles.flipIn : ''} ${flipState !== '' ? 'flipping' : ''}`}>
        {success ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2>{lang === 'en' ? 'Welcome!' : lang === 'ru' ? 'Добро пожаловать!' : 'Қош келдіңіз!'}</h2>
            <p>{lang === 'en' ? 'Redirecting to dashboard...' : lang === 'ru' ? 'Перенаправляем...' : 'Бағыттау...'}</p>
            <div className={styles.successParticles}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={styles.particle} style={{
                  '--x': `${Math.random() * 200 - 100}px`,
                  '--y': `${Math.random() * -200 - 50}px`,
                  '--delay': `${Math.random() * 0.5}s`,
                  '--size': `${4 + Math.random() * 6}px`,
                }} />
              ))}
            </div>
          </div>
        ) : isVerifying ? (
          <div className={styles.verifyState}>
            <div className={styles.authHeader}>
               <h1>{lang === 'en' ? 'Verify Email' : lang === 'ru' ? 'Подтвердите почту' : 'Поштаны растаңыз'}</h1>
               <p>{lang === 'en' ? `We sent a code to ${email}` : lang === 'ru' ? `Код отправлен на ${email}` : `Код ${email} жіберілді`}</p>
            </div>
            <form onSubmit={handleVerify} className={styles.form}>
               <div className={styles.field}>
                 <label>{lang === 'en' ? 'Verification Code (Use: 1234)' : 'Код (1234)'}</label>
                 <input type="text" className="input-field" style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }} maxLength={4} value={verCode} onChange={e => setVerCode(e.target.value)} placeholder="0000" />
               </div>
               {error && <div className={styles.error}>{error}</div>}
               <button type="submit" className={`btn-neon ${styles.submitBtn}`} disabled={loading || verCode.length < 4}>
                 {loading ? <span className={styles.spinner} /> : (lang === 'en' ? 'Verify' : 'Растау')}
               </button>
            </form>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${isLogin ? styles.tabActive : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>
                {t(lang, 'auth.login')}
              </button>
              <button className={`${styles.tab} ${!isLogin ? styles.tabActive : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>
                {t(lang, 'auth.register')}
              </button>
              <div className={styles.tabIndicator} style={{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }} />
            </div>

            <div className={styles.authHeader}>
              <h1>{isLogin ? t(lang, 'auth.loginTitle') : t(lang, 'auth.registerTitle')}</h1>
              <p>{isLogin ? t(lang, 'auth.loginSubtitle') : t(lang, 'auth.registerSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {!isLogin && (
                <div className={styles.field}>
                  <label>{t(lang, 'auth.fullName')}</label>
                  <input type="text" className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                </div>
              )}

              <div className={styles.field}>
                <label>{t(lang, 'auth.email')}</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>

              <div className={styles.field}>
                <label>{t(lang, 'auth.password')}</label>
                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>

              {!isLogin && (
                <div className={styles.field}>
                  <label>{t(lang, 'auth.confirmPassword')}</label>
                  <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                </div>
              )}

              {/* Role Selector */}
              <div className={styles.field}>
                <label>{t(lang, 'auth.role')}</label>
                <div className={styles.roleSelector}>
                  <button type="button" className={`${styles.roleBtn} ${role === 'candidate' ? styles.roleActive : ''}`} onClick={() => setRole('candidate')}>
                    🎓 {t(lang, 'auth.candidate')}
                  </button>
                  <button type="button" className={`${styles.roleBtn} ${role === 'admin' ? styles.roleActive : ''}`} onClick={() => setRole('admin')}>
                    🔒 {t(lang, 'auth.adminRole')}
                  </button>
                </div>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={`btn-neon ${styles.submitBtn}`} disabled={loading}>
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  isLogin ? t(lang, 'auth.login') : t(lang, 'auth.register')
                )}
              </button>

              <button type="button" className={styles.switchBtn} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                {isLogin ? t(lang, 'auth.switchToRegister') : t(lang, 'auth.switchToLogin')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
