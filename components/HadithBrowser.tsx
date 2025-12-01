import React, { useState } from 'react';
import { generateScholarResponse } from '../services/geminiService';
import { useApp } from '../contexts/AppContext';

const HadithBrowser: React.FC = () => {
    const { settings } = useApp();
    const [activeBook, setActiveBook] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const books = [
        { id: 'bukhari', title: 'Sahih Al-Bukhari', color: 'bg-emerald-600' },
        { id: 'muslim', title: 'Sahih Muslim', color: 'bg-blue-600' },
        { id: 'tirmidhi', title: 'Jami At-Tirmidhi', color: 'bg-amber-600' }
    ];

    const searchHadith = async () => {
        if (!query.trim() || !activeBook) return;
        setIsLoading(true);
        try {
            const prompt = `Search within ${activeBook} for Hadiths related to '${query}'. 
            Present 3-5 relevant Hadiths. 
            For each:
            1. Book/Hadith Number.
            2. Arabic Text.
            3. ${settings.language} Translation.
            4. Short explanation.`;
            
            const response = await generateScholarResponse(prompt, 'gemini-2.5-flash', "You are a Muhaddith (Hadith scholar).");
            setContent(response.text || "No hadith found.");
        } catch (e) {
            setContent("Error fetching Hadith.");
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setActiveBook(null);
        setContent('');
        setQuery('');
    };

    const getTitle = () => {
        if (activeBook) {
            return books.find(b => b.id === activeBook)?.title;
        }
        switch(settings.language) {
            case 'Bangla': return 'হাদিস গ্রন্থসমূহ';
            case 'Arabic': return 'كتب الحديث';
            case 'Chinese': return '圣训书籍';
            case 'Hindi': return 'हदीस की किताबें';
            default: return 'Hadith Books';
        }
    };

    return (
        <div className="h-full bg-stone-50 dark:bg-stone-900 p-8 overflow-y-auto font-arabic">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    {activeBook && (
                        <button onClick={reset} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700">
                            <span className="material-icons">arrow_back</span>
                        </button>
                    )}
                    <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400">
                        {getTitle()}
                    </h2>
                </div>
                
                {!activeBook ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {books.map(book => (
                            <button 
                                key={book.id}
                                onClick={() => setActiveBook(book.id)}
                                className={`${book.color} text-white h-64 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all p-8 flex flex-col justify-between items-start relative overflow-hidden group`}
                            >
                                <span className="material-icons text-8xl absolute -right-4 -bottom-4 opacity-20 group-hover:rotate-12 transition-transform">menu_book</span>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <span className="material-icons">library_books</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
                                    <p className="text-white/80 text-sm">Click to open</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Search within Book View */
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Search Topic or Hadith Number</label>
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && searchHadith()}
                                    placeholder="e.g. Prayer, Fasting, or #123..."
                                    className="flex-1 border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-lg p-3"
                                />
                                <button 
                                    onClick={searchHadith}
                                    disabled={isLoading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2"
                                >
                                    {isLoading ? <span className="material-icons animate-spin">refresh</span> : <span className="material-icons">search</span>}
                                    Search
                                </button>
                            </div>
                        </div>
                        
                        {content && (
                            <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow border border-stone-200 dark:border-stone-700 min-h-[400px]">
                                <div className="prose prose-lg dark:prose-invert max-w-none font-arabic leading-loose">
                                     <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HadithBrowser;