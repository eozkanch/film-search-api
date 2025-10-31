"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function WhitePaperPage() {
    const { t, lang } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    const technologies = [
        {
            title: "Next.js",
            items: [
                { key: "whitepaper.technologies.nextjs.framework", label: "Framework" },
                { key: "whitepaper.technologies.nextjs.dynamicRouting", label: "Dynamic Routing" },
                { key: "whitepaper.technologies.nextjs.apiRoutes", label: "API Routes" },
            ]
        },
        {
            title: "OMDb API",
            items: [
                { key: "whitepaper.technologies.omdb.description", label: "Description" },
                { key: "whitepaper.technologies.omdb.features", label: "Features" },
            ]
        },
        {
            title: "Tailwind CSS",
            items: [
                { key: "whitepaper.technologies.tailwind.description", label: "Description" },
                { key: "whitepaper.technologies.tailwind.integration", label: "Integration" },
            ]
        },
        {
            title: "React Slick",
            items: [
                { key: "whitepaper.technologies.reactSlick", label: "Description" },
            ]
        },
        {
            title: "Nanostores",
            items: [
                { key: "whitepaper.technologies.nanostores", label: "Description" },
            ]
        },
        {
            title: "i18n",
            items: [
                { key: "whitepaper.technologies.i18n", label: "Description" },
            ]
        },
        {
            title: "Fetching Data",
            items: [
                { key: "whitepaper.technologies.fetchingData", label: "Description" },
            ]
        },
    ];

    const coreFeatures = [
        { key: "whitepaper.coreFeatures.search", label: "Dynamic Search and Filtering" },
        { key: "whitepaper.coreFeatures.loading", label: "Loading and Error Handling" },
        { key: "whitepaper.coreFeatures.pagination", label: "Pagination & Infinite Scroll" },
        { key: "whitepaper.coreFeatures.carousel", label: "Carousel Display" },
        { key: "whitepaper.coreFeatures.responsive", label: "Responsive Design" },
        { key: "whitepaper.coreFeatures.footer", label: "Footer Integration" },
        { key: "whitepaper.coreFeatures.categories", label: "Category-Based Browsing" },
        { key: "whitepaper.coreFeatures.infiniteScroll", label: "Infinite Scroll" },
        { key: "whitepaper.coreFeatures.multilanguage", label: "Multi-Language Support" },
        { key: "whitepaper.coreFeatures.seo", label: "SEO Optimization" },
        { key: "whitepaper.coreFeatures.cookieConsent", label: "Cookie Consent Management" },
    ];

    const workflow = [
        { key: "whitepaper.workflow.input", label: "User Input and Validation" },
        { key: "whitepaper.workflow.fetching", label: "Data Fetching and Debouncing" },
        { key: "whitepaper.workflow.rendering", label: "Data Rendering" },
        { key: "whitepaper.workflow.navigation", label: "User Navigation" },
        { key: "whitepaper.workflow.states", label: "Error and Loading States" },
    ];

    const designPrinciples = [
        { key: "whitepaper.design.userCentric", label: "User-Centric Approach" },
        { key: "whitepaper.design.performance", label: "Performance Optimization" },
        { key: "whitepaper.design.scalability", label: "Scalability" },
        { key: "whitepaper.design.aesthetic", label: "Aesthetic Appeal" },
        { key: "whitepaper.design.apple", label: "Apple Design Principles" },
    ];

    return (
        <main className="min-h-screen bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back to Home Link */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black rounded"
                    >
                        ← {t("common.backToHome")}
                    </Link>
                </div>

                {/* Title */}
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("whitepaper.title")}
                        </span>
                    </h1>
                    <div className="h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent mb-6" />
                </div>

                {/* Introduction */}
                <section className="mb-12 space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-light text-white">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            Introduction
                        </span>
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                        {t("whitepaper.introduction")}
                    </p>
                </section>

                {/* Technologies */}
                <section className="mb-12 space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-light text-white">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("whitepaper.technologies.title")}
                        </span>
                    </h2>
                    <div className="space-y-6">
                        {technologies.map((tech, index) => (
                            <div key={index} className="group bg-gray-950/50 border border-gray-900/50 rounded-xl p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-gray-900/70">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-1 h-full bg-gradient-to-b from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <h3 className="text-xl sm:text-2xl font-medium text-white">{tech.title}</h3>
                                </div>
                                <div className="space-y-3 ml-4">
                                    {tech.items.map((item, itemIndex) => (
                                        <div key={itemIndex}>
                                            <h4 className="text-sm font-medium text-gray-400 mb-1">{item.label}</h4>
                                            <p className="text-gray-300 leading-relaxed">{t(item.key as any)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Core Features */}
                <section className="mb-12 space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-light text-white">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("whitepaper.coreFeatures.title")}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coreFeatures.map((feature, index) => (
                            <div key={index} className="group bg-gray-950/50 border border-gray-900/50 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-gray-900/70">
                                <div className="flex items-start gap-3">
                                    <div className="w-1 h-full bg-gradient-to-b from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-2">{feature.label}</h3>
                                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                            {t(feature.key as any)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Application Workflow */}
                <section className="mb-12 space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-light text-white">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("whitepaper.workflow.title")}
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {workflow.map((step, index) => (
                            <div key={index} className="group bg-gray-950/50 border border-gray-900/50 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-gray-900/70">
                                <div className="flex items-start gap-3">
                                    <div className="w-1 h-full bg-gradient-to-b from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-2">{step.label}</h3>
                                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                            {t(step.key as any)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Design Principles */}
                <section className="mb-12 space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-light text-white">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("whitepaper.design.title")}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {designPrinciples.map((principle, index) => (
                            <div key={index} className="group bg-gray-950/50 border border-gray-900/50 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-gray-900/70">
                                <div className="flex items-start gap-3">
                                    <div className="w-1 h-full bg-gradient-to-b from-red-600 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-2">{principle.label}</h3>
                                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                            {t(principle.key as any)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Conclusion */}
                <section className="mb-12 space-y-4 pt-8 border-t border-gray-800">
                    <h2 className="text-2xl sm:text-3xl font-light text-white">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            Conclusion
                        </span>
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                        {t("whitepaper.conclusion")}
                    </p>
                </section>

                {/* Back to Home Button */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        {t("common.backToHome")}
                    </Link>
                </div>
            </div>
        </main>
    );
}
