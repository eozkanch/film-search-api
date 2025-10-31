"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/app/types";
import { FiArrowLeft, FiStar, FiClock, FiCalendar, FiUsers, FiGlobe, FiExternalLink } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";

interface MovieDetailsContentProps {
    movie: Movie | null;
}

export default function MovieDetailsContent({ movie }: MovieDetailsContentProps) {
    const { t } = useTranslation();
    const [posterError, setPosterError] = useState<boolean>(false);
    const [backgroundError, setBackgroundError] = useState<boolean>(false);

    if (!movie) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
                <h1 className="text-3xl sm:text-4xl font-light mb-4">
                    <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                        {t("movieDetails.notFound")}
                    </span>
                </h1>
                <p className="text-gray-400 text-lg mb-8">{t("movieDetails.notFoundDesc")}</p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-gray-950/50 backdrop-blur-xl border border-gray-900/50 rounded-full hover:bg-gray-900/60 hover:border-red-600/30 transition-all duration-300 ease-out text-white font-light"
                >
                    {t("movieDetails.backToHome")}
                </Link>
            </div>
        );
    }

    const posterUrl = movie.Poster && movie.Poster !== "N/A" && !posterError ? movie.Poster : "/NoImage.webp";
    const backgroundUrl = movie.Poster && movie.Poster !== "N/A" && !backgroundError ? movie.Poster : null;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Background Image with Overlay */}
            {backgroundUrl && (
                <div className="fixed inset-0 -z-10">
                    <Image
                        src={backgroundUrl}
                        alt={movie.Title || "Background"}
                        fill
                        className="object-cover opacity-10"
                        quality={30}
                        priority={false}
                        onError={() => setBackgroundError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/50" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {/* Back Button - Apple Style */}
                <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 pt-6 sm:pt-8 md:pt-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-950/50 backdrop-blur-xl border border-gray-900/50 hover:bg-gray-900/60 hover:border-red-600/30 transition-all duration-300 ease-out text-gray-400 hover:text-white font-light text-sm sm:text-base"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>{t("common.backToHome")}</span>
                    </Link>
                </div>

                {/* Main Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-12 md:py-16 lg:py-20">
                    <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16">
                        {/* Poster - Apple Style */}
                        <div className="flex-shrink-0 w-full lg:w-80 xl:w-96 mx-auto lg:mx-0">
                            <div className="relative bg-gray-950/50 backdrop-blur-xl border border-gray-900/50 rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={posterUrl}
                                    alt={movie.Title || "No Image"}
                                    width={400}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                    priority
                                    fetchPriority="high"
                                    sizes="(max-width: 1024px) 100vw, 400px"
                                    onError={() => setPosterError(true)}
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzFmMjkzNyIvPjwvc3ZnPg=="
                                />
                            </div>
                        </div>

                        {/* Movie Details - Apple Style */}
                        <div className="flex-1 space-y-8 sm:space-y-10">
                            {/* Header */}
                            <div className="space-y-4 sm:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
                                    <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                                        {movie.Title || "No Title Available"}
                                    </span>
                                </h1>
                                
                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-400">
                                    {movie.Year && (
                                        <div className="flex items-center gap-2">
                                            <FiCalendar className="w-4 h-4" />
                                            <span>{movie.Year}</span>
                                        </div>
                                    )}
                                    {movie.Genre && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-600">•</span>
                                            <span>{movie.Genre.split(",")[0].trim()}</span>
                                        </div>
                                    )}
                                    {movie.Runtime && (
                                        <div className="flex items-center gap-2">
                                            <FiClock className="w-4 h-4" />
                                            <span>{movie.Runtime}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Rating - Apple Style */}
                                {movie.imdbRating && movie.imdbRating !== "N/A" && (
                                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-950/50 backdrop-blur-xl border border-gray-900/50 rounded-full w-fit">
                                        <FiStar className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-lg font-light text-white">
                                            <span className="font-medium">{movie.imdbRating}</span>
                                            <span className="text-gray-500">/10</span>
                                        </span>
                                        {movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                                            <span className="text-sm text-gray-500 ml-2">
                                                ({movie.imdbVotes} {t("movieDetails.votes")})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Plot - Apple Style */}
                            {movie.Plot && movie.Plot !== "N/A" && (
                                <div className="space-y-3">
                                    <h2 className="text-xl sm:text-2xl font-light text-gray-300">{t("movieDetails.plot")}</h2>
                                    <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed max-w-3xl">
                                        {movie.Plot}
                                    </p>
                                </div>
                            )}

                            {/* Details Grid - Apple Style */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                {[
                                    { label: t("movieDetails.director"), value: movie.Director, icon: FiUsers },
                                    { label: t("movieDetails.writer"), value: movie.Writer, icon: FiUsers },
                                    { label: t("movieDetails.actors"), value: movie.Actors, icon: FiUsers },
                                    { label: t("movieDetails.language"), value: movie.Language, icon: FiGlobe },
                                ].filter(({ value }) => value && value !== "N/A").map(({ label, value, icon: Icon }) => (
                                    <div 
                                        key={label}
                                        className="bg-gray-950/30 backdrop-blur-sm border border-gray-900/30 rounded-xl p-4 sm:p-5 hover:bg-gray-950/50 hover:border-gray-900/50 transition-all duration-300 ease-out"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className="w-4 h-4 text-gray-500" />
                                            <h3 className="text-sm sm:text-base font-light text-gray-500 uppercase tracking-wider">
                                                {label}
                                            </h3>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Info - Apple Style */}
                            {(movie.Rated || movie.Released || movie.Country || movie.Awards) && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-900/50">
                                    {movie.Rated && movie.Rated !== "N/A" && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("movieDetails.rated")}</p>
                                            <p className="text-sm text-gray-300 font-light">{movie.Rated}</p>
                                        </div>
                                    )}
                                    {movie.Released && movie.Released !== "N/A" && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("movieDetails.released")}</p>
                                            <p className="text-sm text-gray-300 font-light">{movie.Released}</p>
                                        </div>
                                    )}
                                    {movie.Country && movie.Country !== "N/A" && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("movieDetails.country")}</p>
                                            <p className="text-sm text-gray-300 font-light">{movie.Country}</p>
                                        </div>
                                    )}
                                    {movie.Awards && movie.Awards !== "N/A" && (
                                        <div className="col-span-2 sm:col-span-1">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("movieDetails.awards")}</p>
                                            <p className="text-sm text-gray-300 font-light">{movie.Awards}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* IMDb Link - Apple Style */}
                            <div className="pt-6 border-t border-gray-900/50">
                                <a
                                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-3 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-light rounded-full transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:shadow-red-600/50"
                                >
                                    <span>{t("movieDetails.viewOnImdb")}</span>
                                    <FiExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



