"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import MovieCard from "@/app/components/MovieCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useDebounce } from "@/app/hooks/useDebounce";
import { fetchMovies } from "@/app/api/movies";
import { Movie } from "@/app/types";
import { useTranslation } from "@/app/hooks/useTranslation";
import { logError } from "@/app/utils/logger";

export default function MoviesPage() {
    const { t } = useTranslation();
    const [query, setQuery] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const observerTarget = useRef<HTMLDivElement>(null);
    const isInitialLoad = useRef<boolean>(true);

    const debouncedQuery = useDebounce(query, 500);

    const loadInitialMovies = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        setPage(1);
        setMovies([]);
        setHasMore(true);

        try {
            const currentYear = new Date().getFullYear();
            const allMovies: Movie[] = [];
            const fetchedIds = new Set<string>();

            // Son 3 yılın filmlerini yükle
            for (let y = currentYear; y >= currentYear - 2 && allMovies.length < 20; y--) {
                try {
                    const data = await fetchMovies({
                        query: String(y),
                        type: "movie",
                        page: 1,
                    });

                    if (data.Search) {
                        data.Search.forEach((movie) => {
                            if (!fetchedIds.has(movie.imdbID)) {
                                fetchedIds.add(movie.imdbID);
                                allMovies.push(movie);
                            }
                        });
                    }
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (err) {
                    logError("Error fetching movies", err, { year: y });
                }
            }

            // Yıl bazlı sırala (en yeni önce)
            allMovies.sort((a, b) => {
                const yearA = parseInt(a.Year || "0");
                const yearB = parseInt(b.Year || "0");
                return yearB - yearA;
            });

            setMovies(allMovies);
            setTotalResults(allMovies.length);
            setHasMore(allMovies.length >= 10);
            setCurrentYear(currentYear);
        } catch (err) {
            setError("Filmler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
            isInitialLoad.current = false;
        }
    };

    const loadMoreMovies = useCallback(async (): Promise<void> => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        setError(null);

        try {
            let newMovies: Movie[] = [];

            if (query && query.length >= 3) {
                // Search query varsa
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    
                    fetchMovies({
                        query: query.trim(),
                        type: "movie",
                        year,
                        page: nextPage,
                    }).then((data) => {
                        const movieData = data.Search || [];
                        
                        if (movieData.length === 0) {
                            setHasMore(false);
                        } else {
                            setMovies(prev => [...prev, ...movieData]);
                            setTotalResults(prev => prev + movieData.length);
                        }
                        setLoadingMore(false);
                    }).catch((err) => {
                        setError("Daha fazla film yüklenirken bir hata oluştu.");
                        setLoadingMore(false);
                    });
                    
                    return nextPage;
                });
                
                return;
            } else {
                // Yıl bazlı yükleme
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    let foundMovies = false;

                    // Mevcut yıldan devam et
                    const attemptLoad = async () => {
                        for (let attempt = 0; attempt < 5 && !foundMovies; attempt++) {
                            const searchYear = currentYear - Math.floor((nextPage - 1 + attempt) / 10);
                            
                            if (searchYear < 1900) {
                                setHasMore(false);
                                setLoadingMore(false);
                                return;
                            }

                            try {
                                const data = await fetchMovies({
                                    query: String(searchYear),
                                    type: "movie",
                                    page: Math.min((nextPage + attempt) % 10 || 10, 10),
                                });

                                if (data.Search && data.Search.length > 0) {
                                    setMovies(prev => {
                                        const fetchedIds = new Set(prev.map(m => m.imdbID));
                                        const searchResults = data.Search || [];
                                        const uniqueMovies = searchResults.filter((m: Movie) => !fetchedIds.has(m.imdbID));
                                        
                                        if (uniqueMovies.length > 0) {
                                            foundMovies = true;
                                            setTotalResults(totalPrev => totalPrev + uniqueMovies.length);
                                            setLoadingMore(false);
                                            return [...prev, ...uniqueMovies];
                                        }
                                        return prev;
                                    });
                                }
                                
                                if (foundMovies) break;
                                
                                await new Promise(resolve => setTimeout(resolve, 200));
                            } catch (err) {
                                logError("Error loading more movies", err);
                            }
                        }

                        if (!foundMovies) {
                            setHasMore(false);
                            setLoadingMore(false);
                        }
                    };

                    attemptLoad();
                    
                    return nextPage;
                });
            }
        } catch (err) {
            setError("Daha fazla film yüklenirken bir hata oluştu.");
            setLoadingMore(false);
        }
    }, [query, year, page, loadingMore, hasMore, currentYear]);

    const resetAndSearch = (): void => {
        setPage(1);
        setMovies([]);
        setTotalResults(0);
        setHasMore(true);
        handleFetchMovies(true);
    };

    const resetAndLoadInitial = (): void => {
        setPage(1);
        setMovies([]);
        setTotalResults(0);
        setHasMore(true);
        loadInitialMovies();
    };

    const handleFetchMovies = async (reset: boolean = false): Promise<void> => {
        const sanitizedQuery = query.trim();

        if (!sanitizedQuery || sanitizedQuery.length < 3) {
            return;
        }

        if (reset) {
            setLoading(true);
            setMovies([]);
            setPage(1);
        } else {
            setLoadingMore(true);
        }

        setError(null);

        try {
            const currentPage = reset ? 1 : page;
            const data = await fetchMovies({
                query: sanitizedQuery,
                type: "movie",
                year,
                page: currentPage,
            });

            const movieData = data.Search || [];
            const total = parseInt(data.totalResults || "0", 10);

            if (reset) {
                setMovies(movieData);
                setTotalResults(total);
                setHasMore(movieData.length === 10 && total > 10);
            } else {
                setMovies(prev => [...prev, ...movieData]);
                setTotalResults(prev => prev + movieData.length);
                setHasMore(movieData.length === 10 && total > (currentPage * 10));
            }

            setPage(currentPage + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Filmler yüklenirken bir hata oluştu.");
            if (reset) {
                setMovies([]);
                setTotalResults(0);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleSearch = (): void => {
        resetAndSearch();
    };

    const resetFilters = (): void => {
        setQuery("");
        setYear("");
        setPage(1);
        setMovies([]);
        setTotalResults(0);
        setError(null);
        setHasMore(true);
        loadInitialMovies();
    };

    // Infinite scroll için en güncel filmleri yükle
    useEffect(() => {
        if (!query && !year) {
            loadInitialMovies();
        }
    }, []);

    // Intersection Observer ile infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMoreMovies();
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
    }, [hasMore, loadingMore, loading, loadMoreMovies]);

    // Search query değiştiğinde reset
    useEffect(() => {
        if (debouncedQuery && debouncedQuery.length >= 3) {
            resetAndSearch();
        } else if (debouncedQuery.length === 0 && !year) {
            resetAndLoadInitial();
        }
    }, [debouncedQuery]);

    // Year değiştiğinde reset
    useEffect(() => {
        if (year) {
            resetAndSearch();
        }
    }, [year]);

    return (
        <main className="relative bg-gradient-to-b from-black via-black to-gray-900 text-white min-h-screen">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
                {/* Header */}
                <div className="mb-6 sm:mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            {t("movies.title")}
                        </span>
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg">
                        {t("movies.description")}
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-5 sm:mb-6 md:mb-8 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="relative flex-1 min-w-0">
                            <FiSearch className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                                type="text"
                                placeholder={t("movies.searchPlaceholder")}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-9 sm:pl-10 md:pl-12 pr-2 sm:pr-3 md:pr-4 py-2.5 sm:py-3 md:py-4 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all duration-300 text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={handleSearch}
                                disabled={loading || query.length < 3}
                                aria-label={t("common.search")}
                                title={t("common.search")}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                <span className="hidden sm:inline">{t("common.search")}</span>
                                <span className="sm:hidden" aria-hidden="true">🔍</span>
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                aria-label={showFilters ? t("common.hideFilters") || "Hide filters" : t("common.filters")}
                                aria-expanded={showFilters}
                                title={t("common.filters")}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                                <span className="hidden sm:inline">{t("common.filters")}</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4 animate-fade-in">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                                        {t("filter.year")}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 2024"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-2.5 sm:px-3 md:px-4 py-2 bg-black/50 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all duration-300 text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={handleSearch}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    {t("common.apply")}
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    {t("common.reset")}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Results Info */}
                    {totalResults > 0 && (
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base px-1">
                            {totalResults} {totalResults === 1 ? t("common.result") : t("common.results")}
                            {query && ` ${t("search.resultsFor")} "${query}"`}
                        </p>
                    )}
                </div>

                {/* Loading State - Initial */}
                {loading && isInitialLoad.current && (
                    <div className="flex justify-center my-8 sm:my-10 md:my-12">
                        <LoadingSpinner message={t("common.loading")} />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-full sm:max-w-md mx-auto mb-6 sm:mb-8 bg-red-500/10 border border-red-500/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-red-400 text-xs sm:text-sm md:text-base">
                        {error}
                    </div>
                )}

                {/* Movies Grid */}
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
                        <div ref={observerTarget} className="h-10 flex items-center justify-center mt-6 sm:mt-8">
                            {loadingMore && (
                                <LoadingSpinner message={t("movies.loadingMore")} />
                            )}
                            {!hasMore && movies.length > 0 && (
                                <p className="text-gray-500 text-sm">
                                    {t("movies.allLoaded")}
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && movies.length === 0 && query.length >= 3 && (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-4">
                            No movies found. Try a different search term.
                        </p>
                    </div>
                )}

                {/* Initial State */}
                {!loading && !error && movies.length === 0 && query.length < 3 && !year && (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-4">
                            En güncel filmler yükleniyor... Aşağı kaydırarak daha fazlasını görebilirsiniz.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

