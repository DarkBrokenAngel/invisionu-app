import React from 'react';
import styles from './RadarChart.module.css';

export default function RadarChart({ scores, categories, size = 200 }) {
  const center = size / 2;
  const radius = (size / 2) - 30; // 30px padding for labels
  const angleStep = (2 * Math.PI) / categories.length;

  const getPoint = (value, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const points = categories.map((cat, i) => getPoint(scores[cat.key] || 0, i));

  return (
    <div className={styles.radarContainer}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.radar}>
        {/* Grids */}
        {[0.25, 0.5, 0.75, 1].map(scale => (
          <polygon key={scale} className={styles.radarGrid}
            points={categories.map((_, i) => {
              const angle = angleStep * i - Math.PI / 2;
              return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`;
            }).join(' ')} />
        ))}
        {/* Axes */}
        {categories.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return <line key={i} className={styles.radarAxis} x1={center} y1={center}
            x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} />;
        })}
        {/* Data Polygon */}
        <polygon className={styles.radarData} points={points.map(p => `${p.x},${p.y}`).join(' ')} />
        {/* Data Points */}
        {points.map((p, i) => (
          <circle key={`pt-${i}`} className={styles.radarPoint} cx={p.x} cy={p.y} r={4} />
        ))}
        {/* Labels */}
        {categories.map((cat, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const labelR = radius + 22;
          return (
            <text key={cat.key} className={styles.radarLabel}
              x={center + labelR * Math.cos(angle)} y={center + labelR * Math.sin(angle)}
              textAnchor="middle" dominantBaseline="middle">
              {cat.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
