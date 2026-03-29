'use client';
import { useState } from 'react';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import { scoreMotivationLetter } from '@/utils/scoring';
import styles from './motivation.module.css';

export default function MotivationPage() {
  const { language, motivationSubmitted, motivationAnalysis, setMotivationAnalysis, addActivity } = useStore();
  const lang = language;
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const analysis = motivationAnalysis;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = async () => {
    if (wordCount < 20) return;
    setAnalyzing(true);
    const result = await scoreMotivationLetter(text);
    setMotivationAnalysis(result);
    addActivity({ type: 'motivation', message: 'Submitted motivation letter' });
    setAnalyzing(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>✍️ {t(lang, 'motivation.title')}</h1>
        <p className={styles.subtitle}>{t(lang, 'motivation.subtitle')}</p>
      </div>

      <div className={styles.editorSection}>
        <textarea className={styles.editor} value={text} onChange={(e) => setText(e.target.value)}
          placeholder={t(lang, 'motivation.placeholder')} rows={12} disabled={!!analysis} />
        <div className={styles.editorFooter}>
          <span className={`${styles.wordCount} ${wordCount >= 250 ? styles.wordCountGood : ''}`}>
            {wordCount} {t(lang, 'motivation.wordCount')} ({t(lang, 'motivation.minWords')})
          </span>
          {!analysis && (
            <button className="btn-neon" onClick={handleAnalyze} disabled={wordCount < 20 || analyzing}>
              {analyzing ? '⏳' : '🔍'} {analyzing ? t(lang, 'motivation.analyzing') : t(lang, 'motivation.analyze')}
            </button>
          )}
        </div>
      </div>

      {analysis && (
        <div className={styles.results}>
          <div className={styles.scoresGrid}>
            {[
              { key: 'authenticity', icon: '🎯', label: t(lang, 'motivation.authenticity'), value: analysis.authenticity },
              { key: 'writingQuality', icon: '✨', label: t(lang, 'motivation.writingQuality'), value: analysis.writingQuality },
              { key: 'relevance', icon: '🎪', label: t(lang, 'motivation.relevance'), value: analysis.relevance },
              { key: 'impact', icon: '💥', label: t(lang, 'motivation.impact'), value: analysis.impact },
            ].map((item) => (
              <div key={item.key} className={styles.scoreCard}>
                <div className={styles.scoreIcon}>{item.icon}</div>
                <div className={styles.scoreValue}>{item.value}%</div>
                <div className={styles.scoreLabel}>{item.label}</div>
                <div className={styles.scoreBarTrack}>
                  <div className={styles.scoreBarFill} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.themesCard}>
            <h3>🏷️ {t(lang, 'motivation.themes')}</h3>
            <div className={styles.themeTags}>
              {analysis.themes.map((theme, i) => (
                <span key={i} className={styles.themeTag}>{theme}</span>
              ))}
            </div>
          </div>

          <div className={styles.suggestionsCard}>
            <h3>💡 {t(lang, 'motivation.suggestions')}</h3>
            <ul>
              {analysis.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
