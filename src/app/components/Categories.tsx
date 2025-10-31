"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GENRES } from "@/app/utils/genres";
import { useTranslation } from "@/app/hooks/useTranslation";
import { getGenreTranslationKey } from "@/app/utils/genreTranslations";

export default function Categories() {
    const [mounted, setMounted] = useState(false);
    const { t } = useTranslation();

    // Prevent hydration mismatch by only rendering translations on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Show placeholder until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <section className="relative bg-black text-white" aria-label="Categories">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24 lg:py-32">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 gap-6 sm:gap-8">
                        <div className="space-y-2 sm:space-y-3">
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
                                <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                                    <span className="inline-block w-48 h-8 bg-gray-900/50 rounded animate-pulse" />
                                </span>
                            </h2>
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl">
                                <span className="inline-block w-64 h-6 bg-gray-900/50 rounded animate-pulse" />
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-gray-950/50 backdrop-blur-xl border border-gray-900/50 rounded-2xl min-h-[120px] sm:min-h-[140px] md:min-h-[160px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section className="relative bg-black text-white" aria-label="Categories">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24 lg:py-32">
                {/* Header - Title/Subtitle Left */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
                            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                                {t("home.categories.title")}
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl">
                            {t("home.categories.description")}
                        </p>
                    </div>
                </div>

                {/* Categories Grid - Apple Style Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                    {GENRES.map((genre) => (
                        <Link
                            key={genre.id}
                            href={`/category/${genre.id}`}
                            aria-label={`Browse ${t(getGenreTranslationKey(genre.id))} category`}
                            className="group relative focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black rounded-2xl"
                        >
                            {/* Card - Minimalist Apple Style */}
                            <div className="relative bg-gray-950/50 backdrop-blur-xl border border-gray-900/50 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:bg-gray-900/60 hover:border-red-600/30 hover:shadow-2xl hover:shadow-red-600/5">
                                {/* Subtle Background Glow on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:via-red-600/5 group-hover:to-red-600/5 transition-all duration-500" />
                                
                                {/* Content */}
                                <div className="relative px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
                                    {/* Category Name */}
                                    <h3 className="text-base sm:text-lg md:text-xl font-medium text-white group-hover:text-red-500 transition-colors duration-300 tracking-wide">
                                        {t(getGenreTranslationKey(genre.id))}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

