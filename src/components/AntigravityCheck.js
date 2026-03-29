'use client';
import { useEffect, useState } from 'react';
import styles from './antigravity.module.css';

export default function AntigravityCheck({ loop = false, size = 150 }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!loop) return;
    const timer = setInterval(() => setKey(k => k + 1), 4000);
    return () => clearInterval(timer);
  }, [loop]);

  return (
    <div key={key} className={styles.container}>
      {/* Expanding background ring */}
      <div className={styles.bgRing} style={{ width: size, height: size }} />

      {/* Main SVG */}
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
      >
        {/* Animated outer ring that draws in */}
        <circle
          className={styles.ringDraw}
          cx="60" cy="60" r="54"
          strokeWidth="4"
        />

        {/* Filled circle that scales in */}
        <circle
          className={styles.filledCircle}
          cx="60" cy="60" r="50"
        />

        {/* The checkmark with draw animation */}
        <polyline
          className={styles.checkPath}
          points="38,62 52,76 82,46"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Burst particles */}
      <div className={styles.burstContainer} style={{ width: size, height: size }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={styles.burstParticle}
            style={{
              '--angle': `${i * 30}deg`,
              '--delay': `${0.9 + i * 0.03}s`,
              '--dist': `${60 + Math.random() * 30}px`,
              '--size': `${4 + Math.random() * 4}px`,
              background: i % 3 === 0 ? 'var(--neon)' : i % 3 === 1 ? '#4285F4' : '#34A853',
            }}
          />
        ))}
      </div>

      {/* Expanding ring pulse */}
      <div className={styles.ringPulse} style={{ width: size, height: size }} />
    </div>
  );
}
