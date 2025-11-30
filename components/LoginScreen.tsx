import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Language, UI_TRANSLATIONS } from '../types';

const LoginScreen: React.FC = () => {
  const { settings, setLanguage, login } = useApp();
  const t = UI_TRANSLATIONS[settings.language];

  return (
    <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 z-10 border-t-4 border-emerald-600">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-900 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
             <span className="text-4xl">🕌</span>
          </div>
          <h1 className="text-4xl font-bold text-emerald-900 font-arabic mb-2">{t.appTitle}</h1>
          <p className="text-stone-500 uppercase tracking-widest text-xs">{t.subtitle}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3 text-center">{t.selectLang}</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(Language).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
                    settings.language === lang
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:border-emerald-300'
                  }`}
                >
                  <span className="font-medium">{lang}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 mt-4"
          >
            {t.enter}
          </button>
        </div>
        
        <div className="mt-8 text-center text-xs text-stone-400">
          Powered by Google Gemini 2.0
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
