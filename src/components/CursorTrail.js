'use client';
import { useEffect, useRef } from 'react';
import styles from './cursor.module.css';

export default function CursorTrail() {
  const glowRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const smoothPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let frameId;
    const animate = () => {
      // Smooth interpolation — buttery 0.08 factor
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * 0.08;
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${smoothPos.current.x - 150}px, ${smoothPos.current.y - 150}px)`;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={glowRef} className={styles.cursorGlow} />;
}
