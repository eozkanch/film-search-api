"use client";

import React from "react";
import { FiFilm } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
    const { t } = useTranslation();
    const displayMessage = message || t("common.loading");

    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] py-16 sm:py-20 md:py-24 text-white text-center">
            {/* Apple Style Minimalist Loading Spinner */}
            <div className="relative inline-flex mb-8 sm:mb-10 md:mb-12">
                {/* Outer subtle ring - Apple style */}
                <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-gray-800/30 rounded-full" />
                
                {/* Main spinning ring */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin transition-all duration-500 ease-in-out" />
                
                {/* Center icon - Minimalist */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-950/50 backdrop-blur-xl border border-gray-900/30 flex items-center justify-center">
                        <FiFilm className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-600/80" />
                    </div>
                </div>
            </div>
            
            {/* Loading text - Apple style typography */}
            <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-400 tracking-wide max-w-md mx-auto px-4 leading-relaxed">
                {displayMessage}
            </p>
        </div>
    );
}

