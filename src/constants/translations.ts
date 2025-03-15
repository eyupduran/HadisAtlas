export type SupportedLanguages = 'tr' | 'en' | 'ar';

interface Translation {
    [key: string]: {
        [K in SupportedLanguages]: string;
    };
}

export const translations: Translation = {
    appName: {
        tr: 'Hadis Atlas',
        en: 'Hadith Atlas',
        ar: 'أطلس الحديث'
    },
    categories: {
        tr: 'Kategoriler',
        en: 'Categories',
        ar: 'الفئات'
    },
    settings: {
        tr: 'Ayarlar',
        en: 'Settings',
        ar: 'الإعدادات'
    },
    languageSelection: {
        tr: 'Dil Seçimi',
        en: 'Language Selection',
        ar: 'اختيار اللغة'
    },
    theme: {
        tr: 'Tema',
        en: 'Theme',
        ar: 'المظهر'
    },
    lightMode: {
        tr: 'Açık Tema',
        en: 'Light Theme',
        ar: 'المظهر الفاتح'
    },
    darkMode: {
        tr: 'Koyu Tema',
        en: 'Dark Theme',
        ar: 'المظهر الداكن'
    },
    currentLanguage: {
        tr: 'Mevcut Dil',
        en: 'Current Language',
        ar: 'اللغة الحالية'
    },
    languageNames: {
        tr: 'Türkçe',
        en: 'English',
        ar: 'العربية'
    },
    hadithNotFound: {
        tr: 'Hadis bulunamadı',
        en: 'Hadith not found',
        ar: 'لم يتم العثور على الحديث'
    },
    explanation: {
        tr: 'Açıklama',
        en: 'Explanation',
        ar: 'الشرح'
    },
    hints: {
        tr: 'İpuçları',
        en: 'Hints',
        ar: 'التلميحات'
    },
    favorites: {
        tr: 'Favoriler',
        en: 'Favorites',
        ar: 'المفضلة'
    },
    noFavorites: {
        tr: 'Henüz favori hadisiniz bulunmamaktadır',
        en: 'You have no favorite hadiths yet',
        ar: 'لا يوجد لديك أحاديث مفضلة بعد'
    },
    fontSize: {
        tr: 'Yazı Boyutu',
        en: 'Font Size',
        ar: 'حجم الخط'
    },
    arabicFontSize: {
        tr: 'Arapça Yazı Boyutu',
        en: 'Arabic Font Size',
        ar: 'حجم الخط العربي'
    },
    offlineMode: {
        tr: 'Çevrimdışı Mod',
        en: 'Offline Mode',
        ar: 'وضع عدم الاتصال'
    },
    // New translation keys for share options
    shareOptions: {
        tr: 'Paylaşım Seçenekleri',
        en: 'Share Options',
        ar: 'خيارات المشاركة'
    },
    shareAsText: {
        tr: 'Metin olarak paylaş',
        en: 'Share as Text',
        ar: 'مشاركة كنص'
    },
    shareAsImage: {
        tr: 'Görsel olarak paylaş',
        en: 'Share as Image',
        ar: 'مشاركة كصورة'
    },
    cancel: {
        tr: 'İptal',
        en: 'Cancel',
        ar: 'إلغاء'
    },
    fonts: {
        tr: 'Yazı Boyutu',
        en: 'Font Size',
        ar: 'حجم الخط'
    },
    sampleText: {
        tr: 'Örnek metin',
        en: 'Sample text',
        ar: 'نص تجريبي'
    },
    sampleArabicText: {
        tr: 'عربي',
        en: 'عربي',
        ar: 'عربي'
    },
    loading: {
        tr: 'Kategoriler yükleniyor...',
        en: 'Loading categories...',
        ar: 'جاري تحميل الفئات...'
    },
    loadingSubcategories: {
        tr: 'Alt kategoriler yükleniyor...',
        en: 'Loading subcategories...',
        ar: 'جاري تحميل الفئات الفرعية...'
    }
};