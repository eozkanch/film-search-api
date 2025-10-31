"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { fetchMovies } from "@/app/api/movies";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import MovieCard from "@/app/components/MovieCard";
import { Movie } from "../types";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";

export default function NewMovies() {
    const { t } = useTranslation();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const cache = useRef(new Map<string, Movie[]>());

    // Son yılların popüler film anahtar kelimeleri
    const searchQueries = [
        "2024", "2023", "action", "drama", "thriller", 
        "comedy", "adventure", "sci-fi", "horror", "romance"
    ];

    useEffect(() => {
        fetchNewMovies();
    }, []);

    const fetchNewMovies = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            // Cache'den kontrol et
            const cacheKey = "new-movies";
            if (cache.current.has(cacheKey)) {
                const cachedMovies = cache.current.get(cacheKey)!;
                setMovies(cachedMovies.slice(0, 10));
                setLoading(false);
                return;
            }

            const allMovies: Movie[] = [];
            const fetchedIds = new Set<string>();

            // Farklı query'lerle son yılların filmlerini çek
            for (let i = 0; i < searchQueries.length && allMovies.length < 15; i++) {
                const query = searchQueries[i];
                
                try {
                    // Önce yıl bazlı arama dene
                    const year = parseInt(query);
                    const searchParams: any = {
                        type: "movie",
                        page: 1
                    };

                    if (!isNaN(year) && year >= 2020) {
                        // Yıl bazlı arama
                        const yearQuery = ["2024", "2023", "2022", "2021"][i % 4];
                        searchParams.query = yearQuery;
                    } else {
                        // Query bazlı arama
                        searchParams.query = query;
                    }

                    const data = await fetchMovies(searchParams);

                    if (data.Search && data.Search.length > 0) {
                        data.Search.forEach((movie) => {
                            // Duplicate ve yıl kontrolü (2020 ve sonrası)
                            const movieYear = parseInt(movie.Year || "0");
                            if (!fetchedIds.has(movie.imdbID) && movieYear >= 2020) {
                                fetchedIds.add(movie.imdbID);
                                allMovies.push(movie);
                            }
                        });
                    }

                    // Rate limiting için kısa bekleme
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (err) {
                    console.error(`Error fetching movies for query "${query}":`, err);
                    // Devam et, diğer query'leri dene
                }
            }

            // Tarihe göre sırala (en yeni önce)
            allMovies.sort((a, b) => {
                const yearA = parseInt(a.Year || "0");
                const yearB = parseInt(b.Year || "0");
                return yearB - yearA;
            });

            // İlk 10 filmi al
            const newMovies = allMovies.slice(0, 10);
            
            // Cache'e kaydet
            if (newMovies.length > 0) {
                cache.current.set(cacheKey, newMovies);
            }
            
            setMovies(newMovies);
        } catch (err) {
            setError(t("newMovies.error"));
            console.error("Error fetching new movies:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative bg-black text-white" aria-label="New Movies">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24 lg:py-32">
                {/* Header - Title/Subtitle Left, Button Right */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
                            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                                {t("home.newMovies.title")}
                            </span>
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl">
                            {t("home.newMovies.description")}
                        </p>
                    </div>
                    
                    {/* Show All Button - Right */}
                    <Link
                        href="/filter"
                        aria-label={`${t("common.showAll")} - ${t("home.newMovies.title")}`}
                        className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-white bg-gray-950/50 backdrop-blur-xl border border-gray-900/50 rounded-full hover:bg-gray-900/60 hover:border-red-600/30 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-red-600/5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <span>{t("common.showAll")}</span>
                        <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <LoadingSpinner message={t("newMovies.loading")} />
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500 text-sm sm:text-base md:text-lg px-4">{error}</p>
                        <button
                            onClick={fetchNewMovies}
                            aria-label="Retry loading new movies"
                            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            {t("topRated.retry")}
                        </button>
                    </div>
                )}

                {/* Movies Grid */}
                {!loading && !error && movies.length > 0 && (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                        {movies.map((movie, index) => (
                            <div key={movie.imdbID || index} className="flex justify-center">
                                <MovieCard 
                                    movie={movie} 
                                    index={index}
                                    priority={index < 4}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && movies.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <p className="text-lg sm:text-xl text-gray-400 font-light">
                            {t("newMovies.noMovies")}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

