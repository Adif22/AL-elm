import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScholarChat from './components/ScholarChat';
import MediaStudio from './components/MediaStudio';
import LiveConversation from './components/LiveConversation';
import AudioTools from './components/AudioTools';
import QuranBrowser from './components/QuranBrowser';
import HadithBrowser from './components/HadithBrowser';
import TafsirReader from './components/TafsirReader';
import LoginScreen from './components/LoginScreen';
import { AppView, UI_TRANSLATIONS } from './types';
import { useApp } from './contexts/AppContext';

const App: React.FC = () => {
  const { isLoggedIn, settings } = useApp();
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const t = UI_TRANSLATIONS[settings.language];

  // Handle Dark Mode Class on Body/HTML
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard setActiveView={setActiveView} />;
      case AppView.SCHOLAR_CHAT:
        return <ScholarChat />;
      case AppView.QURAN:
        return <QuranBrowser />;
      case AppView.HADITH:
        return <HadithBrowser />;
      case AppView.TAFSIR:
        return <TafsirReader />;
      case AppView.MEDIA_ANALYSIS:
        return <MediaStudio />; 
      case AppView.LIVE_CONVERSATION:
        return <LiveConversation />;
      case AppView.AUDIO_TOOLS:
        return <AudioTools />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-stone-50 dark:bg-stone-900 font-arabic transition-colors`}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 h-full relative">
         {renderView()}
      </main>
      
      {/* Google Material Icons CDN */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
};

export default App;