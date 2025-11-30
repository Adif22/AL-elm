import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, Language } from '../types';

interface AppContextType {
  settings: AppSettings;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: AppSettings['fontSize']) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const defaultSettings: AppSettings = {
  language: Language.BANGLA,
  theme: 'light',
  fontSize: 'medium'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load from local storage on mount (optional, simplified for this demo)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setSettings(prev => ({ ...prev, theme: savedTheme }));
  }, []);

  const setLanguage = (language: Language) => setSettings(prev => ({ ...prev, language }));
  const setTheme = (theme: 'light' | 'dark') => {
    setSettings(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  };
  const setFontSize = (fontSize: AppSettings['fontSize']) => setSettings(prev => ({ ...prev, fontSize }));
  
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AppContext.Provider value={{ settings, setLanguage, setTheme, setFontSize, isLoggedIn, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
