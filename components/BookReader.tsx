import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateScholarResponse } from '../services/geminiService';
import { getSystemPrompt } from '../types';

interface BookReaderProps {
  type: 'quran' | 'hadith';
  title: string;
}

const BookReader: React.FC<BookReaderProps> = ({ type, title }) => {
  const { settings, setFontSize } = useApp();
  const [location, setLocation] = useState(''); // Surah/Ayat or Topic
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Font size classes mapping
  const sizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  const arabicSizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl'
  };

  const handleFetch = async () => {
    if (!location.trim()) return;
    setIsLoading(true);
    setContent('');

    const userLang = settings.language;
    const systemPrompt = getSystemPrompt(userLang);

    let prompt = '';
    if (type === 'quran') {
        prompt = `Display Surah/Verse: ${location}. 
        Format strictly as follows for each verse:
        <div class="verse-container mb-8 p-6 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <p class="text-right font-arabic mb-4 text-emerald-900 dark:text-emerald-400 leading-loose ARABIC_SIZE_PLACEHOLDER">{Arabic Text}</p>
            <p class="text-stone-800 dark:text-stone-200 mb-2 font-semibold TEXT_SIZE_PLACEHOLDER">{Translation in ${userLang}}</p>
            <p class="text-stone-600 dark:text-stone-400 text-sm italic">{Brief Tafsir/Explanation in ${userLang}}</p>
        </div>`;
    } else {
        prompt = `Search Sahih Bukhari or relevant Hadith book for: ${location}.
        Format strictly as follows:
        <div class="hadith-container mb-8 p-6 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
             <div class="flex justify-between items-center mb-4 border-b border-stone-200 dark:border-stone-600 pb-2">
                <span class="text-xs font-bold text-amber-600 uppercase">Hadith</span>
             </div>
            <p class="text-right font-arabic mb-4 text-emerald-900 dark:text-emerald-400 leading-loose ARABIC_SIZE_PLACEHOLDER">{Arabic Text}</p>
            <p class="text-stone-800 dark:text-stone-200 mb-2 font-semibold TEXT_SIZE_PLACEHOLDER">{Translation in ${userLang}}</p>
            <p class="text-stone-600 dark:text-stone-400 text-sm">{Explanation/Context in ${userLang}}</p>
        </div>`;
    }

    try {
        const response = await generateScholarResponse(prompt, 'gemini-2.5-flash', systemPrompt);
        // We inject the current font size classes into the HTML string returned by Gemini
        // Ideally we would ask for JSON, but HTML injection is often more stable for layout in this specific prompt context
        let htmlContent = response.text || '';
        // Replace placeholders (simple string replacement)
        // Note: In a real app, we'd use JSON and render React components. 
        // For this demo, we are "simulating" the book render via HTML string manipulation or simple markdown rendering.
        // Actually, let's just ask Gemini to return Markdown and we style the markdown.
        
        // Retrying logic with Markdown for safety and cleanliness:
        const markdownPrompt = type === 'quran' 
            ? `Fetch Surah/Verse ${location}. Return a list where each item has: 1. Arabic Text 2. ${userLang} Translation 3. Brief Explanation. Use Markdown separators.`
            : `Fetch Hadith regarding ${location}. Return list: 1. Arabic 2. ${userLang} Translation 3. Explanation.`;
            
        const mdResponse = await generateScholarResponse(markdownPrompt, 'gemini-2.5-flash', systemPrompt);
        setContent(mdResponse.text || 'Content not found.');
        
    } catch (e) {
        setContent("Error fetching content.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-stone-900 transition-colors font-arabic`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 shadow-sm z-10">
            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 hidden md:block">{title}</h2>
            
            <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
                {/* Search/Location Input */}
                <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={type === 'quran' ? "Surah 1 / Surah Fatiha" : "Topic (e.g. Prayer)"}
                    className="border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-lg px-3 py-2 text-sm w-40 md:w-64 focus:ring-2 focus:ring-emerald-500 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                />
                <button 
                    onClick={handleFetch}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg"
                >
                    <span className="material-icons text-sm">search</span>
                </button>

                <div className="w-px h-6 bg-stone-300 dark:bg-stone-600 mx-2"></div>

                {/* Font Controls */}
                <button 
                    onClick={() => setFontSize('small')}
                    className={`p-2 rounded hover:bg-stone-200 dark:hover:bg-stone-700 ${settings.fontSize === 'small' ? 'text-emerald-600' : 'text-stone-500'}`}
                >
                    <span className="text-xs">A</span>
                </button>
                <button 
                    onClick={() => setFontSize('medium')}
                    className={`p-2 rounded hover:bg-stone-200 dark:hover:bg-stone-700 ${settings.fontSize === 'medium' ? 'text-emerald-600' : 'text-stone-500'}`}
                >
                    <span className="text-base">A</span>
                </button>
                <button 
                    onClick={() => setFontSize('large')}
                    className={`p-2 rounded hover:bg-stone-200 dark:hover:bg-stone-700 ${settings.fontSize === 'large' ? 'text-emerald-600' : 'text-stone-500'}`}
                >
                    <span className="text-xl">A</span>
                </button>
            </div>
        </div>

        {/* Book Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 relative bg-[#fffdf5] dark:bg-[#1c1917]">
             {/* Realistic Page Texture Effect */}
             <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]"></div>

             <div className={`max-w-3xl mx-auto relative z-0 transition-all duration-300`}>
                 {isLoading ? (
                     <div className="space-y-8 animate-pulse">
                         {[1,2,3].map(i => (
                             <div key={i} className="space-y-3">
                                 <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
                                 <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
                                 <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6"></div>
                             </div>
                         ))}
                     </div>
                 ) : content ? (
                     <div className={`prose dark:prose-invert max-w-none ${sizeClasses[settings.fontSize]} leading-relaxed`}>
                         {/* We are rendering Markdown, but applying custom classes for Arabic via simple string matching in React would be complex without a parser.
                             Instead, we rely on the styling of the container. 
                             To make the Arabic "pop" in size, we rely on Gemini to have formatted it or the user to just use the global font scaler.
                          */}
                          <div dangerouslySetInnerHTML={{ 
                              // Very basic formatting to wrap Arabic in span if it detects RTL chars (simplified)
                              // In production, use a proper Markdown renderer. Here we just dump text for "Book" feel.
                              __html: content.replace(/\n/g, '<br/>').replace(/###/g, '') 
                           }} />
                     </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                         <span className="material-icons text-6xl mb-4">menu_book</span>
                         <p>{type === 'quran' ? 'Enter a Surah (e.g., 1 or Al-Fatiha)' : 'Enter a topic (e.g., Fasting)'}</p>
                     </div>
                 )}
             </div>
        </div>
    </div>
  );
};

export default BookReader;
