"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiGlobe, FiGithub, FiLinkedin, FiExternalLink } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function Footer() {
    const [mounted, setMounted] = useState(false);
    const { t } = useTranslation();

    // Prevent hydration mismatch by only rendering on client
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const socialLinks = [
        { 
            icon: <FiGlobe className="w-5 h-5" />, 
            label: "Website",
            link: "https://eozkan.vercel.app",
            color: "hover:text-blue-400"
        },
        { 
            icon: <FiGithub className="w-5 h-5" />, 
            label: "GitHub",
            link: "https://github.com/eozkanch",
            color: "hover:text-gray-300"
        },
        { 
            icon: <FiLinkedin className="w-5 h-5" />, 
            label: "LinkedIn",
            link: "https://www.linkedin.com/in/ebubekirozkan/",
            color: "hover:text-blue-500"
        },
    ];

    // Prevent hydration mismatch - don't render until mounted on client
    if (!mounted) {
        return (
            <footer className="relative bg-gradient-to-b from-black via-black to-gray-900 text-white border-t border-gray-800/50">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
                    <div className="h-32 animate-pulse bg-gray-900/50 rounded" />
                </div>
            </footer>
        );
    }

    return (
        <footer className="relative bg-gradient-to-b from-black via-black to-gray-900 text-white border-t border-gray-800/50">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mb-12">
                    {/* About Us Section */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-white mb-4 relative">
                            <span className="relative z-10">{t("footer.about.title")}</span>
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-600"></span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                            {t("footer.about.description")}
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-white mb-4 relative">
                            <span className="relative z-10">{t("footer.links.title")}</span>
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-600"></span>
                        </h3>
                        <nav className="flex flex-col space-y-2">
                            {[
                                { label: t("nav.movies"), href: "/movies" },
                                { label: t("nav.series"), href: "/series" },
                                { label: t("nav.explore"), href: "/filter" },
                                { label: "WhitePaper", href: "/whitepaper" },
                            ].map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        aria-label={`Go to ${link.label} page`}
                                        className="group inline-flex items-center text-gray-400 hover:text-red-500 transition-all duration-300 text-sm sm:text-base w-fit focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black rounded"
                                    >
                                        <span className="mr-2 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-red-600" aria-hidden="true">→</span>
                                        <span>{link.label}</span>
                                    </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Us Section */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-white mb-4 relative">
                            <span className="relative z-10">{t("footer.contact.title")}</span>
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-600"></span>
                        </h3>
                        <div className="space-y-3">
                            <p className="text-gray-400 text-sm sm:text-base">
                                {t("footer.contact.address")}
                            </p>
                            <div className="flex flex-col space-y-3 pt-2">
                                {socialLinks.map(({ icon, label, link, color }, index) => (
                                    <Link
                                        key={index}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visit ${label} (opens in new tab)`}
                                        className={`group flex items-center space-x-3 text-gray-400 ${color} transition-all duration-300 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black rounded-lg`}
                                    >
                                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 group-hover:bg-gray-800 border border-gray-700/50 group-hover:border-red-600/50 transition-all duration-300" aria-hidden="true">
                                            {icon}
                                        </span>
                                        <span className="text-sm sm:text-base font-medium">{label}</span>
                                        <FiExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-5px] group-hover:translate-x-0 transition-all duration-300" aria-hidden="true" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative pt-8 border-t border-gray-800/50">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-red-600">CINEMA</span>
                            <span className="text-gray-500 text-sm">SPHERE</span>
                        </div>
                       <p className="text-gray-500 text-xs sm:text-sm">
                           &copy; {new Date().getFullYear()} CinemaSphere. {t("footer.copyright")}
                       </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
