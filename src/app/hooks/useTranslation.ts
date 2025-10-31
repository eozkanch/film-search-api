import { useStore } from '@nanostores/react';
import { languageStore } from '@/app/stores/languageStore';
import { translations, TranslationKey } from '@/app/i18n/translations';

export function useTranslation() {
    const lang = useStore(languageStore);
    
    const t = (key: TranslationKey): string => {
        return translations[lang][key] || key;
    };
    
    return { t, lang };
}

