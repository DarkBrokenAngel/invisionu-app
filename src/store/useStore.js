import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const LEVELS = [
  { name: 'Applicant', emoji: '🌱', minXP: 0 },
  { name: 'Rising Star', emoji: '⭐', minXP: 300 },
  { name: 'Trailblazer', emoji: '🚀', minXP: 600 },
  { name: 'Visionary', emoji: '👑', minXP: 1000 },
];

function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  return level;
}

function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.minXP) return l;
  }
  return null;
}

const useStore = create(
  persist(
    (set, get) => ({
      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Auth
      user: null,
      isAuthenticated: false,
      isEmailVerified: false,
      login: (userData) => set({ user: userData, isAuthenticated: true, isEmailVerified: true }),
      logout: () => set({
        user: null,
        isAuthenticated: false,
        isEmailVerified: false,
        xp: 0,
        interviewCompleted: false,
        interviewScores: null,
        cvUploaded: false,
        cvAnalysis: null,
        motivationSubmitted: false,
        motivationAnalysis: null,
        earlyAppApplied: false,
        scholarshipFrozen: false,
        acceptanceStatus: 'pending',
        achievements: [],
      }),
      register: (userData) => set({
        user: { ...userData, joinedAt: new Date().toISOString() },
        isAuthenticated: true,
        isEmailVerified: false,
        xp: 100,
        achievements: ['profile_complete'],
      }),
      verifyEmail: () => set({ isEmailVerified: true }),

      // XP & Gamification
      xp: 0,
      addXP: (amount) => {
        const newXP = get().xp + amount;
        set({ xp: newXP });
      },
      getLevel: () => getLevel(get().xp),
      getNextLevel: () => getNextLevel(get().xp),
      getLevelProgress: () => {
        const xp = get().xp;
        const current = getLevel(xp);
        const next = getNextLevel(xp);
        if (!next) return 100;
        const range = next.minXP - current.minXP;
        const progress = xp - current.minXP;
        return Math.round((progress / range) * 100);
      },

      // Achievements
      achievements: [],
      addAchievement: (id) => {
        const current = get().achievements;
        if (!current.includes(id)) {
          set({ achievements: [...current, id] });
        }
      },

      // Interview
      interviewCompleted: false,
      interviewScores: null,
      setInterviewResults: (scores) => {
        set({
          interviewCompleted: true,
          interviewScores: scores,
        });
        get().addXP(300);
        if (scores.overall >= 95) {
          get().addAchievement('perfect_score');
        }
        get().addAchievement('interview_done');
      },

      // CV
      cvUploaded: false,
      cvAnalysis: null,
      setCVAnalysis: (analysis) => {
        set({ cvUploaded: true, cvAnalysis: analysis });
        get().addXP(200);
        get().addAchievement('cv_uploaded');
      },

      // Motivation Letter
      motivationSubmitted: false,
      motivationAnalysis: null,
      setMotivationAnalysis: (analysis) => {
        set({ motivationSubmitted: true, motivationAnalysis: analysis });
        get().addXP(250);
        get().addAchievement('motivation_done');
      },

      // Early Application
      earlyAppApplied: false,
      applyEarly: () => {
        set({ earlyAppApplied: true });
        get().addXP(500);
        get().addAchievement('early_bird');
      },

      // Scholarship
      scholarshipFrozen: false,
      freezeDuration: null,
      frozenAt: null,
      freezeScholarship: (duration) => set({
        scholarshipFrozen: true,
        freezeDuration: duration,
        frozenAt: new Date().toISOString(),
      }),
      unfreezeScholarship: () => set({
        scholarshipFrozen: false,
        freezeDuration: null,
        frozenAt: null,
      }),

      // Acceptance
      acceptanceStatus: 'pending', // pending, accepted, waitlisted, rejected
      setAcceptanceStatus: (status) => set({ acceptanceStatus: status }),

      // Application Progress
      getProgress: () => {
        let progress = 0;
        const state = get();
        if (state.isAuthenticated) progress += 15;
        if (state.interviewCompleted) progress += 30;
        if (state.cvUploaded) progress += 25;
        if (state.motivationSubmitted) progress += 20;
        if (state.earlyAppApplied) progress += 10;
        return Math.min(progress, 100);
      },

      // Activity Log
      activities: [],
      addActivity: (activity) => {
        const activities = get().activities;
        set({
          activities: [
            { ...activity, timestamp: new Date().toISOString(), id: Date.now() },
            ...activities.slice(0, 19),
          ],
        });
      },
    }),
    {
      name: 'invisionu-store',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isEmailVerified: state.isEmailVerified,
        xp: state.xp,
        achievements: state.achievements,
        interviewCompleted: state.interviewCompleted,
        interviewScores: state.interviewScores,
        cvUploaded: state.cvUploaded,
        cvAnalysis: state.cvAnalysis,
        motivationSubmitted: state.motivationSubmitted,
        motivationAnalysis: state.motivationAnalysis,
        earlyAppApplied: state.earlyAppApplied,
        scholarshipFrozen: state.scholarshipFrozen,
        freezeDuration: state.freezeDuration,
        frozenAt: state.frozenAt,
        acceptanceStatus: state.acceptanceStatus,
        activities: state.activities,
      }),
    }
  )
);

export default useStore;
export { LEVELS };
