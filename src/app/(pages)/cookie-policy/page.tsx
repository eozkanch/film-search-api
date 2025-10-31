"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function CookiePolicyPage() {
    const { t, lang } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    return (
        <main className="min-h-screen bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base mb-6 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black rounded"
                    >
                        ← {t("cookiePolicy.backToHome")}
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("cookiePolicy.title")}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        {t("cookiePolicy.lastUpdated")} {formatDate(new Date())}
                    </p>
                </div>

                <div className="space-y-8 text-gray-300 font-light leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-light text-white">{t("cookiePolicy.whatAreCookies")}</h2>
                        <p className="text-base sm:text-lg">
                            {t("cookiePolicy.whatAreCookiesDesc")}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-light text-white">{t("cookiePolicy.cookieTypes")}</h2>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-950/50 border border-gray-900/50 rounded-xl p-6">
                                <h3 className="text-xl font-medium text-white mb-3">{t("cookiePolicy.necessary.title")}</h3>
                                <p className="text-base sm:text-lg mb-2">
                                    {t("cookiePolicy.necessary.desc")}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {t("cookiePolicy.necessary.duration")}
                                </p>
                            </div>

                            <div className="bg-gray-950/50 border border-gray-900/50 rounded-xl p-6">
                                <h3 className="text-xl font-medium text-white mb-3">{t("cookiePolicy.analytics.title")}</h3>
                                <p className="text-base sm:text-lg mb-2">
                                    {t("cookiePolicy.analytics.desc")}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {t("cookiePolicy.analytics.duration")}
                                </p>
                            </div>

                            <div className="bg-gray-950/50 border border-gray-900/50 rounded-xl p-6">
                                <h3 className="text-xl font-medium text-white mb-3">{t("cookiePolicy.marketing.title")}</h3>
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
                        <h2 className="text-2xl sm:text-3xl font-light text-white">{t("cookiePolicy.manage")}</h2>
                        <p className="text-base sm:text-lg">
                            {t("cookiePolicy.manageDesc")}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-light text-white">{t("cookiePolicy.privacyRights")}</h2>
                        <p className="text-base sm:text-lg">
                            {t("cookiePolicy.privacyRightsDesc")}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-light text-white">{t("cookiePolicy.changes")}</h2>
                        <p className="text-base sm:text-lg">
                            {t("cookiePolicy.changesDesc")}
                        </p>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-gray-800">
                        <h2 className="text-2xl sm:text-3xl font-light text-white">{t("cookiePolicy.contact")}</h2>
                        <p className="text-base sm:text-lg">
                            {t("cookiePolicy.contactDesc")}
                        </p>
                        <div className="mt-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                {t("cookiePolicy.backToHome")}
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

