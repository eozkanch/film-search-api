"use client";

import { useState, useEffect } from "react";
import { FiX, FiSettings, FiCheck } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";

declare global {
    interface Window {
        dataLayer: any[];
        gtag?: (...args: any[]) => void;
    }
}

export default function CookieConsent() {
    const [mounted, setMounted] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [consent, setConsent] = useState({
        necessary: true, // Always true, cannot be disabled
        analytics: false,
        marketing: false,
    });

    const { t, lang } = useTranslation();

    // Google Consent Mode v2 güncelleme fonksiyonu
    const updateConsentMode = (analytics: boolean, marketing: boolean) => {
        if (typeof window === "undefined" || !window.gtag) {
            // gtag henüz yüklenmediyse, dataLayer'a ekle
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'consent_update',
                'consent': {
                    'ad_storage': marketing ? 'granted' : 'denied',
                    'ad_user_data': marketing ? 'granted' : 'denied',
                    'ad_personalization': marketing ? 'granted' : 'denied',
                    'analytics_storage': analytics ? 'granted' : 'denied'
                }
            });
            // gtag fonksiyonunu bekle
            setTimeout(() => {
                if (window.gtag) {
                    updateConsentModeDirect(analytics, marketing);
                }
            }, 100);
            return;
        }

        updateConsentModeDirect(analytics, marketing);
    };

    // Direkt gtag ile consent güncelleme
    const updateConsentModeDirect = (analytics: boolean, marketing: boolean) => {
        if (typeof window === "undefined" || !window.gtag) return;

        // Google Consent Mode v2 güncelleme
        window.gtag('consent', 'update', {
            'ad_storage': marketing ? 'granted' : 'denied',
            'ad_user_data': marketing ? 'granted' : 'denied',
            'ad_personalization': marketing ? 'granted' : 'denied',
            'analytics_storage': analytics ? 'granted' : 'denied'
        });

        // Reklam verilerini çıkartma (ads_data_redaction) - sadece reddedildiğinde
        if (!marketing) {
            window.gtag('set', 'ads_data_redaction', true);
        } else {
            window.gtag('set', 'ads_data_redaction', false);
        }
    };

    // Prevent hydration mismatch by only rendering on client
    useEffect(() => {
        setMounted(true);
        
        // Check if user has already made a choice
        const consentData = localStorage.getItem("cookieConsent");
        if (consentData) {
            try {
                const savedConsent = JSON.parse(consentData);
                setConsent(savedConsent);
                setShowBanner(false);
                
                // Google Consent Mode'u güncelle (kaydedilmiş tercihlere göre)
                updateConsentMode(savedConsent.analytics, savedConsent.marketing);
                
                // Initialize GTM and GA4 if analytics is consented
                if (savedConsent.analytics) {
                    initializeGTM();
                    initializeGA4();
                }
            } catch (error) {
                // Invalid localStorage data, show banner
                setShowBanner(true);
            }
        } else {
            // First time visitor - show banner
            // Varsayılan durum zaten layout.tsx'de 'denied' olarak ayarlandı
            setShowBanner(true);
        }
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (showBanner) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showBanner]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (showPolicy) {
            document.body.style.overflow = 'hidden';
            // Smooth scroll to top to ensure drawer is visible
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showPolicy]);

    const initializeGTM = () => {
        if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || [];
            (function(w: any, d: Document, s: string, l: string, i: string) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                const f = d.getElementsByTagName(s)[0];
                const j = d.createElement(s);
                const dl = l != 'dataLayer' ? '&l=' + l : '';
                (j as HTMLScriptElement).async = true;
                (j as HTMLScriptElement).src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode?.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-W4R3QZZ6');
        }
    };

    const initializeGA4 = () => {
        if (typeof window === "undefined") return;
        
        // Initialize dataLayer if not already initialized
        window.dataLayer = window.dataLayer || [];
        
        // Define gtag function
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        
        // Make gtag available globally
        window.gtag = gtag;
        
        // Check if GA4 script is already loaded
        const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
        if (existingScript) {
            // Script already loaded, just configure
            gtag('js', new Date());
            gtag('config', 'G-DX1LVZX0XQ');
            return;
        }
        
        // Load GA4 script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-DX1LVZX0XQ';
        document.head.appendChild(script1);
        
        // Load inline configuration script
        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DX1LVZX0XQ');
        `;
        document.head.appendChild(script2);
    };

    const handleAcceptAll = () => {
        const newConsent = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        setConsent(newConsent);
        // Save to localStorage - this prevents banner from showing again
        localStorage.setItem("cookieConsent", JSON.stringify(newConsent));
        // Also save timestamp for future reference
        localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
        
        // Google Consent Mode v2'yi güncelle - Tüm izinler verildi
        updateConsentMode(true, true);
        
        setShowBanner(false);
        initializeGTM();
        initializeGA4();
        
        // Push consent event to GTM and GA4
        if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({
                event: "cookie_consent",
                consent_type: "accept_all",
            });
        }
        
        // Send consent event to GA4
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag('event', 'cookie_consent', {
                consent_type: 'accept_all'
            });
        }
    };

    const handleRejectAll = () => {
        const newConsent = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        setConsent(newConsent);
        // Save to localStorage - this prevents banner from showing again
        localStorage.setItem("cookieConsent", JSON.stringify(newConsent));
        // Also save timestamp for future reference
        localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
        
        // Google Consent Mode v2'yi güncelle - Tüm izinler reddedildi
        updateConsentMode(false, false);
        
        setShowBanner(false);
    };

    const handleSavePreferences = () => {
        // Save to localStorage - this prevents banner from showing again
        localStorage.setItem("cookieConsent", JSON.stringify(consent));
        // Also save timestamp for future reference
        localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
        
        // Google Consent Mode v2'yi güncelle (kullanıcı tercihlerine göre)
        updateConsentMode(consent.analytics, consent.marketing);
        
        setShowBanner(false);
        setShowSettings(false);
        
        if (consent.analytics) {
            initializeGTM();
            initializeGA4();
            if (typeof window !== "undefined" && window.dataLayer) {
                window.dataLayer.push({
                    event: "cookie_consent",
                    consent_type: "custom",
                    analytics: consent.analytics,
                    marketing: consent.marketing,
                });
            }
            
            // Send consent event to GA4
            if (typeof window !== "undefined" && window.gtag) {
                window.gtag('event', 'cookie_consent', {
                    consent_type: 'custom',
                    analytics: consent.analytics,
                    marketing: consent.marketing
                });
            }
        }
    };

    const toggleCategory = (category: 'analytics' | 'marketing') => {
        setConsent((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    // Prevent hydration mismatch - don't render until mounted on client
    if (!mounted) {
        return null;
    }

    if (!showBanner) {
        return (
            <button
                onClick={() => {
                    setShowBanner(true);
                    setShowSettings(true);
                }}
                className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-gray-950/90 backdrop-blur-xl border border-gray-800 rounded-full text-white text-sm font-light hover:bg-gray-900 transition-all duration-300 shadow-lg flex items-center gap-2"
                aria-label={t("cookie.manageSettings") || "Manage cookie settings"}
            >
                <FiSettings className="w-4 h-4" />
                <span className="hidden sm:inline">{t("cookie.manageSettings") || "Cookie Settings"}</span>
            </button>
        );
    }

    // Format date based on current language
    const formatDate = (date: Date) => {
        const locales: Record<string, string> = {
            'tr': 'tr-TR',
            'en': 'en-US',
            'fr': 'fr-FR'
        };
        return date.toLocaleDateString(locales[lang] || 'tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            {/* Cookie Policy Drawer */}
            {showPolicy && (
                <div className="fixed inset-0 z-[110] pointer-events-auto animate-fade-in">
                    {/* Enhanced Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
                        onClick={() => setShowPolicy(false)}
                        aria-hidden="true"
                    />
                    
                    {/* Drawer with enhanced visibility */}
                    <div className="fixed bottom-0 left-0 right-0 bg-gray-950 backdrop-blur-xl border-t-2 border-red-600/30 shadow-2xl shadow-red-600/20 max-h-[95vh] overflow-hidden flex flex-col animate-slide-up-enhanced">
                        {/* Visual Indicator Bar */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-transparent via-red-600/50 to-transparent rounded-full mb-2" />
                        
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full" />
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-light">
                                    <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent animate-gradient-shift">
                                        {t("cookiePolicy.title")}
                                    </span>
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowPolicy(false)}
                                className="group p-2.5 text-gray-400 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-950"
                                aria-label="Close cookie policy"
                            >
                                <FiX className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                        
                        {/* Scrollable Content with custom scrollbar */}
                        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 custom-scrollbar">
                            <div className="max-w-4xl mx-auto space-y-8 text-gray-300 font-light leading-relaxed">
                                {/* Last Updated Badge */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-full text-gray-400 text-xs sm:text-sm font-medium">
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                        {t("cookiePolicy.lastUpdated")} {formatDate(new Date())}
                                    </div>
                                </div>

                                <section className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-light text-white">{t("cookiePolicy.whatAreCookies")}</h3>
                                    <p className="text-base sm:text-lg">
                                        {t("cookiePolicy.whatAreCookiesDesc")}
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-light text-white">{t("cookiePolicy.cookieTypes")}</h3>
                                    
                                    <div className="space-y-6">
                                        <div className="group bg-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-gray-900/70 hover:shadow-lg hover:shadow-red-600/10">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-1 h-full bg-gradient-to-b from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <h4 className="text-lg sm:text-xl font-medium text-white">{t("cookiePolicy.necessary.title")}</h4>
                                            </div>
                                            <p className="text-base sm:text-lg mb-2">
                                                {t("cookiePolicy.necessary.desc")}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {t("cookiePolicy.necessary.duration")}
                                            </p>
                                        </div>

                                        <div className="group bg-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-gray-900/70 hover:shadow-lg hover:shadow-red-600/10">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-1 h-full bg-gradient-to-b from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <h4 className="text-lg sm:text-xl font-medium text-white">{t("cookiePolicy.analytics.title")}</h4>
                                            </div>
                                            <p className="text-base sm:text-lg mb-2">
                                                {t("cookiePolicy.analytics.desc")}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {t("cookiePolicy.analytics.duration")}
                                            </p>
                                        </div>

                                        <div className="group bg-gray-900/50 border border-gray-800 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-gray-900/70 hover:shadow-lg hover:shadow-red-600/10">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-1 h-full bg-gradient-to-b from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <h4 className="text-lg sm:text-xl font-medium text-white">{t("cookiePolicy.marketing.title")}</h4>
                                            </div>
                                            <p className="text-base sm:text-lg mb-2">
                                                {t("cookiePolicy.marketing.desc")}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {t("cookiePolicy.marketing.duration")}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-light text-white">{t("cookiePolicy.manage")}</h3>
                                    <p className="text-base sm:text-lg">
                                        {t("cookiePolicy.manageDesc")}
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-light text-white">{t("cookiePolicy.privacyRights")}</h3>
                                    <p className="text-base sm:text-lg">
                                        {t("cookiePolicy.privacyRightsDesc")}
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-light text-white">{t("cookiePolicy.changes")}</h3>
                                    <p className="text-base sm:text-lg">
                                        {t("cookiePolicy.changesDesc")}
                                    </p>
                                </section>

                                <section className="space-y-4 pt-8 border-t border-gray-800">
                                    <h3 className="text-xl sm:text-2xl font-light text-white">{t("cookiePolicy.contact")}</h3>
                                    <p className="text-base sm:text-lg">
                                        {t("cookiePolicy.contactDesc")}
                                    </p>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cookie Banner Modal - Top of Page */}
            {showBanner && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-6 md:pt-8 px-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
                        onClick={() => {
                            // Don't close on backdrop click for cookie consent (GDPR requirement)
                            // User must make an active choice
                        }}
                        aria-hidden="true"
                    />
                    
                    {/* Modal Content - Top Positioned */}
                    <div 
                        id="cookie-banner"
                        className="relative w-full max-w-4xl bg-gray-950/95 backdrop-blur-xl border-2 border-red-600/40 rounded-2xl shadow-2xl shadow-red-600/30 pointer-events-auto animate-modal-enter-top overflow-hidden"
                    >
                        {/* Visual indicator at top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-transparent via-red-600/60 to-transparent rounded-full" />
                        
                        <div className="px-6 sm:px-8 md:px-10 py-6 sm:py-8 relative">
                            {!showSettings ? (
                                // Simple Banner
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full animate-pulse" />
                                                <h3 className="text-white font-semibold text-xl sm:text-2xl md:text-3xl">
                                                    <span className="bg-gradient-to-r from-white via-red-50 to-white bg-clip-text text-transparent">
                                                        {t("cookie.title") || "We value your privacy"}
                                                    </span>
                                                </h3>
                                            </div>
                                            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                                {t("cookie.description") || "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies."}
                                                {" "}
                                                <button
                                                    onClick={() => setShowPolicy(true)}
                                                    className="group inline-flex items-center gap-1 text-red-600 hover:text-red-500 font-medium underline underline-offset-4 hover:underline-offset-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-950 rounded px-1 animate-pulse-glow-subtle"
                                                    aria-label="Learn more about our cookie policy"
                                                >
                                                    {t("cookie.learnMore") || "Learn more"}
                                                    <svg className="w-4 h-4 inline-block transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-800">
                                        <button
                                            onClick={() => setShowSettings(true)}
                                            className="px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-full text-white text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                                        >
                                            <FiSettings className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span>{t("cookie.customize") || "Customize"}</span>
                                        </button>
                                        <button
                                            onClick={handleRejectAll}
                                            className="px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-full text-white text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                                        >
                                            {t("cookie.rejectAll") || "Reject All"}
                                        </button>
                                        <button
                                            onClick={handleAcceptAll}
                                            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 hover:scale-105"
                                        >
                                            {t("cookie.acceptAll") || "Accept All"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Settings Panel
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold text-xl sm:text-2xl">
                                            <span className="bg-gradient-to-r from-white via-red-50 to-white bg-clip-text text-transparent">
                                                {t("cookie.settingsTitle") || "Cookie Preferences"}
                                            </span>
                                        </h3>
                                        <button
                                            onClick={() => setShowSettings(false)}
                                            className="group p-2 text-gray-400 hover:text-white transition-all rounded-full hover:bg-gray-800 hover:scale-110"
                                            aria-label="Close settings"
                                        >
                                            <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>

                            <div className="space-y-4">
                                {/* Necessary Cookies */}
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium mb-1">
                                                {t("cookie.necessary.title") || "Necessary Cookies"}
                                            </h4>
                                            <p className="text-gray-400 text-sm">
                                                {t("cookie.necessary.description") || "These cookies are essential for the website to function properly. They cannot be disabled."}
                                            </p>
                                        </div>
                                        <div className="ml-4 px-3 py-1 bg-gray-800 rounded-full">
                                            <FiCheck className="w-5 h-5 text-red-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics Cookies */}
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium mb-1">
                                                {t("cookie.analytics.title") || "Analytics Cookies"}
                                            </h4>
                                            <p className="text-gray-400 text-sm">
                                                {t("cookie.analytics.description") || "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => toggleCategory("analytics")}
                                            className={`ml-4 w-14 h-8 rounded-full transition-all duration-300 ${
                                                consent.analytics
                                                    ? "bg-red-600"
                                                    : "bg-gray-700"
                                            } relative`}
                                            aria-label="Toggle analytics cookies"
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                                                    consent.analytics ? "translate-x-6" : "translate-x-0"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Marketing Cookies */}
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium mb-1">
                                                {t("cookie.marketing.title") || "Marketing Cookies"}
                                            </h4>
                                            <p className="text-gray-400 text-sm">
                                                {t("cookie.marketing.description") || "These cookies are used to deliver advertisements that are relevant to you and your interests."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => toggleCategory("marketing")}
                                            className={`ml-4 w-14 h-8 rounded-full transition-all duration-300 ${
                                                consent.marketing
                                                    ? "bg-red-600"
                                                    : "bg-gray-700"
                                            } relative`}
                                            aria-label="Toggle marketing cookies"
                                        >
                                            <span
                                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                                                    consent.marketing ? "translate-x-6" : "translate-x-0"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-800">
                                        <button
                                            onClick={handleRejectAll}
                                            className="px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-full text-white text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                                        >
                                            {t("cookie.rejectAll") || "Reject All"}
                                        </button>
                                        <button
                                            onClick={handleAcceptAll}
                                            className="px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-full text-white text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                                        >
                                            {t("cookie.acceptAll") || "Accept All"}
                                        </button>
                                        <button
                                            onClick={handleSavePreferences}
                                            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 hover:scale-105"
                                        >
                                            {t("cookie.savePreferences") || "Save Preferences"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

