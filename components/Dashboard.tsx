import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AppView, UI_TRANSLATIONS, getSystemPrompt } from '../types';
import { generateScholarResponse } from '../services/geminiService';

interface DashboardProps {
  setActiveView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const { settings } = useApp();
  const t = UI_TRANSLATIONS[settings.language];
  const [dailyVerse, setDailyVerse] = useState<string>('');

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const prompt = "Provide one short, inspiring Ayat from the Quran with Arabic and translation. Do not add any conversational filler.";
        const systemPrompt = getSystemPrompt(settings.language);
        const response = await generateScholarResponse(prompt, 'gemini-2.5-flash', systemPrompt);
        setDailyVerse(response.text || '');
      } catch (e) {
        console.error(e);
      }
    };
    fetchDailyVerse();
  }, [settings.language]);

  const cards = [
    { id: AppView.SCHOLAR_CHAT, label: t.chat, icon: '📖', color: 'bg-blue-100 text-blue-800' },
    { id: AppView.QURAN, label: t.quran, icon: '☪️', color: 'bg-emerald-100 text-emerald-800' },
    { id: AppView.HADITH, label: t.hadith, icon: '📚', color: 'bg-amber-100 text-amber-800' },
    { id: AppView.MEDIA_ANALYSIS, label: t.media, icon: '👁️', color: 'bg-purple-100 text-purple-800' },
    { id: AppView.LIVE_CONVERSATION, label: t.live, icon: '🎙️', color: 'bg-red-100 text-red-800' },
    { id: AppView.AUDIO_TOOLS, label: t.audio, icon: '🔊', color: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-stone-50 dark:bg-stone-900 transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">{t.dashboard}</h1>
          <p className="text-stone-500 dark:text-stone-400">{t.subtitle}</p>
        </header>

        {/* Hero Card - Daily Verse */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <span className="material-icons text-[200px]">auto_stories</span>
            </div>
            <h2 className="text-emerald-300 uppercase tracking-wider text-sm font-semibold mb-4">{t.dailyVerse}</h2>
            {dailyVerse ? (
                <div className="prose prose-invert max-w-none font-arabic text-lg leading-relaxed">
                    {dailyVerse}
                </div>
            ) : (
               <div className="animate-pulse h-20 bg-emerald-700/50 rounded-lg"></div>
            )}
        </div>

        {/* Grid Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveView(card.id)}
              className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-100 dark:border-stone-700 flex items-center space-x-4 text-left group"
            >
              <div className={`p-4 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">{card.label}</h3>
                <span className="text-xs text-stone-400 dark:text-stone-500">{t.enter} &rarr;</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
