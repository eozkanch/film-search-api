"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import { fetchMovies } from "@/app/api/movies";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { Movie } from "../types";
import { FiArrowRight, FiPlay, FiStar } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useRouter } from "next/navigation";

const MovieCarousel = dynamic(() => import("@/app/components/MovieCarousel"), {
    loading: () => <LoadingSpinner message="Loading carousel..." />,
    ssr: false,
});

const TOP_RATED_TITLES = [
    "The Lord of the Rings: The Return of the King",
    "Everything Everywhere All at Once",
    "Inception",
    "Interstellar",
    "The Lord of the Rings: The Fellowship of the Ring",
    "Fight Club",
    "Inglourious Basterds",
    "The Godfather Part II",
];

export default function TopRatedMovies() {
    const { t } = useTranslation();
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);
    const cache = useRef(new Map<string, Movie>());

    useEffect(() => {
        fetchTopRatedMovies();
    }, []);

    const fetchTopRatedMovies = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const moviePromises = TOP_RATED_TITLES.map((title) => {
                if (cache.current.has(title)) {
                    return Promise.resolve(cache.current.get(title)!);
                }
                return fetchMovies({ query: title }).then((data) => {
                    const movie = data.Search?.[0] || null;
                    if (movie) {
                        cache.current.set(title, movie);
                    }
                    return movie;
                });
            });

            const results = await Promise.allSettled(moviePromises);
            const fetchedMovies = results
                .filter(
                    (result) => result.status === "fulfilled" && result.value
                )
                .map((result) => (result as PromiseFulfilledResult<Movie | null>).value!)
                .filter((movie): movie is Movie => movie !== null);

            setMovies(fetchedMovies);
        } catch (err) {
            setError(t("topRated.error"));
        } finally {
            setLoading(false);
        }
    };

    // Hero carousel auto-rotate
    useEffect(() => {
        if (movies.length > 0) {
            const interval = setInterval(() => {
                setCurrentHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 3));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [movies.length]);

    const heroMovie = movies[currentHeroIndex] || movies[0];
    const heroMovies = movies.slice(0, 3);

    return (
        <section className="relative bg-black text-white overflow-hidden" aria-label="Top Rated Movies">
            {/* Hero Section - Film Site Style */}
            {!loading && !error && heroMovie && (
                <div className="relative w-full h-screen min-h-[600px] max-h-[900px]">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <Image
                            src={heroMovie.Poster !== "N/A" ? heroMovie.Poster : "/NoImage.webp"}
                            alt={heroMovie.Title}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                            quality={90}
                        />
                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 h-full flex items-end">
                        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full pb-12 sm:pb-16 md:pb-20 lg:pb-24">
                            <div className="max-w-2xl lg:max-w-3xl">
                                {/* Rating Badge */}
                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                    <FiStar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
                                    <span className="text-lg sm:text-xl font-semibold text-white">
                                        {t("topRated.badge")}
                                    </span>
                                </div>

                                {/* Movie Title */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                                        {heroMovie.Title}
                                    </span>
                                </h1>

                                {/* Movie Info */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-gray-300">
                                    {heroMovie.Year && (
                                        <span>{heroMovie.Year}</span>
                                    )}
                                    {heroMovie.Type && (
                                        <span className="capitalize">{heroMovie.Type}</span>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                    <div className="group inline-flex items-center gap-4 sm:gap-6 px-6 py-3 sm:px-8 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-600/50">
                                        <button
                                            onClick={() => router.push(`/movie/${heroMovie.imdbID}`)}
                                            aria-label={`${t("topRated.watchNow")} - ${heroMovie.Title}`}
                                            className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 rounded"
                                        >
                                            <FiPlay className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                                            <Link
                                            href={`/movie/${heroMovie.imdbID}`}
                                            aria-label={`${t("topRated.moreInfo")} - ${heroMovie.Title}`}
                                            className="text-white/80 hover:text-white font-medium underline underline-offset-4 hover:underline-offset-2 transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 rounded"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t("topRated.moreInfo")}
                                        </Link>
                                        </button>
                                       
                                      
                                    </div>
                                </div>

                                {/* Hero Indicator Dots */}
                                {heroMovies.length > 1 && (
                                    <div className="flex items-center gap-2 mt-8 sm:mt-10">
                                        {heroMovies.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentHeroIndex(index)}
                                                aria-label={`${t("topRated.heroIndicator")} ${index + 1}`}
                                                aria-current={currentHeroIndex === index ? "true" : "false"}
                                                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                                                    currentHeroIndex === index
                                                        ? "w-8 bg-red-600"
                                                        : "w-2 bg-white/30 hover:bg-white/50"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="relative bg-black py-16 sm:py-20 md:py-24">
                    <LoadingSpinner message={t("topRated.loading")} />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="relative bg-black py-16 sm:py-20 md:py-24">
                    <div className="text-center py-8">
                        <p className="text-red-500 text-sm sm:text-base md:text-lg px-4">{error}</p>
                        <button
                            onClick={fetchTopRatedMovies}
                            aria-label="Retry loading top rated movies"
                            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            {t("topRated.retry")}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
