
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { UI_TRANSLATIONS } from '../types';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, settings, logout } = useApp();
    const t = UI_TRANSLATIONS[settings.language];

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-slideUp border border-stone-200 dark:border-stone-700 font-arabic">
                {/* Header Background */}
                <div className="h-32 bg-emerald-600 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20"></div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 text-white rounded-full p-2 transition-colors"
                    >
                        <span className="material-icons text-sm">close</span>
                    </button>
                </div>

                {/* Profile Info */}
                <div className="px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="relative -mt-16 mb-4 flex justify-center">
                        <div className="p-1.5 bg-white dark:bg-stone-800 rounded-full">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full border-4 border-emerald-100 dark:border-emerald-900 object-cover" />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-4xl border-4 border-white shadow-sm">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{user.name}</h2>
                        <p className="text-stone-500 dark:text-stone-400 text-sm mb-2">{user.email || 'Guest User'}</p>
                        <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full capitalize border border-emerald-100 dark:border-emerald-800">
                            {user.provider} Account
                        </span>
                    </div>

                    {/* Stats (Mock) */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-stone-50 dark:bg-stone-700/50 p-4 rounded-2xl text-center border border-stone-100 dark:border-stone-700">
                            <span className="material-icons text-emerald-500 mb-1">auto_stories</span>
                            <div className="text-lg font-bold text-stone-800 dark:text-stone-200">12</div>
                            <div className="text-xs text-stone-500 dark:text-stone-400">Surahs Read</div>
                        </div>
                        <div className="bg-stone-50 dark:bg-stone-700/50 p-4 rounded-2xl text-center border border-stone-100 dark:border-stone-700">
                            <span className="material-icons text-amber-500 mb-1">star</span>
                            <div className="text-lg font-bold text-stone-800 dark:text-stone-200">5</div>
                            <div className="text-xs text-stone-500 dark:text-stone-400">Days Streak</div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-icons">logout</span>
                        {t.logout || "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
