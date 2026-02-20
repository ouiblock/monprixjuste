import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  darkMode: boolean;
  language: 'fr' | 'en';
  toggleDarkMode: () => void;
  setLanguage: (lang: 'fr' | 'en') => void;
}

// Mode clair par défaut, mode sombre optionnel
const getInitialDarkMode = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('monprixjuste-app-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Si l'utilisateur a explicitement choisi, on respecte son choix
        return parsed.state?.darkMode ?? false;
      } catch {
        return false;
      }
    }
    // Par défaut : mode clair
    return false;
  }
  return false;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: getInitialDarkMode(),
      language: 'fr',
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'monprixjuste-app-storage',
    }
  )
);
