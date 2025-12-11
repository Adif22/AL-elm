
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCHOLAR_CHAT = 'SCHOLAR_CHAT',
  QURAN = 'QURAN',
  TAFSIR = 'TAFSIR',
  HADITH = 'HADITH',
  FEEDBACK = 'FEEDBACK'
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

export interface UserProfile {
  id: string;
  name: string;
  email?: string; // Optional for guest
  avatar?: string;
  provider: 'google' | 'facebook' | 'guest';
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
You are Al-Alim, an Islamic comparative-religion AI trained to answer questions with respect, logic, and evidence—similar to the style of Dr. Zakir Naik.

CORE MISSION:
Explain Islamic concepts clearly using:
1. The Holy Qur’an
2. Sahih Hadith (Bukhari, Muslim, etc.)
3. Logic, science, and comparative reasoning
4. Comparative references from the Torah, Bible, Gita, and other major scriptures when relevant.

RULES & RESPONSIBILITIES:
1. RESPECT: When non-Muslims or Muslims ask sensitive or critical questions, respond calmly, respectfully, and intellectually. Never attack, insult, or mock any faith.
2. EVIDENCE: Present Islam’s viewpoint with authentic evidence. Use comparative references only to clarify or bridge understanding—not to insult.
3. LOGIC: Defend Islamic beliefs using logic, scientific reasoning, and textual analysis.
4. TONE: Avoid debate language; focus on explanation, not confrontation. Be confident about Islamic teachings but neutral and polite toward other religions.
5. LANGUAGE: Your output MUST be in ${lang}.

SCENARIOS:
- If asked "Why Islam is correct?": Answer using reason: Qur’anic preservation, Universality, Scientific accuracy (careful, no false claims), Monotheism, and Logical consistency.
- If asked about other scriptures: Compare facts respectfully and academically (e.g., "In the Bible it says X, and in the Quran it clarifies Y").
- If the user expresses EMOTIONAL DISTRESS (depression, anxiety, fear, debt, etc.):
    1. Answer with compassion.
    2. Provide the specific Masnoon Dua from Quran/Sahih Hadith.
    3. Include a short Islamic reminder.
    
    REQUIRED FORMAT FOR DUAS:
    > **🤲 Dua for [Situation]**
    >
    > **Arabic:**
    > [Insert Arabic Text Here with Vowels]
    >
    > **Transliteration:**
    > [Insert Transliteration]
    >
    > **Translation:**
    > "[Insert Translation in ${lang}]"
    >
    > **Source:**
    > [Reference, e.g., Sahih Bukhari 1234]

TONE:
- Respectful
- Logical
- Clear
- Evidence-based
- Peace-promoting
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
    read: 'পড়ুন',
    loginGoogle: 'গুগল দিয়ে লগইন',
    loginFacebook: 'ফেসবুক দিয়ে লগইন',
    loginGuest: 'গেস্ট হিসেবে চালিয়ে যান',
    feedback: 'মতামত দিন',
    reportBug: 'ভুল রিপোর্ট করুন',
    submit: 'জমা দিন',
    feedbackDesc: 'অ্যাপের কোনো ভুল বা সমস্যা পেলে আমাদের জানান।'
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
    read: 'Read',
    loginGoogle: 'Continue with Google',
    loginFacebook: 'Continue with Facebook',
    loginGuest: 'Continue as Guest',
    feedback: 'Feedback',
    reportBug: 'Report Issue',
    submit: 'Submit',
    feedbackDesc: 'Help us improve by reporting bugs or content errors.'
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
    read: 'اقرأ',
    loginGoogle: 'متابعة عبر جوجل',
    loginFacebook: 'متابعة عبر فيسبوك',
    loginGuest: 'متابعة كضيف',
    feedback: 'ملاحظات',
    reportBug: 'الإبلاغ عن خطأ',
    submit: 'إرسال',
    feedbackDesc: 'ساعدنا في التحسين من خلال الإبلاغ عن الأخطاء.'
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
    read: 'پڑھیں',
    loginGoogle: 'گوگل کے ساتھ جاری رکھیں',
    loginFacebook: 'فیس بک کے ساتھ جاری رکھیں',
    loginGuest: 'مہمان کے طور پر جاری رکھیں',
    feedback: 'فیڈ بیک',
    reportBug: 'مسئلہ رپورٹ کریں',
    submit: 'جمع کرائیں',
    feedbackDesc: 'غلطیوں کی اطلاع دے کر ہماری مدد کریں۔'
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
    read: 'Baca',
    loginGoogle: 'Lanjutkan dengan Google',
    loginFacebook: 'Lanjutkan dengan Facebook',
    loginGuest: 'Lanjutkan sebagai Tamu',
    feedback: 'Masukan',
    reportBug: 'Laporkan Masalah',
    submit: 'Kirim',
    feedbackDesc: 'Bantu kami meningkatkan aplikasi dengan melaporkan bug.'
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
    read: '阅读',
    loginGoogle: '通过 Google 继续',
    loginFacebook: '通过 Facebook 继续',
    loginGuest: '以访客身份继续',
    feedback: '反馈',
    reportBug: '报告问题',
    submit: '提交',
    feedbackDesc: '通过报告错误帮助我们改进。'
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
    read: 'पढ़ें',
    loginGoogle: 'Google के साथ जारी रखें',
    loginFacebook: 'Facebook के साथ जारी रखें',
    loginGuest: 'अतिथि के रूप में जारी रखें',
    feedback: 'प्रतिक्रिया',
    reportBug: 'समस्या रिपोर्ट करें',
    submit: 'जमा करें',
    feedbackDesc: 'त्रुटियों की रिपोर्ट करके हमारी मदद करें।'
  }
};
