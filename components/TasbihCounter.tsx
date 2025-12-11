
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { UI_TRANSLATIONS } from '../types';

const TasbihCounter: React.FC = () => {
    const { settings } = useApp();
    const t = UI_TRANSLATIONS[settings.language];
    
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [cycle, setCycle] = useState(0);

    // Load saved count
    useEffect(() => {
        const saved = localStorage.getItem('tasbih_count');
        if (saved) setCount(parseInt(saved));
    }, []);

    // Save count
    useEffect(() => {
        localStorage.setItem('tasbih_count', count.toString());
    }, [count]);

    const increment = () => {
        // Vibrate if supported
        if (navigator.vibrate) navigator.vibrate(10);
        
        setCount(prev => {
            const next = prev + 1;
            if (next > target) {
                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                setCycle(c => c + 1);
                return 1;
            }
            return next;
        });
    };

    const reset = () => {
        if(confirm("Reset counter?")) {
            setCount(0);
            setCycle(0);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900 p-6 font-arabic overflow-hidden">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 mb-2">{t.tasbih}</h2>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">Digital Dhikr Counter</p>
                </div>

                {/* Counter Card */}
                <div className="bg-white dark:bg-stone-800 rounded-[3rem] shadow-2xl p-8 relative border-8 border-emerald-50 dark:border-stone-700">
                    
                    {/* Display Screen */}
                    <div className="bg-[#dae3da] dark:bg-[#1f2937] inner-shadow rounded-2xl p-6 mb-8 text-right font-mono relative overflow-hidden">
                         <div className="absolute top-2 left-3 text-xs text-stone-500 font-sans">TARGET: {target}</div>
                         <div className="absolute top-2 right-3 text-xs text-stone-500 font-sans">CYCLE: {cycle}</div>
                         <div className="text-6xl font-bold text-stone-800 dark:text-emerald-400 mt-2">{count.toString().padStart(3, '0')}</div>
                    </div>

                    {/* Main Button */}
                    <div className="flex justify-center mb-8">
                        <button 
                            onClick={increment}
                            className="w-48 h-48 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-xl shadow-emerald-200 dark:shadow-none border-4 border-emerald-700 flex items-center justify-center group relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none"></span>
                            <span className="material-icons text-6xl text-white group-active:scale-90 transition-transform">fingerprint</span>
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={reset}
                            className="w-12 h-12 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                            title="Reset"
                        >
                            <span className="material-icons text-xl">refresh</span>
                        </button>

                        <div className="flex bg-stone-100 dark:bg-stone-700 rounded-full p-1">
                            {[33, 99, 100].map(val => (
                                <button
                                    key={val}
                                    onClick={() => { setTarget(val); setCount(0); }}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        target === val 
                                        ? 'bg-white dark:bg-stone-600 shadow text-emerald-700 dark:text-emerald-400' 
                                        : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
                                    }`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasbihCounter;
