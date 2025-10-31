"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiSearch, FiX, FiMenu, FiChevronDown, FiGlobe } from "react-icons/fi";
import Logo from "./Logo/Logo";
import Link from "next/link";
import { GENRES } from "@/app/utils/genres";
import { useTranslation } from "@/app/hooks/useTranslation";
import { setLanguage, languageStore } from "@/app/stores/languageStore";
import { useStore } from "@nanostores/react";
import { getGenreTranslationKey } from "@/app/utils/genreTranslations";

function NavbarContent() {
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [yearsOpen, setYearsOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const currentLang = useStore(languageStore);

    // Prevent hydration mismatch by only rendering translations on client
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleDrawer = () => setMobileOpen(!mobileOpen);
    const toggleSearch = () => setShowSearch(!showSearch);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length >= 3) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setQuery("");
            setShowSearch(false);
        }
    };

    const navItems = [
        { href: "/filter", label: t("nav.explore") },
        { href: "/movies", label: t("nav.movies") },
        { href: "/series", label: t("nav.series") },
    ];

    const languages = [
        { code: "en" as const, label: "English", flag: "🇬🇧", icon: "EN" },
        { code: "fr" as const, label: "Français", flag: "🇫🇷", icon: "FR" },
        { code: "tr" as const, label: "Türkçe", flag: "🇹🇷", icon: "TR" },
    ];

    const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

    const handleLanguageChange = (lang: "en" | "fr" | "tr") => {
        setLanguage(lang);
        setLangMenuOpen(false);
    };

    // Check if pathname is a category page
    const isCategoryPage = pathname.startsWith("/category/");

    // Son 5 yıl - dinamik
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const isActive = (href: string) => {
        // Exact path match
        if (pathname === href) {
            return true;
        }
        // For filter page, check if it matches explore
        if (href === "/filter" && pathname === "/filter" && !searchParams.get("type")) {
            return true;
        }
        // For year page
        if (pathname.startsWith("/year/")) {
            const yearFromPath = pathname.split("/year/")[1];
            return href === `/year/${yearFromPath}`;
        }
        // For category page
        if (href === "/category" && pathname.startsWith("/category/")) {
            return true;
        }
        return false;
    };

    const handleYearSelect = (year: number) => {
        router.push(`/year/${year}`);
        setYearsOpen(false);
    };

    // Prevent hydration mismatch - show placeholder until mounted
    if (!mounted) {
        return (
            <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-gray-900/50 h-20">
                <div className="h-full flex items-center justify-between px-4">
                    <div className="h-8 w-32 bg-gray-900/50 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-gray-900/50 rounded animate-pulse" />
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Apple Style Navbar */}
            <nav
                className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
                    scrolled
                        ? "bg-black/80 backdrop-blur-xl border-b border-gray-900/30 shadow-lg shadow-black/20"
                        : "bg-black/60 backdrop-blur-md border-b border-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative">
                    <div className="flex items-center justify-between h-16 md:h-20 lg:h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 z-10">
                            <Logo />
                        </div>

                        {/* Mobile Language Toggle - Before Search Apple Style */}
                        <div className="lg:hidden relative">
                            <button
                                onClick={() => {
                                    setLangMenuOpen(!langMenuOpen);
                                    setCategoriesOpen(false);
                                    setYearsOpen(false);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-light transition-all duration-300 ease-out ${
                                    langMenuOpen
                                        ? "text-white bg-gray-950/50 backdrop-blur-sm"
                                        : "text-white/80 hover:text-white hover:bg-gray-950/30"
                                }`}
                            >
                                <span className={`text-sm font-medium ${
                                    currentLang === currentLanguage.code ? "text-red-600" : ""
                                }`}>{currentLanguage.icon}</span>
                                <FiChevronDown 
                                    className={`w-3 h-3 transition-transform duration-300 ease-out ${langMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            
                            {langMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-[40] bg-transparent"
                                        onClick={() => setLangMenuOpen(false)}
                                    />
                                    <div className="absolute top-full right-0 mt-2 w-40 bg-gray-950/80 backdrop-blur-xl border border-gray-900/50 rounded-2xl shadow-2xl shadow-black/50 py-2 z-[50]">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`w-full px-3 py-2 text-left text-white/80 hover:text-white hover:bg-gray-900/50 transition-all duration-300 ease-out text-xs font-light flex items-center gap-2 ${
                                                    currentLang === lang.code ? "text-red-600 bg-gray-900/30" : ""
                                                }`}
                                            >
                                                <span className={`text-xs font-medium ${
                                                    currentLang === lang.code ? "text-red-600" : ""
                                                }`}>{lang.icon}</span>
                                                <span className="text-sm">{lang.flag}</span>
                                                <span className={`flex-1 text-xs ${
                                                    currentLang === lang.code ? "text-red-600" : ""
                                                }`}>{lang.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Desktop Navigation - Apple Style */}
                        <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 relative">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative px-5 xl:px-6 py-2.5 xl:py-3 rounded-xl text-sm sm:text-base transition-all duration-300 ease-out ${
                                        isActive(item.href)
                                            ? "text-white bg-gray-950/50 backdrop-blur-sm"
                                            : "text-white/80 hover:text-white hover:bg-gray-950/30"
                                    }`}
                                >
                                    {item.label}
                                    {isActive(item.href) && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />
                                    )}
                                </Link>
                            ))}
                            
                            {/* Categories Dropdown - Apple Style */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setCategoriesOpen(!categoriesOpen);
                                        setYearsOpen(false);
                                        setLangMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-1.5 xl:gap-2 px-5 xl:px-6 py-2.5 xl:py-3 rounded-xl text-sm sm:text-base transition-all duration-300 ease-out ${
                                        categoriesOpen || pathname.startsWith("/category/")
                                            ? "text-white bg-gray-950/50 backdrop-blur-sm"
                                            : "text-white/80 hover:text-white hover:bg-gray-950/30"
                                    }`}
                                >
                                    {t("nav.categories")}
                                    <FiChevronDown 
                                        className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-300 ease-out ${categoriesOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                
                                {categoriesOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-[40] bg-transparent"
                                            onClick={() => setCategoriesOpen(false)}
                                        />
                                        <div className="absolute top-full left-0 mt-3 w-56 xl:w-64 bg-gray-950/80 backdrop-blur-xl border border-gray-900/50 rounded-2xl shadow-2xl shadow-black/50 py-2 max-h-[80vh] overflow-y-auto z-[50]">
                                            {GENRES.map((genre) => (
                                                <Link
                                                    key={genre.id}
                                                    href={`/category/${genre.id}`}
                                                    onClick={() => setCategoriesOpen(false)}
                                                    className={`px-4 xl:px-5 py-2.5 xl:py-3 text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all duration-300 ease-out block ${
                                                        pathname === `/category/${genre.id}` ? "text-white bg-gray-900/30" : ""
                                                    }`}
                                                >
                                                    <span className="text-xs sm:text-sm">{t(getGenreTranslationKey(genre.id))}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Years Dropdown - Apple Style */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setYearsOpen(!yearsOpen);
                                        setCategoriesOpen(false);
                                        setLangMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-1.5 xl:gap-2 px-5 xl:px-6 py-2.5 xl:py-3 rounded-xl text-sm sm:text-base transition-all duration-300 ease-out ${
                                        yearsOpen || pathname.startsWith("/year/")
                                            ? "text-white bg-gray-950/50 backdrop-blur-sm"
                                            : "text-white/80 hover:text-white hover:bg-gray-950/30"
                                    }`}
                                >
                                    {t("nav.years")}
                                    <FiChevronDown 
                                        className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-300 ease-out ${yearsOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                
                                {yearsOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-[40] bg-transparent"
                                            onClick={() => setYearsOpen(false)}
                                        />
                                        <div className="absolute top-full left-0 mt-3 w-40 xl:w-48 bg-gray-950/80 backdrop-blur-xl border border-gray-900/50 rounded-2xl shadow-2xl shadow-black/50 py-2 z-[50]">
                                            {years.map((year) => (
                                                <button
                                                    key={year}
                                                    onClick={() => handleYearSelect(year)}
                                                    className="w-full px-4 xl:px-5 py-2.5 xl:py-3 text-left text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all duration-300 ease-out text-xs sm:text-sm"
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Language Toggle - Apple Style */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setLangMenuOpen(!langMenuOpen);
                                        setCategoriesOpen(false);
                                        setYearsOpen(false);
                                    }}
                                    className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-xs sm:text-sm transition-all duration-300 ease-out ${
                                        langMenuOpen
                                            ? "text-white bg-gray-950/50 backdrop-blur-sm"
                                            : "text-white/80 hover:text-white hover:bg-gray-950/30"
                                    }`}
                                >
                                    <span className={`text-sm xl:text-base font-medium ${
                                        currentLang === currentLanguage.code ? "text-red-600" : ""
                                    }`}>{currentLanguage.icon}</span>
                                    <FiChevronDown 
                                        className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-300 ease-out ${langMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                
                                {langMenuOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-[40] bg-transparent"
                                            onClick={() => setLangMenuOpen(false)}
                                        />
                                        <div className="absolute top-full right-0 mt-3 w-48 bg-gray-950/80 backdrop-blur-xl border border-gray-900/50 rounded-2xl shadow-2xl shadow-black/50 py-2 z-[50]">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`w-full px-4 py-2.5 text-left text-white/80 hover:text-white hover:bg-gray-900/50 transition-all duration-300 ease-out text-sm sm:text-base flex items-center gap-3 ${
                                                        currentLang === lang.code ? "text-red-600 bg-gray-900/30" : ""
                                                    }`}
                                                >
                                                    <span className={`text-sm font-medium ${
                                                        currentLang === lang.code ? "text-red-600" : ""
                                                    }`}>{lang.icon}</span>
                                                    <span className="text-base mr-1">{lang.flag}</span>
                                                    <span className={`flex-1 ${
                                                        currentLang === lang.code ? "text-red-600" : ""
                                                    }`}>{lang.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Search Bar - Desktop Apple Style - More Visible */}
                        <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-4 lg:mx-6 xl:mx-8">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative w-full"
                            >
                                <div className="relative group">
                                    <FiSearch
                                        className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-red-600 transition-colors duration-300 w-4 h-4 lg:w-5 lg:h-5 z-10"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t("search.placeholder")}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full pl-11 lg:pl-14 pr-4 lg:pr-5 py-2.5 lg:py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm lg:text-[15px] text-white placeholder:text-white/50 font-light focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 focus:bg-white/15 focus:shadow-lg focus:shadow-red-600/20 transition-all duration-300 ease-out"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Mobile Actions - Apple Style */}
                        <div className="flex items-center space-x-2 sm:space-x-3 lg:hidden">
                            <button
                                onClick={toggleSearch}
                                aria-label={t("common.search")}
                                className="p-2.5 sm:p-3 rounded-xl hover:bg-gray-950/50 backdrop-blur-sm transition-all duration-300 ease-out text-white/80 hover:text-white"
                            >
                                <FiSearch className="w-5 h-5 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={toggleDrawer}
                                aria-label="Menu"
                                className="p-2.5 sm:p-3 rounded-xl hover:bg-gray-950/50 backdrop-blur-sm transition-all duration-300 ease-out text-white/80 hover:text-white"
                            >
                                <FiMenu className="w-5 h-5 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Search Overlay - Apple Style */}
            {showSearch && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={toggleSearch}
                    />
                    <div className="absolute top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-gray-900/30 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative group"
                            >
                                <FiSearch
                                    className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-red-600 transition-colors duration-300 w-5 h-5 sm:w-5 sm:h-5 z-10"
                                />
                                <input
                                    type="text"
                                    placeholder={t("search.placeholder")}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                    className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3 sm:py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm sm:text-base text-white placeholder:text-white/50 font-light focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 focus:bg-white/15 focus:shadow-lg focus:shadow-red-600/20 transition-all duration-300 ease-out"
                                />
                                <button
                                    type="button"
                                    onClick={toggleSearch}
                                    className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-gray-900/50 transition-all duration-300 ease-out text-gray-400 hover:text-white"
                                >
                                    <FiX className="w-5 h-5 sm:w-5 sm:h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Drawer - Apple Style */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={toggleDrawer}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-[85vw] sm:w-80 bg-gray-950/90 backdrop-blur-xl border-l border-gray-900/30 shadow-2xl shadow-black/50">
                        <div className="flex flex-col h-full">
                            {/* Header - Apple Style */}
                            <div className="flex items-center justify-between px-5 sm:px-6 py-5 sm:py-6 border-b border-gray-900/50">
                                <h2 className="text-lg sm:text-xl font-light text-white tracking-tight">
                                    {t("nav.explore")}
                                </h2>
                                <button
                                    onClick={toggleDrawer}
                                    className="p-2 rounded-xl hover:bg-gray-900/50 transition-all duration-300 ease-out text-gray-400 hover:text-white"
                                >
                                    <FiX className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                                </button>
                            </div>

                            {/* Navigation Items - Apple Style */}
                            <nav className="flex-1 px-4 sm:px-5 py-5 sm:py-6 space-y-2 overflow-y-auto">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={toggleDrawer}
                                        className={`flex items-center px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base transition-all duration-300 ease-out ${
                                            isActive(item.href)
                                                ? "bg-gray-900/50 text-white"
                                                : "text-white/80 hover:text-white hover:bg-gray-900/30"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                
                                {/* Language Section for Mobile - Apple Style */}
                                <div className="pt-5 border-t border-gray-900/50">
                                    <h3 className="px-4 sm:px-5 py-3 mb-3 text-xs sm:text-sm font-light text-gray-500 uppercase tracking-wider">
                                        Language
                                    </h3>
                                    <div className="space-y-1.5">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    handleLanguageChange(lang.code);
                                                    toggleDrawer();
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-light transition-all duration-300 ease-out ${
                                                    currentLang === lang.code
                                                        ? "bg-gray-900/50 text-red-600"
                                                        : "text-white/80 hover:text-white hover:bg-gray-900/30"
                                                }`}
                                            >
                                                <span className={`text-xs font-medium ${
                                                    currentLang === lang.code ? "text-red-600" : ""
                                                }`}>{lang.icon}</span>
                                                <span className="text-sm">{lang.flag}</span>
                                                <span className={`flex-1 ${
                                                    currentLang === lang.code ? "text-red-600" : ""
                                                }`}>{lang.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Categories Section for Mobile - Apple Style */}
                                <div className="pt-5 border-t border-gray-900/50">
                                    <h3 className="px-4 sm:px-5 py-3 mb-3 text-xs sm:text-sm font-light text-gray-500 uppercase tracking-wider">
                                        {t("nav.categories")}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                        {GENRES.map((genre) => (
                                            <Link
                                                key={genre.id}
                                                href={`/category/${genre.id}`}
                                                onClick={toggleDrawer}
                                                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-white/80 hover:text-white hover:bg-gray-900/30 font-light transition-all duration-300 ease-out"
                                            >
                                                <span>{t(getGenreTranslationKey(genre.id))}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Years Section for Mobile - Apple Style */}
                                <div className="pt-5 border-t border-gray-900/50">
                                    <h3 className="px-4 sm:px-5 py-3 mb-3 text-xs sm:text-sm font-light text-gray-500 uppercase tracking-wider">
                                        {t("nav.years")}
                                    </h3>
                                    <div className="max-h-48 sm:max-h-60 overflow-y-auto">
                                        {years.map((year) => (
                                            <Link
                                                key={year}
                                                href={`/year/${year}`}
                                                onClick={toggleDrawer}
                                                className="flex items-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-white/80 hover:text-white hover:bg-gray-900/30 font-light transition-all duration-300 ease-out"
                                            >
                                                {year}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={
            <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-gray-900/50 h-20" />
        }>
            <NavbarContent />
        </Suspense>
    );
}