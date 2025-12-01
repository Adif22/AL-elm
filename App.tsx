import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScholarChat from './components/ScholarChat';
import QuranBrowser from './components/QuranBrowser';
import HadithBrowser from './components/HadithBrowser';
import TafsirReader from './components/TafsirReader';
import LoginScreen from './components/LoginScreen';
import { AppView, UI_TRANSLATIONS } from './types';
import { useApp } from './contexts/AppContext';

const App: React.FC = () => {
  const { isLoggedIn, settings } = useApp();
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  
  // Navigation History State
  const [history, setHistory] = useState<AppView[]>([]);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const t = UI_TRANSLATIONS[settings.language];

  // Handle Dark Mode Class on Body/HTML
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Navigation Handlers
  const navigateTo = (view: AppView) => {
    if (view === activeView) return;
    setHistory(prev => [...prev, activeView]);
    setActiveView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevView = newHistory.pop();
    setHistory(newHistory);
    if (prevView) setActiveView(prevView);
  };

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard setActiveView={navigateTo} />;
      case AppView.SCHOLAR_CHAT:
        return <ScholarChat />;
      case AppView.QURAN:
        return <QuranBrowser />;
      case AppView.HADITH:
        return <HadithBrowser />;
      case AppView.TAFSIR:
        return <TafsirReader />;
      default:
        return <Dashboard setActiveView={navigateTo} />;
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-stone-50 dark:bg-stone-900 font-arabic transition-colors`}>
      
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive Wrapper */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-emerald-900 dark:bg-stone-950
      `}>
        <Sidebar activeView={activeView} setActiveView={navigateTo} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full relative min-w-0">
         {/* Responsive Header Bar */}
         <div className="h-16 flex items-center justify-between px-4 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu (Mobile Only) */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 lg:hidden"
              >
                <span className="material-icons text-2xl">menu</span>
              </button>

              {/* Back Button (Visible if history exists) */}
              {history.length > 0 && (
                <button 
                  onClick={goBack}
                  className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2 group"
                  title="Go Back"
                >
                  <span className="material-icons text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  <span className="text-sm font-medium hidden sm:inline">Back</span>
                </button>
              )}
            </div>

            {/* Title (Mobile mainly) */}
            <h1 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 lg:hidden truncate">
               {t.appTitle}
            </h1>
            
            {/* Spacer for layout balance */}
            <div className="w-10 lg:hidden"></div> 
         </div>

         {/* View Container */}
         <main className="flex-1 overflow-hidden relative w-full">
            {renderView()}
         </main>
      </div>
      
      {/* Google Material Icons CDN */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
};

export default App;