"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import MovieCard from "@/app/components/MovieCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { fetchMovies } from "@/app/api/movies";
import { Movie } from "@/app/types";

export default function YearPage() {
    const params = useParams();
    const router = useRouter();
    const year = params?.year as string;
    const [movies, setMovies] = useState<Movie[]>([]);
    const [series, setSeries] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMoreMovies, setLoadingMoreMovies] = useState<boolean>(false);
    const [loadingMoreSeries, setLoadingMoreSeries] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pageMovies, setPageMovies] = useState<number>(1);
    const [pageSeries, setPageSeries] = useState<number>(1);
    const [hasMoreMovies, setHasMoreMovies] = useState<boolean>(true);
    const [hasMoreSeries, setHasMoreSeries] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"movies" | "series">("movies");
    const observerTargetMovies = useRef<HTMLDivElement>(null);
    const observerTargetSeries = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef<boolean>(true);

    const yearNumber = parseInt(year || "0", 10);

    const loadInitialData = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        setPageMovies(1);
        setPageSeries(1);
        setMovies([]);
        setSeries([]);
        setHasMoreMovies(true);
        setHasMoreSeries(true);

        try {
            // Load initial movies
            const moviesData = await fetchMovies({
                query: String(yearNumber),
                type: "movie",
                page: 1,
            });

            const initialMovies = moviesData.Search || [];
            setMovies(initialMovies);
            setHasMoreMovies(initialMovies.length === 10);

            // Load initial series
            const seriesData = await fetchMovies({
                query: String(yearNumber),
                type: "series",
                page: 1,
            });

            const initialSeries = seriesData.Search || [];
            setSeries(initialSeries);
            setHasMoreSeries(initialSeries.length === 10);

            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
            setError("İçerik yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
            isInitialLoad.current = false;
        }
    }, [yearNumber]);

    const loadMoreMovies = useCallback(async (): Promise<void> => {
        if (loadingMoreMovies || !hasMoreMovies) return;

        setLoadingMoreMovies(true);
        setError(null);

        try {
            const nextPage = pageMovies + 1;
            const data = await fetchMovies({
                query: String(yearNumber),
                type: "movie",
                page: nextPage,
            });

            const movieData = data.Search || [];

            if (movieData.length === 0) {
                setHasMoreMovies(false);
            } else {
                setMovies(prev => {
                    const fetchedIds = new Set(prev.map(m => m.imdbID));
                    const uniqueMovies = movieData.filter((m: Movie) => !fetchedIds.has(m.imdbID));
                    return [...prev, ...uniqueMovies];
                });
                setPageMovies(nextPage);
            }
        } catch (err) {
            setError("Daha fazla film yüklenirken bir hata oluştu.");
        } finally {
            setLoadingMoreMovies(false);
        }
    }, [yearNumber, pageMovies, loadingMoreMovies, hasMoreMovies]);

    const loadMoreSeries = useCallback(async (): Promise<void> => {
        if (loadingMoreSeries || !hasMoreSeries) return;

        setLoadingMoreSeries(true);
        setError(null);

        try {
            const nextPage = pageSeries + 1;
            const data = await fetchMovies({
                query: String(yearNumber),
                type: "series",
                page: nextPage,
            });

            const seriesData = data.Search || [];

            if (seriesData.length === 0) {
                setHasMoreSeries(false);
            } else {
                setSeries(prev => {
                    const fetchedIds = new Set(prev.map(s => s.imdbID));
                    const uniqueSeries = seriesData.filter((s: Movie) => !fetchedIds.has(s.imdbID));
                    return [...prev, ...uniqueSeries];
                });
                setPageSeries(nextPage);
            }
        } catch (err) {
            setError("Daha fazla dizi yüklenirken bir hata oluştu.");
        } finally {
            setLoadingMoreSeries(false);
        }
    }, [yearNumber, pageSeries, loadingMoreSeries, hasMoreSeries]);

    useEffect(() => {
        if (yearNumber && yearNumber >= 1900 && yearNumber <= new Date().getFullYear()) {
            loadInitialData();
        } else {
            setError("Geçersiz yıl. Lütfen geçerli bir yıl girin.");
        }
    }, [year, loadInitialData]);

    // Intersection Observer for Movies
    useEffect(() => {
        if (activeTab !== "movies" || !hasMoreMovies || loadingMoreMovies || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreMovies && !loadingMoreMovies) {
                    loadMoreMovies();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTargetMovies.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMoreMovies, loadingMoreMovies, loading, activeTab, loadMoreMovies]);

    // Intersection Observer for Series
    useEffect(() => {
        if (activeTab !== "series" || !hasMoreSeries || loadingMoreSeries || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreSeries && !loadingMoreSeries) {
                    loadMoreSeries();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTargetSeries.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMoreSeries, loadingMoreSeries, loading, activeTab, loadMoreSeries]);

    if (!yearNumber || yearNumber < 1900 || yearNumber > new Date().getFullYear()) {
        return (
            <main className="relative bg-gradient-to-b from-black via-black to-gray-900 text-white min-h-screen">
                <div className="relative w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
                    <div className="text-center py-12">
                        <p className="text-red-400 text-lg">Geçersiz yıl</p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                            Ana Sayfaya Dön
                        </button>
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
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {yearNumber}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg">
                        {yearNumber} yılına ait filmler ve diziler
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab("movies")}
                        className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 border-b-2 ${
                            activeTab === "movies"
                                ? "text-red-600 border-red-600"
                                : "text-gray-400 border-transparent hover:text-white"
                        }`}
                    >
                        Movies ({movies.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("series")}
                        className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 border-b-2 ${
                            activeTab === "series"
                                ? "text-red-600 border-red-600"
                                : "text-gray-400 border-transparent hover:text-white"
                        }`}
                    >
                        Series ({series.length})
                    </button>
                </div>

                {/* Loading State - Initial */}
                {loading && isInitialLoad.current && (
                    <div className="flex justify-center my-8 sm:my-10 md:my-12">
                        <LoadingSpinner message="İçerik yükleniyor..." />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-full sm:max-w-md mx-auto mb-6 sm:mb-8 bg-red-500/10 border border-red-500/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-red-400 text-xs sm:text-sm md:text-base">
                        {error}
                    </div>
                )}

                {/* Movies Tab */}
                {activeTab === "movies" && (
                    <>
                        {(!loading || !isInitialLoad.current) && !error && movies.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                                    {movies.map((movie, index) => (
                                        <div key={`${movie.imdbID}-${index}`} className="flex justify-center">
                                            <MovieCard 
                                                movie={movie} 
                                                index={index} 
                                                priority={index < 6} 
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Infinite Scroll Trigger & Loading More */}
                                <div ref={observerTargetMovies} className="h-10 flex items-center justify-center mt-6 sm:mt-8">
                                    {loadingMoreMovies && (
                                        <LoadingSpinner message="Daha fazla film yükleniyor..." />
                                    )}
                                    {!hasMoreMovies && movies.length > 0 && (
                                        <p className="text-gray-500 text-sm">
                                            Tüm filmler yüklendi
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {!loading && !error && movies.length === 0 && (
                            <div className="text-center py-8 sm:py-12 md:py-16">
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-4">
                                    {yearNumber} yılına ait film bulunamadı.
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Series Tab */}
                {activeTab === "series" && (
                    <>
                        {(!loading || !isInitialLoad.current) && !error && series.length > 0 && (
                            <>
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                                    {series.map((item, index) => (
                                        <div key={`${item.imdbID}-${index}`} className="flex justify-center">
                                            <MovieCard 
                                                movie={item} 
                                                index={index} 
                                                priority={index < 6} 
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Infinite Scroll Trigger & Loading More */}
                                <div ref={observerTargetSeries} className="h-10 flex items-center justify-center mt-6 sm:mt-8">
                                    {loadingMoreSeries && (
                                        <LoadingSpinner message="Daha fazla dizi yükleniyor..." />
                                    )}
                                    {!hasMoreSeries && series.length > 0 && (
                                        <p className="text-gray-500 text-sm">
                                            Tüm diziler yüklendi
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {!loading && !error && series.length === 0 && (
                            <div className="text-center py-8 sm:py-12 md:py-16">
                                <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-4">
                                    {yearNumber} yılına ait dizi bulunamadı.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

