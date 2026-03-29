'use client';
import { useState, useRef } from 'react';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import { scoreCV } from '@/utils/scoring';
import styles from './cv.module.css';

export default function CVPage() {
  const { language, cvUploaded, cvAnalysis, setCVAnalysis, addActivity } = useStore();
  const lang = language;
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (f) => {
    setFile(f);
    setAnalyzing(true);
    const result = await scoreCV(f.name);
    setCVAnalysis(result);
    addActivity({ type: 'cv', message: 'Uploaded and analyzed CV' });
    setAnalyzing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const analysis = cvAnalysis;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📄 {t(lang, 'cv.title')}</h1>
        <p className={styles.subtitle}>{t(lang, 'cv.subtitle')}</p>
      </div>

      {!analysis && !analyzing && (
        <div className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
          <div className={styles.dropIcon}>📂</div>
          <h3>{t(lang, 'cv.dragDrop')}</h3>
          <p>{t(lang, 'cv.or')}</p>
          <button className="btn-outline">{t(lang, 'cv.browse')}</button>
          <span className={styles.formats}>{t(lang, 'cv.formats')}</span>
        </div>
      )}

      {analyzing && (
        <div className={styles.analyzingCard}>
          <div className={styles.analyzingSpinner} />
          <h3>{t(lang, 'cv.analyzing')}</h3>
          <div className={styles.analyzingBar}><div className={styles.analyzingFill} /></div>
        </div>
      )}

      {analysis && (
        <div className={styles.results}>
          <div className={styles.matchCard}>
            <div className={styles.matchCircle}>
              <span className={styles.matchScore}>{analysis.matchScore}%</span>
            </div>
            <h3>{t(lang, 'cv.matchScore')}</h3>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>💼</span>
              <span className={styles.infoValue}>{analysis.experienceYears}</span>
              <span className={styles.infoLabel}>{t(lang, 'cv.experienceYears')}</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>🎓</span>
              <span className={styles.infoValue}>{analysis.education}</span>
              <span className={styles.infoLabel}>{t(lang, 'cv.education')}</span>
            </div>
          </div>

          <div className={styles.skillsCard}>
            <h3>{t(lang, 'cv.skillsFound')}</h3>
            <div className={styles.skillsList}>
              {analysis.skills.map((skill, i) => (
                <div key={i} className={styles.skillRow}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <div className={styles.skillBarTrack}>
                    <div className={styles.skillBarFill} style={{ width: `${skill.level}%`, animationDelay: `${i * 0.1}s` }} />
                  </div>
                  <span className={styles.skillLevel}>{skill.level}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.suggestionsCard}>
            <h3>💡 {t(lang, 'cv.suggestions')}</h3>
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
