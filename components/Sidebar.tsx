
import React from 'react';
import { AppView, UI_TRANSLATIONS } from '../types';
import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { settings, setTheme, logout, user } = useApp();
  const t = UI_TRANSLATIONS[settings.language];

  const navItems = [
    { id: AppView.DASHBOARD, label: t.dashboard, icon: 'grid_view' },
    { id: AppView.SCHOLAR_CHAT, label: t.chat, icon: 'school' },
    { id: AppView.QURAN, label: t.quran, icon: 'auto_stories' },
    { id: AppView.TAFSIR, label: t.tafsir, icon: 'description' },
    { id: AppView.HADITH, label: t.hadith, icon: 'library_books' },
  ];

  return (
    <div className="w-full h-full bg-emerald-900 dark:bg-stone-950 text-emerald-50 flex flex-col font-arabic border-r border-emerald-800 dark:border-stone-800 transition-colors">
      <div className="p-6 border-b border-emerald-800 dark:border-stone-800 shrink-0">
        <h1 className="text-2xl font-bold text-amber-400">{t.appTitle}</h1>
        <p className="text-xs text-emerald-300 mt-1 uppercase tracking-wider">{t.subtitle}</p>
      </div>
      
      {/* User Profile Section in Sidebar */}
      {user && (
          <div className="p-4 mx-4 mt-4 bg-emerald-800/50 rounded-xl flex items-center gap-3 border border-emerald-700">
              {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-amber-400/50" />
              ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0)}
                  </div>
              )}
              <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-emerald-300 truncate capitalize">{user.provider} User</p>
              </div>
          </div>
      )}

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === item.id
                ? 'bg-emerald-800 dark:bg-stone-800 text-white shadow-md border-l-4 border-amber-400'
                : 'hover:bg-emerald-800/50 dark:hover:bg-stone-800/50 text-emerald-200'
            }`}
          >
            <span className="material-icons text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        
        {/* Divider */}
        <div className="my-2 border-t border-emerald-800 dark:border-stone-800"></div>

        {/* Feedback Link */}
        <button
            onClick={() => setActiveView(AppView.FEEDBACK)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === AppView.FEEDBACK
                ? 'bg-emerald-800 dark:bg-stone-800 text-white shadow-md border-l-4 border-amber-400'
                : 'hover:bg-emerald-800/50 dark:hover:bg-stone-800/50 text-emerald-200'
            }`}
        >
            <span className="material-icons text-xl">bug_report</span>
            <span className="font-medium">{t.feedback || "Feedback"}</span>
        </button>

      </nav>

      {/* Settings Area */}
      <div className="p-4 border-t border-emerald-800 dark:border-stone-800 bg-emerald-900/50 dark:bg-stone-900/50 shrink-0">
          <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-emerald-300">{t.settings}</span>
          </div>
          
          <div className="flex items-center justify-between mb-4 bg-emerald-800 dark:bg-stone-800 p-2 rounded-lg">
              <span className="text-xs">Theme</span>
              <button 
                onClick={() => setTheme(settings.theme === 'light' ? 'dark' : 'light')}
                className="p-1 rounded-full bg-emerald-700 dark:bg-stone-700 hover:bg-amber-500 transition-colors"
              >
                  <span className="material-icons text-sm text-white">
                      {settings.theme === 'light' ? 'dark_mode' : 'light_mode'}
                  </span>
              </button>
          </div>

          <button 
            onClick={logout}
            className="w-full py-2 text-xs text-emerald-400 hover:text-white flex items-center justify-center gap-1 hover:bg-emerald-800 rounded transition-colors"
          >
              <span className="material-icons text-sm">logout</span> Logout
          </button>
      </div>
    </div>
  );
};

export default Sidebar;
