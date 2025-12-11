
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Language, UI_TRANSLATIONS } from '../types';

const LoginScreen: React.FC = () => {
  const { settings, setLanguage, login } = useApp();
  const [step, setStep] = useState<'language' | 'login'>('language');
  const [isAnimating, setIsAnimating] = useState(false);

  const t = UI_TRANSLATIONS[settings.language];

  // Helper to trigger animation and change step
  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setIsAnimating(true);
    setTimeout(() => {
        setStep('login');
        setIsAnimating(false);
    }, 400);
  };

  const handleLogin = (provider: 'google' | 'facebook' | 'guest') => {
      setIsAnimating(true);
      setTimeout(() => {
          let mockData = {};
          if (provider === 'google') {
              mockData = { name: 'Abdullah Al-Mamun', email: 'abdullah@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Abdullah+Al-Mamun&background=0D9488&color=fff' };
          } else if (provider === 'facebook') {
              mockData = { name: 'Fatima Zahra', email: 'fatima@facebook.com', avatar: 'https://ui-avatars.com/api/?name=Fatima+Zahra&background=3b5998&color=fff' };
          }
          login(provider, mockData);
      }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-4 relative overflow-hidden font-arabic transition-colors">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none"></div>
      
      {/* Main Card Container */}
      <div className={`max-w-md w-full bg-white rounded-3xl shadow-2xl z-10 overflow-hidden relative border-t-4 border-emerald-600 transition-all duration-500 transform ${isAnimating ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>
        
        {/* Step 1: Language Selection */}
        {step === 'language' && (
            <div className="p-8 animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-900 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg ring-4 ring-emerald-100">
                        <span className="text-3xl">🌍</span>
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-900 mb-2">Welcome / স্বাগতম</h2>
                    <p className="text-stone-500 text-sm">Please select your preferred language</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {Object.values(Language).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => handleLanguageSelect(lang)}
                            className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                        >
                            <span className="text-lg font-bold text-stone-700 group-hover:text-emerald-700">{lang}</span>
                            <span className="text-xs text-stone-400 group-hover:text-emerald-500 capitalize">Select</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Step 2: Login Form */}
        {step === 'login' && (
            <div className="p-8 animate-slideUp">
                {/* Back Button */}
                <button 
                    onClick={() => setStep('language')} 
                    className="absolute top-4 left-4 text-stone-400 hover:text-stone-600 flex items-center gap-1 text-sm"
                >
                    <span className="material-icons text-sm">arrow_back</span> Back
                </button>

                <div className="text-center mb-8 mt-4">
                    <div className="w-20 h-20 bg-emerald-900 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg ring-4 ring-emerald-100">
                        <span className="text-4xl">🕌</span>
                    </div>
                    <h1 className="text-3xl font-bold text-emerald-900 mb-2">{t.appTitle}</h1>
                    <p className="text-stone-500 uppercase tracking-widest text-xs font-semibold">{t.subtitle}</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleLogin('google')}
                        className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                        <span>{t.loginGoogle}</span>
                    </button>

                    <button
                        onClick={() => handleLogin('facebook')}
                        className="w-full bg-[#1877F2] hover:bg-[#156cd1] text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-6 h-6 bg-white rounded-full p-0.5" alt="Facebook" />
                        <span>{t.loginFacebook}</span>
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-stone-400">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleLogin('guest')}
                        className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold py-3 px-4 rounded-xl transition-all"
                    >
                        {t.loginGuest}
                    </button>
                </div>
                
                <div className="mt-8 text-center text-xs text-stone-400">
                    Secure & Private • Powered by AI
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
