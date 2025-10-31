"use client";

import Link from "next/link";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
            {/* Background Gradient Overlays - Subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
            <div className="absolute top-10 right-10 w-48 h-48 sm:w-64 sm:h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-64 h-64 sm:w-80 sm:h-80 bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-2xl mx-auto">
                {/* 404 Large Background Text */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <h1 className="text-[30vw] sm:text-[25vw] md:text-[20vw] lg:text-[15vw] font-extrabold text-gray-900/30 select-none pointer-events-none tracking-tighter">
                        404
                    </h1>
                </div>

                {/* Main Content */}
                <div className="space-y-6 sm:space-y-8 md:space-y-10 py-16 sm:py-20 md:py-24">
                    {/* Title - Apple Style */}
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("notFound.title")}
                        </span>
                    </h2>

                    {/* Description - Apple Style */}
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
                        {t("notFound.description")}{" "}
                        <Link
                            href="/"
                            className="text-red-600 hover:text-red-500 underline underline-offset-4 hover:underline-offset-2 transition-all duration-300 font-medium"
                        >
                            {t("notFound.homeLink")}
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}

