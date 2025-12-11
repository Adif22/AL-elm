
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Language, UI_TRANSLATIONS } from '../types';

const LoginScreen: React.FC = () => {
  const { settings, setLanguage, login } = useApp();
  const [step, setStep] = useState<'language' | 'login'>('language');
  const [isAnimating, setIsAnimating] = useState(false);

  const t = UI_TRANSLATIONS[settings.language];

  const languages = [
    { code: Language.BANGLA, label: 'Bangla', native: 'বাংলা', flag: '🇧🇩' },
    { code: Language.ENGLISH, label: 'English', native: 'English', flag: '🇬🇧' },
    { code: Language.ARABIC, label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: Language.URDU, label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
    { code: Language.INDONESIAN, label: 'Indonesian', native: 'Bahasa', flag: '🇮🇩' },
    { code: Language.CHINESE, label: 'Chinese', native: '中文', flag: '🇨🇳' },
    { code: Language.HINDI, label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  ];

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
    <div className="min-h-screen w-full bg-[#f0fdf4] flex items-center justify-center p-4 relative overflow-hidden font-arabic transition-colors">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.07] pointer-events-none"></div>
      
      {/* Decorative Blur Circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"></div>

      {/* Main Card Container */}
      <div className={`max-w-md w-full bg-white rounded-[2rem] shadow-2xl z-10 overflow-hidden relative border border-emerald-50 transition-all duration-500 transform ${isAnimating ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>
        
        {/* Step 1: Language Selection */}
        {step === 'language' && (
            <div className="p-8 animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm ring-1 ring-emerald-100">
                        <span className="text-3xl">🌍</span>
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800 mb-1">Welcome / স্বাগতম</h2>
                    <p className="text-emerald-600/80 text-sm font-medium">Please select your preferred language</p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {languages.map((item) => (
                        <button
                            key={item.code}
                            onClick={() => handleLanguageSelect(item.code)}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group duration-200 hover:shadow-md"
                        >
                            <span className="text-2xl mb-1 grayscale group-hover:grayscale-0 transition-all">{item.flag}</span>
                            <span className="text-base font-bold text-emerald-900 group-hover:text-emerald-700">{item.native}</span>
                            <span className="text-[10px] text-emerald-600/60 uppercase tracking-widest font-semibold">{item.label}</span>
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
                    className="absolute top-6 left-6 text-stone-400 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium transition-colors"
                >
                    <span className="material-icons text-sm">arrow_back_ios</span> Back
                </button>

                <div className="text-center mb-10 mt-6">
                    <div className="w-20 h-20 bg-emerald-600 text-white rounded-[1.5rem] mx-auto flex items-center justify-center mb-4 shadow-xl shadow-emerald-200 transform rotate-3">
                        <span className="text-4xl">🕌</span>
                    </div>
                    <h1 className="text-3xl font-bold text-stone-800 mb-2">{t.appTitle}</h1>
                    <p className="text-emerald-600 font-medium text-xs tracking-[0.2em] uppercase">{t.subtitle}</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleLogin('google')}
                        className="w-full bg-white border border-stone-200 hover:border-emerald-200 hover:bg-stone-50 text-stone-700 font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                        <span>{t.loginGoogle}</span>
                    </button>

                    <button
                        onClick={() => handleLogin('facebook')}
                        className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-6 h-6 bg-white rounded-full p-0.5" alt="Facebook" />
                        <span>{t.loginFacebook}</span>
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-stone-400 font-medium">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleLogin('guest')}
                        className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-3.5 px-4 rounded-xl transition-all"
                    >
                        {t.loginGuest}
                    </button>
                </div>
                
                <div className="mt-8 text-center text-[10px] text-stone-400 font-medium">
                    Secure & Private • Powered by Gemini AI
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
