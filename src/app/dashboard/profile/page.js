'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useStore, { LEVELS } from '@/store/useStore';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, xp, getLevel, achievements } = useStore();
  const level = getLevel();
  const levelIndex = LEVELS.findIndex(l => l.name === level.name) + 1;
  
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [foil, setFoil] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-15 to 15 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotate({ x: rotateX, y: rotateY });
    
    // Glare position (percentage)
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
    
    // Foil translation
    setFoil({
      x: ((x / rect.width) * 100) - 50,
      y: ((y / rect.height) * 100) - 50
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
    setFoil({ x: 0, y: 0 });
  };

  const [editName, setEditName] = useState(user?.name || 'Applicant');
  
  const handleSave = () => {
    setUser({ ...user, name: editName });
  };

  return (
    <div className={styles.page}>
      <button className="btn-outline" onClick={() => router.push('/dashboard')} style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
        ← Back to Dashboard
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>Holographic ID</h1>
        <p className={styles.subtitle}>Your official Decentrathon 5.0 Candidate License</p>
      </div>

      <div className={styles.scene}>
        <div 
          ref={cardRef}
          className={styles.idCard}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            '--mouse-x': `${glare.x}%`,
            '--mouse-y': `${glare.y}%`,
            '--foil-x': `${foil.x}%`,
            '--foil-y': `${foil.y}%`,
          }}
        >
          {/* Holographic Overlays */}
          <div className={styles.foil} />
          <div className={styles.glare} />
          
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.brand}>INVISION U</div>
              <div className={styles.cardType}>Candidate</div>
            </div>
            
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>{level.emoji}</div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user?.name || 'Applicant'}</div>
                <div className={styles.userLevel}>{level.name}</div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Total XP</div>
                <div className={styles.statValue}>{xp}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Achievements</div>
                <div className={styles.statValue}>{achievements.length}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Status</div>
                <div className={styles.statValue} style={{ color: 'var(--neon)', fontSize: '14px', lineHeight: '24px' }}>VERIFIED</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Access</div>
                <div className={styles.statValue} style={{ color: '#FFD600', fontSize: '14px', lineHeight: '24px' }}>LEVEL {levelIndex}</div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.barcode} />
              <div className={styles.idNumber}>IVU-XX7734</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlField}>
          <label className={styles.controlLabel}>Display Name</label>
          <input 
            type="text" 
            className={styles.inputField} 
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </div>
        <button className="btn-neon" style={{ width: '100%' }} onClick={handleSave}>
          Update ID Module
        </button>
      </div>
    </div>
  );
}
