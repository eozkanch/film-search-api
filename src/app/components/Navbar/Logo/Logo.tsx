"use client";

import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="relative flex items-center transition-opacity hover:opacity-90"
            aria-label="CinemaSphere Home"
        >
            <div className="relative">
                {/* Netflix-style Logo - Exact match to Netflix branding */}
                <h1 
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl select-none cursor-pointer"
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        color: '#E50914',
                        textTransform: 'uppercase',
                        lineHeight: '0.9',
                        fontStretch: 'condensed',
                    }}
                >
                    CINEMA
                </h1>
            </div>
        </Link>
    );
}