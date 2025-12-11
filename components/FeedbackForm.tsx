
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { UI_TRANSLATIONS } from '../types';

const FeedbackForm: React.FC = () => {
    const { settings, user } = useApp();
    const t = UI_TRANSLATIONS[settings.language];
    
    const [type, setType] = useState('bug');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            // Reset form
            setDescription('');
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900 p-6 font-arabic animate-fadeIn">
                <div className="max-w-md w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 text-center border-t-4 border-emerald-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons text-4xl text-emerald-600 dark:text-emerald-400">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">
                        {settings.language === 'Bangla' ? 'ধন্যবাদ!' : 'Thank You!'}
                    </h2>
                    <p className="text-stone-600 dark:text-stone-400 mb-6">
                        {settings.language === 'Bangla' 
                         ? 'আপনার মতামত আমাদের কাছে পৌঁছেছে। আমরা শীঘ্রই এটি পর্যালোচনা করব।' 
                         : 'Your feedback has been received. We will review it shortly.'}
                    </p>
                    <button 
                        onClick={() => setIsSubmitted(false)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        {settings.language === 'Bangla' ? 'আরও পাঠান' : 'Send Another'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-stone-50 dark:bg-stone-900 p-6 font-arabic transition-colors">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">{t.feedback}</h2>
                    <p className="text-stone-500 dark:text-stone-400">{t.feedbackDesc}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-8 space-y-6">
                    
                    {/* Issue Type */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                            {settings.language === 'Bangla' ? 'সমস্যার ধরণ' : 'Issue Type'}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {['bug', 'content_error', 'suggestion'].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setType(opt)}
                                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                                        type === opt 
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                                    }`}
                                >
                                    {opt === 'bug' && (settings.language === 'Bangla' ? 'বাগ রিপোর্ট' : 'Bug Report')}
                                    {opt === 'content_error' && (settings.language === 'Bangla' ? 'তথ্যে ভুল' : 'Content Error')}
                                    {opt === 'suggestion' && (settings.language === 'Bangla' ? 'পরামর্শ' : 'Suggestion')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                            {settings.language === 'Bangla' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                        </label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                            {settings.language === 'Bangla' ? 'বিস্তারিত বর্ণনা' : 'Detailed Description'}
                        </label>
                        <textarea 
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={settings.language === 'Bangla' ? 'দয়া করে সমস্যাটি বিস্তারিত লিখুন...' : 'Please describe the issue or suggestion in detail...'}
                            rows={6}
                            className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading || !description.trim()}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span className="material-icons">send</span>
                                {t.submit}
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
