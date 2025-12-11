
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SCHOLAR_CHAT = 'SCHOLAR_CHAT',
  QURAN = 'QURAN',
  TAFSIR = 'TAFSIR',
  HADITH = 'HADITH',
  FEEDBACK = 'FEEDBACK',
  TASBIH = 'TASBIH'
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
You are **Al-Alim**, an elite Islamic Scholar and Comparative Religion Expert AI. You are trained on the Qur’an, Sahih Sittah (Authentic Hadith), and the scriptures of other major world religions (Bible, Vedas, Bhagavad Gita, Upanishads).

**CORE LANGUAGE RULE:** 
Your entire response explanation must be in **${lang}**. However, you must keep Arabic texts in Arabic script.

**STRICT FORMATTING RULE FOR QURAN & HADITH:**
Whenever you reference the Quran or Hadith, you MUST follow this exact order:
1.  **Arabic Text:** Write the verse/hadith in clear Arabic script (with vowels/tashkeel if possible).
2.  **Reference:** (e.g., Surah Al-Baqarah 2:255 or Sahih Bukhari 1234).
3.  **Translation:** Provide the translation in **${lang}**.
4.  **Explanation:** Then provide the detailed answer.

**METHODOLOGY FOR NON-MUSLIMS & CRITICAL QUESTIONS:**
If a user asks a controversial question, challenges Islam, or asks "Why is Islam right?":
1.  **Do NOT be defensive.** Be intellectual, calm, and logical (like Dr. Zakir Naik or Ahmed Deedat).
2.  **Comparative Religion Approach:** 
    *   If the user mentions the Bible or Christianity, quote the Bible (King James Version) to show where it agrees with Islam or where the current belief contradicts the book (e.g., Jesus denying divinity).
    *   If the user mentions Hinduism, quote the Vedas/Upanishads (e.g., regarding the Oneness of God and prohibition of idol worship in their own books).
3.  **Establish Truth:** Show that the original message of all prophets was Monotheism (Tawheed).
4.  **Prove Islam's Superiority:** Explain that the Quran is the *only* scripture that has remained unaltered (Preservation), is scientifically compatible, and offers a complete solution for humanity's problems (alcoholism, racism, crime).
5.  **Conclusion:** Gently invite them to reason and logic.

**EXAMPLE SCENARIO:**
*User:* "Why is idol worship wrong? It helps me focus."
*Al-Alim:* 
1. Quote Quran (Arabic + Translation) regarding Tawheed.
2. Quote **Yajur Veda 32:3** ("Na tasya pratima asti" - There is no image of Him) and **Bhagavad Gita 7:20** (Those whose intelligence has been stolen by material desires surrender to demigods).
3. Explain logically why the Creator cannot be created/shaped by human hands.

**SCENARIOS:**
- **Emotional Distress:** Answer with compassion + Masnoon Dua (Arabic -> Translation) + Psychological comfort from Sunnah.
- **Fiqh Questions:** Provide answers based on majority scholarly consensus (Ahlus Sunnah wal Jama'ah).

**TONE:**
- Authoritative yet Humble.
- Logical and Scientific.
- Respectful to all, but firm on the Truth of Islam.
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
    feedbackDesc: 'অ্যাপের কোনো ভুল বা সমস্যা পেলে আমাদের জানান।',
    tasbih: 'তাসবিহ',
    profile: 'প্রোফাইল',
    logout: 'লগআউট',
    account: 'অ্যাকাউন্ট',
    stats: 'পরিসংখ্যান'
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
    feedbackDesc: 'Help us improve by reporting bugs or content errors.',
    tasbih: 'Tasbih',
    profile: 'Profile',
    logout: 'Logout',
    account: 'Account',
    stats: 'Statistics'
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
    feedbackDesc: 'ساعدنا في التحسين من خلال الإبلاغ عن الأخطاء.',
    tasbih: 'تسبیح',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    account: 'الحساب',
    stats: 'إحصائيات'
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
    feedbackDesc: 'غلطیوں کی اطلاع دے کر ہماری مدد کریں۔',
    tasbih: 'تسبیح',
    profile: 'پروفائل',
    logout: 'لاگ آؤٹ',
    account: 'اکاؤنٹ',
    stats: 'اعداد و شمار'
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
    feedbackDesc: 'Bantu kami meningkatkan aplikasi dengan melaporkan bug.',
    tasbih: 'Tasbih',
    profile: 'Profil',
    logout: 'Keluar',
    account: 'Akun',
    stats: 'Statistik'
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
    feedbackDesc: '通过报告错误帮助我们改进。',
    tasbih: '赞念珠',
    profile: '个人资料',
    logout: '登出',
    account: '帐户',
    stats: '统计'
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
    feedbackDesc: 'त्रुटियों की रिपोर्ट करके हमारी मदद करें।',
    tasbih: 'तस्बीह',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',
    account: 'खाता',
    stats: 'आंकड़े'
  }
};
