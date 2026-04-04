'use client';
import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';

export default function ThemeProvider({ children }) {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'dark');
  }, [theme]);

  // Support for Next.js hydration safety with persistent Zustand state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return <div style={{ visibility: mounted ? 'visible' : 'hidden', display: 'contents' }}>{children}</div>;
}
