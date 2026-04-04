'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './cursor.module.css';

/**
 * CursorTrail — Thanos Snap Dust Disintegration Effect
 * 
 * The cursor leaves behind tiny particles that float away and 
 * disintegrate like the Infinity Gauntlet snap from Avengers: Endgame.
 * Particles drift in random directions, fade, shrink, and dissolve.
 */
export default function CursorTrail() {
  const pointerWrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const prevPos = useRef({ x: -100, y: -100 });
  const particles = useRef([]);
  const frameId = useRef(null);

  const [isHovering, setIsHovering] = useState(false);

  // Spawn dust particles along cursor path
  const spawnParticles = useCallback((x, y) => {
    // Calculate movement speed to scale particle emission
    const dx = x - prevPos.current.x;
    const dy = y - prevPos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // More particles when moving fast, fewer when slow
    const count = Math.min(Math.floor(speed * 0.3), 5);

    for (let i = 0; i < Math.max(count, 1); i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 0.3 + Math.random() * 1.5;
      const size = 2 + Math.random() * 4;
      const life = 40 + Math.random() * 50; // frames to live

      particles.current.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * velocity + (dx * 0.05),
        vy: Math.sin(angle) * velocity + (dy * 0.05) - 0.3, // slight upward drift
        size,
        maxLife: life,
        life,
        // Random color between neon green, gold, and white dust
        color: [
          `rgba(200, 255, 0, `,   // neon green
          `rgba(255, 215, 0, `,    // gold
          `rgba(255, 255, 255, `,  // white
          `rgba(150, 220, 50, `,   // lime
        ][Math.floor(Math.random() * 4)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        // Some particles are squares, some circles for variety
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }

    // Cap total particles for performance
    if (particles.current.length > 200) {
      particles.current = particles.current.slice(-200);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Match canvas to window size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Hide native cursor
    const hideCursors = () => {
      document.body.style.cursor = 'none';
      document.querySelectorAll('a, button, input, textarea, select, [role="button"]').forEach(el => {
        el.style.cursor = 'none';
      });
    };
    hideCursors();
    const observer = new MutationObserver(hideCursors);
    observer.observe(document.body, { childList: true, subtree: true });

    let spawnCounter = 0;

    const handleMouseMove = (e) => {
      prevPos.current = { ...pos.current };
      pos.current = { x: e.clientX, y: e.clientY };
      spawnCounter++;
      // Spawn particles every 2nd frame for performance
      if (spawnCounter % 2 === 0) {
        spawnParticles(e.clientX, e.clientY);
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, input, textarea, select, [role="button"], .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Animation loop — update and render particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update custom pointer position
      if (pointerWrapperRef.current) {
        pointerWrapperRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      // Update and draw each particle
      particles.current = particles.current.filter(p => {
        p.life--;
        if (p.life <= 0) return false;

        // Physics: slow down, drift upward (gravity reversed = dust floating up)
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vy -= 0.02; // float upward
        p.rotation += p.rotSpeed;

        // Thanos snap: particles break apart and dissolve
        const progress = 1 - (p.life / p.maxLife);
        const alpha = Math.max(0, 1 - progress * progress); // quadratic fade
        const scale = 1 - progress * 0.6; // shrink as they die
        const currentSize = p.size * scale;

        if (currentSize <= 0.2) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;

        // Draw the particle
        ctx.fillStyle = p.color + alpha.toFixed(2) + ')';

        if (p.shape === 'rect') {
          ctx.fillRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, currentSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      frameId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      document.body.style.cursor = '';
    };
  }, [spawnParticles]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.dustCanvas} />
      <div ref={pointerWrapperRef} className={styles.pointerWrapper}>
        <div className={`${styles.customPointer} ${isHovering ? styles.pointerHover : ''}`} />
      </div>
    </>
  );
}
