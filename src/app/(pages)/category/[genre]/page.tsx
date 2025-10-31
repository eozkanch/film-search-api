"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import MovieCard from "@/app/components/MovieCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { GENRES, getGenreById } from "@/app/utils/genres";
import { fetchMoviesByGenre } from "@/app/api/genreMovies";
import { Movie } from "@/app/types";
import Link from "next/link";
import { FiArrowLeft, FiFilter } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";
import { getGenreTranslationKey } from "@/app/utils/genreTranslations";

export default function CategoryPage() {
    const { t } = useTranslation();
    const { genre } = useParams<{ genre: string }>();
    const genreInfo = getGenreById(genre as string);
    
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [type, setType] = useState<"movie" | "series" | undefined>(undefined);
    const observerTarget = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef<boolean>(true);

    const loadMovies = useCallback(async (reset: boolean = false, offset: number = 0): Promise<void> => {
        if (!genre || !genreInfo) return;
        
        if (reset) {
            setLoading(true);
            setPage(1);
            setMovies([]);
            setError(null);
            isInitialLoad.current = true;
            offset = 0;
        } else {
            if (loadingMore || !hasMore) return; // Zaten yükleniyorsa veya daha fazla yoksa çık
            setLoadingMore(true);
        }

        try {
            // Her seferinde 20 film getir
            const result = await fetchMoviesByGenre({
                genre: genreInfo.id,
                type,
                limit: 20,
                page: 1,
            });

            if (reset) {
                setMovies(result.movies);
            } else {
                setMovies(prev => {
                    // Yeni filmleri ekle (duplicate kontrolü)
                    const existingIds = new Set(prev.map(m => m.imdbID));
                    const newMovies = result.movies.filter(m => !existingIds.has(m.imdbID));
                    return [...prev, ...newMovies];
                });
            }

            setHasMore(result.hasMore);
            if (!reset) {
                setPage(prev => prev + 1);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load movies");
        } finally {
            setLoading(false);
            setLoadingMore(false);
            isInitialLoad.current = false;
        }
    }, [genre, genreInfo, type, loadingMore, hasMore]);

    // Initial load and type change
    useEffect(() => {
        if (genreInfo) {
            loadMovies(true);
        } else {
            setError("Invalid genre");
            setLoading(false);
        }
    }, [genreInfo?.id, type]); // type değiştiğinde de reset yap

    // Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && !isInitialLoad.current) {
                    loadMovies(false);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loadingMore, loading, loadMovies]);

    if (!genreInfo) {
        return (
            <main className="relative bg-gradient-to-b from-black via-black to-gray-900 text-white min-h-screen">
                <div className="relative w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
                    <div className="text-center py-12">
                        <p className="text-red-400 text-lg">Invalid genre</p>
                        <Link href="/" className="text-red-500 hover:text-red-400 mt-4 inline-block">
                            Go back home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative bg-gradient-to-b from-black via-black to-gray-900 text-white min-h-screen">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
                {/* Header */}
                <div className="mb-6 sm:mb-8 md:mb-10">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors mb-4 text-sm sm:text-base"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>{t("common.backToHome")}</span>
                    </Link>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3">
                                <span className={`bg-gradient-to-r ${genreInfo.color} bg-clip-text text-transparent`}>
                                    {t(getGenreTranslationKey(genreInfo.id))}
                                </span>
                            </h1>
                            <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg">
                                {t("category.description")} {t(getGenreTranslationKey(genreInfo.id)).toLowerCase()} {t("common.movies")} {t("common.series").toLowerCase()}
                            </p>
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setType(undefined)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                        !type
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                >
                                    {t("common.all")}
                                </button>
                                <button
                                    onClick={() => setType("movie")}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                        type === "movie"
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                >
                                    {t("common.movies")}
                                </button>
                                <button
                                    onClick={() => setType("series")}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                        type === "series"
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                >
                                    {t("common.series")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center my-8 sm:my-10 md:my-12">
                        <LoadingSpinner message={`${t("category.loading")} ${t(getGenreTranslationKey(genreInfo.id))}...`} />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-full sm:max-w-md mx-auto mb-6 sm:mb-8 bg-red-500/10 border border-red-500/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-red-400 text-xs sm:text-sm md:text-base">
                        {error}
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && movies.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {movies.map((movie, index) => (
                                <div key={movie.imdbID || index} className="flex justify-center">
                                    <MovieCard movie={movie} index={index} priority={index < 4} />
                                </div>
                            ))}
                        </div>

                        {/* Infinite Scroll Trigger */}
                        <div ref={observerTarget} className="h-10 flex items-center justify-center mt-6 sm:mt-8">
                            {loadingMore && (
                                <LoadingSpinner message={t("common.loading")} />
                            )}
                            {!hasMore && movies.length > 0 && (
                                <p className="text-gray-500 text-sm">
                                    {t("category.allLoaded")}
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && movies.length === 0 && (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-4">
                            {t("category.noResults")}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

