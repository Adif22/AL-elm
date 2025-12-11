
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, Language, UserProfile } from '../types';

interface AppContextType {
  settings: AppSettings;
  user: UserProfile | null;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: AppSettings['fontSize']) => void;
  login: (provider: 'google' | 'facebook' | 'guest', mockData?: Partial<UserProfile>) => void;
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
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setSettings(prev => ({ ...prev, theme: savedTheme }));

    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
        try {
            setUser(JSON.parse(savedUser));
        } catch(e) { console.error("Session parse error", e); }
    }
  }, []);

  const setLanguage = (language: Language) => setSettings(prev => ({ ...prev, language }));
  const setTheme = (theme: 'light' | 'dark') => {
    setSettings(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  };
  const setFontSize = (fontSize: AppSettings['fontSize']) => setSettings(prev => ({ ...prev, fontSize }));
  
  const login = (provider: 'google' | 'facebook' | 'guest', mockData?: Partial<UserProfile>) => {
    const newUser: UserProfile = {
        id: Date.now().toString(),
        name: mockData?.name || 'Guest User',
        email: mockData?.email,
        avatar: mockData?.avatar,
        provider
    };
    setUser(newUser);
    localStorage.setItem('user_session', JSON.stringify(newUser));
  };

  const logout = () => {
      setUser(null);
      localStorage.removeItem('user_session');
      // Optional: Clear chat history on logout
      // localStorage.removeItem('chat_history'); 
  };

  return (
    <AppContext.Provider value={{ settings, user, setLanguage, setTheme, setFontSize, login, logout }}>
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
