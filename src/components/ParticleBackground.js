'use client';
import { useEffect, useRef } from 'react';
import useStore from '@/store/useStore';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const { theme } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const numParticles = 250;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        z: Math.random() * 2000 - 1000
      });
    }

    let angleX = 0;
    let angleY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Determine dot color based on theme
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.getAttribute('data-theme') === null;
      // Use neon green in dark mode, and sleek high-opacity black/grey in light mode
      ctx.fillStyle = isDark ? 'rgba(180, 255, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)';

      angleX += 0.0005;
      angleY += 0.001;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      particles.forEach(p => {
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;

        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;

        let scale = 1000 / (1000 + z2);
        let screenX = width / 2 + x2 * scale;
        let screenY = height / 2 + y1 * scale;

        if (z2 > -1000) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.5, 2 * scale), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-run effect slightly when theme changes to pick up new color if necessary, though it reads live from document.

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Behind the content
        pointerEvents: 'none',
        opacity: 0.6
      }}
    />
  );
}
