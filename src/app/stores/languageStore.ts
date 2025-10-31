import { atom } from 'nanostores';

export type Language = 'en' | 'fr' | 'tr';

// İlk değeri localStorage'dan al
function getInitialLanguage(): Language {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('language') as Language;
        if (saved && ['en', 'fr', 'tr'].includes(saved)) {
            return saved;
        }
    }
    return 'en';
}

export const languageStore = atom<Language>(getInitialLanguage());

export function setLanguage(lang: Language) {
    languageStore.set(lang);
    // LocalStorage'a kaydet
    if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
    }
}

