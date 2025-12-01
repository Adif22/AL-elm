import React, { useState } from 'react';
import { generateScholarResponse } from '../services/geminiService';
import { useApp } from '../contexts/AppContext';

// Data for visual grid
const SURAHS = Array.from({ length: 114 }, (_, i) => i + 1);
const COMMON_SURAHS: Record<number, {en: string, bn: string, cn: string, hi: string}> = {
    1: {en: "Al-Fatiha", bn: "আল-ফাতিহা", cn: "开端章", hi: "अल-फातिहा"},
    2: {en: "Al-Baqarah", bn: "আল-বাকারা", cn: "黄牛章", hi: "अल-बकरा"},
    3: {en: "Ali 'Imran", bn: "আলে-ইমরান", cn: "阿姆兰家属章", hi: "आले-इमरान"},
    4: {en: "An-Nisa", bn: "আন-নিসা", cn: "妇女章", hi: "अन-निसा"},
    5: {en: "Al-Ma'idah", bn: "আল-মায়িদাহ", cn: "筵席章", hi: "अल-माइदा"},
    18: {en: "Al-Kahf", bn: "আল-কাহফ", cn: "山洞章", hi: "अल-कहफ"},
    36: {en: "Ya-Sin", bn: "ইয়াসিন", cn: "雅辛章", hi: "या-सीन"},
    55: {en: "Ar-Rahman", bn: "আর-রহমান", cn: "至仁主章", hi: "अर-रहमान"},
    67: {en: "Al-Mulk", bn: "আল-মুলক", cn: "国权章", hi: "अल-मुल्क"},
    112: {en: "Al-Ikhlas", bn: "আল-ইখলাস", cn: "忠诚章", hi: "अल-इखलास"},
    113: {en: "Al-Falaq", bn: "আল-ফালাক", cn: "曙光章", hi: "अल-फलक"},
    114: {en: "An-Nas", bn: "আন-নাস", cn: "世人章", hi: "अन-नास"}
};

const QuranBrowser: React.FC = () => {
    const { settings } = useApp();
    const [activeSurah, setActiveSurah] = useState<number | null>(null);
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const getSurahTitle = (num: number) => {
        const surah = COMMON_SURAHS[num];
        if (!surah) return `Surah ${num}`;
        
        switch(settings.language) {
            case 'Bangla': return surah.bn;
            case 'Chinese': return surah.cn;
            case 'Hindi': return surah.hi;
            default: return surah.en;
        }
    };

    const fetchSurah = async (number: number) => {
        setIsLoading(true);
        setActiveSurah(number);
        setContent(''); // clear previous content
        
        try {
            const prompt = `Fetch the full content of Surah number ${number}. 
            Provide it in a beautiful, readable format. 
            For each verse:
            1. Arabic Text (make it large and clear).
            2. ${settings.language} Translation.
            3. Brief footnote or explanation if necessary.
            Use Markdown formatting.`;
            
            const response = await generateScholarResponse(prompt, 'gemini-2.5-flash', "You are a Quran presenter. Output clean Markdown.");
            setContent(response.text || "Could not load Surah content.");
        } catch (e) {
            setContent("Error loading content. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setActiveSurah(null);
        setContent('');
    };

    return (
        <div className="h-full bg-stone-50 dark:bg-stone-900 overflow-y-auto font-arabic p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400">
                        {settings.language === 'Bangla' ? 'আল-কুরআনুল কারীম' : 
                         settings.language === 'Chinese' ? '古兰经' :
                         settings.language === 'Hindi' ? 'अल-कुरान' :
                         settings.language === 'Arabic' ? 'القرآن الكريم' :
                         'The Holy Quran'}
                    </h2>
                    {activeSurah && (
                         <button 
                            onClick={handleBack}
                            className="flex items-center gap-2 text-stone-600 dark:text-stone-300 hover:text-emerald-600"
                         >
                             <span className="material-icons">arrow_back</span>
                             Back to Index
                         </button>
                    )}
                </div>

                {/* Content View */}
                {activeSurah ? (
                    <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-lg border border-stone-200 dark:border-stone-700 min-h-[600px] p-8 relative">
                        {/* Paper texture */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')] rounded-3xl"></div>
                        
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h3 className="text-4xl text-center font-arabic text-emerald-800 dark:text-emerald-300 mb-8 pb-4 border-b border-stone-200 dark:border-stone-600">
                                {getSurahTitle(activeSurah)}
                            </h3>
                            
                            {isLoading ? (
                                <div className="space-y-12 animate-pulse mt-12">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="flex flex-col gap-4">
                                            <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-full"></div>
                                            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4 self-end"></div>
                                            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="prose prose-lg dark:prose-invert max-w-none font-arabic leading-loose">
                                     <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Index Grid View */
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {SURAHS.map((num) => (
                            <button
                                key={num}
                                onClick={() => fetchSurah(num)}
                                className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-6 hover:shadow-lg hover:border-emerald-500 transition-all group flex flex-col items-center justify-center text-center gap-2 h-32"
                            >
                                <span className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    {num}
                                </span>
                                <span className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                    {getSurahTitle(num)}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuranBrowser;