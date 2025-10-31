"use client";

import { useState } from "react";
import { FiGlobe, FiChevronDown } from "react-icons/fi";
import { useStore } from "@nanostores/react";
import { languageStore, setLanguage, Language } from "@/app/stores/languageStore";

const languages = [
    { code: "en" as const, label: "English", flag: "🇬🇧" },
    { code: "fr" as const, label: "Français", flag: "🇫🇷" },
    { code: "tr" as const, label: "Türkçe", flag: "🇹🇷" },
];

export default function LanguageToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = useStore(languageStore);
    
    const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10"
            >
                <FiGlobe className="w-4 h-4" />
                <span className="text-lg">{currentLanguage.flag}</span>
                <FiChevronDown 
                    className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
        
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-2xl border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full px-4 py-2.5 text-left text-gray-300 hover:text-white hover:bg-red-600/20 transition-colors text-sm font-medium flex items-center gap-3 ${
                                    currentLang === lang.code ? "bg-red-600/10 text-white" : ""
                                }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


