export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCHOLAR_CHAT = 'SCHOLAR_CHAT',
  QURAN = 'QURAN',
  TAFSIR = 'TAFSIR',
  HADITH = 'HADITH'
}

export enum Language {
  BANGLA = 'Bangla',
  ENGLISH = 'English',
  ARABIC = 'Arabic',
  URDU = 'Urdu',
  INDONESIAN = 'Indonesian',
  CHINESE = 'Chinese',
  HINDI = 'Hindi'
}

export interface AppSettings {
  language: Language;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: string[]; // For grounding
  image?: string;
  isThinking?: boolean;
}

export enum ImageAspectRatio {
  SQUARE = '1:1',
  PORTRAIT_2_3 = '2:3',
  LANDSCAPE_3_2 = '3:2',
  PORTRAIT_3_4 = '3:4',
  LANDSCAPE_4_3 = '4:3',
  PORTRAIT_9_16 = '9:16',
  LANDSCAPE_16_9 = '16:9',
  CINEMATIC_21_9 = '21:9'
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

export const getSystemPrompt = (lang: Language) => `
You are Al-Alim, a wise, gentle, and strictly authentic Islamic Scholar AI. 

CORE RULES:
 1. Sources: Use ONLY the Holy Quran, Sahih Hadith (Bukhari, Muslim, etc.), and consensus of classical scholars (Ijma).
 2. Accuracy: Never invent fatwas. If there is a difference of opinion, mention it.
 3. Behavior: Be respectful, humble, and compassionate. Avoid extremism or political controversy.
 4. Language: Your output MUST be in ${lang}.
 
SPECIAL INSTRUCTION FOR EMOTIONAL DISTRESS & DUAS:
 If the user mentions depression, sadness, anxiety, fear, debt, illness, or any hardship:
 1. EMPATHY: Start by acknowledging their pain with a gentle Islamic reminder (e.g., "Allah does not burden a soul beyond that it can bear").
 2. PRESCRIBED DUA: Provide the specific Masnoon Dua from Quran or Sahih Hadith for that exact situation.
 3. REQUIRED FORMAT for the Dua section:
    
    > **🤲 Dua for [Situation]**
    >
    > **Arabic:**
    > [Insert Arabic Text Here with Vowels/Tashkeel]
    >
    > **Transliteration:**
    > [Insert clear Transliteration]
    >
    > **Translation:**
    > "[Insert Translation in ${lang}]"
    >
    > **Source:**
    > [e.g., Sahih Bukhari 1234 / Surah Taha 20:25]
    
 4. REMINDER: End with a short, comforting spiritual advice related to the Dua.

GENERAL FORMATTING:
 - When quoting Quran/Hadith normally, provide the Arabic text first, followed by the translation in ${lang}, then the explanation.
 - For complex life decisions (marriage, divorce), always advise consulting a local qualified scholar.
`;

export const UI_TRANSLATIONS = {
  [Language.BANGLA]: {
    appTitle: 'আল-আলিম',
    subtitle: 'ইসলামিক ইন্টেলিজেন্স',
    dashboard: 'ড্যাশবোর্ড',
    chat: 'স্কলার চ্যাট',
    quran: 'আল-কুরআন',
    hadith: 'সহীহ হাদিস',
    tafsir: 'তাফসীর',
    settings: 'সেটিংস',
    enter: 'প্রবেশ করুন',
    selectLang: 'ভাষা নির্বাচন করুন',
    dailyVerse: 'আজকের আয়াত',
    search: 'অনুসন্ধান',
    read: 'পড়ুন'
  },
  [Language.ENGLISH]: {
    appTitle: 'Al-Alim',
    subtitle: 'Islamic Intelligence',
    dashboard: 'Dashboard',
    chat: 'Scholar Chat',
    quran: 'Al-Quran',
    hadith: 'Sahih Hadith',
    tafsir: 'Tafsir',
    settings: 'Settings',
    enter: 'Enter',
    selectLang: 'Select Language',
    dailyVerse: 'Verse of the Day',
    search: 'Search',
    read: 'Read'
  },
  [Language.ARABIC]: {
    appTitle: 'العليم',
    subtitle: 'الذكاء الإسلامي',
    dashboard: 'لوحة القيادة',
    chat: 'دردشة العالم',
    quran: 'القرآن الكريم',
    hadith: 'الحديث الصحيح',
    tafsir: 'التفسير',
    settings: 'الإعدادات',
    enter: 'دخول',
    selectLang: 'اختر اللغة',
    dailyVerse: 'آية اليوم',
    search: 'بحث',
    read: 'اقرأ'
  },
  [Language.URDU]: {
    appTitle: 'العليم',
    subtitle: 'اسلامی ذہانت',
    dashboard: 'ڈیش بورڈ',
    chat: 'اسکالر چیٹ',
    quran: 'القرآن',
    hadith: 'صحیح حدیث',
    tafsir: 'تفسیر',
    settings: 'ترتیبات',
    enter: 'داخل ہوں',
    selectLang: 'زبان منتخب کریں',
    dailyVerse: 'آج کی آیت',
    search: 'تلاش',
    read: 'پڑھیں'
  },
  [Language.INDONESIAN]: {
    appTitle: 'Al-Alim',
    subtitle: 'Kecerdasan Islam',
    dashboard: 'Dasbor',
    chat: 'Obrolan Ulama',
    quran: 'Al-Quran',
    hadith: 'Hadis Sahih',
    tafsir: 'Tafsir',
    settings: 'Pengaturan',
    enter: 'Masuk',
    selectLang: 'Pilih Bahasa',
    dailyVerse: 'Ayat Hari Ini',
    search: 'Cari',
    read: 'Baca'
  },
  [Language.CHINESE]: {
    appTitle: 'Al-Alim',
    subtitle: '伊斯兰智能',
    dashboard: '仪表板',
    chat: '学者聊天',
    quran: '古兰经',
    hadith: '圣训',
    tafsir: '古兰经注',
    settings: '设置',
    enter: '进入',
    selectLang: '选择语言',
    dailyVerse: '每日经文',
    search: '搜索',
    read: '阅读'
  },
  [Language.HINDI]: {
    appTitle: 'अल-अलीम',
    subtitle: 'इस्लामिक इंटेलिजेंस',
    dashboard: 'डैशबोर्ड',
    chat: 'स्कॉलर चैट',
    quran: 'अल-कुरान',
    hadith: 'सहीह हदीस',
    tafsir: 'तफसीर',
    settings: 'सेटिंग्स',
    enter: 'प्रवेश करें',
    selectLang: 'भाषा चुनें',
    dailyVerse: 'आज की आयत',
    search: 'खोजें',
    read: 'पढ़ें'
  }
};