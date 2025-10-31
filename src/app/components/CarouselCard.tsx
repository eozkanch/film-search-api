"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { Movie } from "../types";

interface CarouselCardProps {
    movie: Movie;
    priority?: boolean;
    index?: number;
}

export default function CarouselCard({ movie, priority = false, index = 0 }: CarouselCardProps) {
    const [posterError, setPosterError] = useState<boolean>(false);

    const posterUrl = 
        movie?.Poster && movie.Poster !== "N/A" && !posterError
            ? movie.Poster
            : "/NoImage.webp";

    return (
        <div
            className="rounded-lg overflow-hidden bg-gray-900 text-white shadow-lg hover:shadow-2xl transition-transform duration-300 relative group hover:scale-105 w-full"
            style={{ height: "clamp(200px, 35vw, 300px)" }}
        >
            <div className="relative w-full h-full bg-gray-800">
                <Image
                    src={posterUrl}
                    alt={movie?.Title || "No Image Available"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    priority={priority || index < 3}
                    loading={priority || index < 3 ? "eager" : "lazy"}
                    fetchPriority={priority || index < 3 ? "high" : "auto"}
                    onError={() => setPosterError(true)}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzFmMjkzNyIvPjwvc3ZnPg=="
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 sm:p-3 md:p-4 flex flex-col justify-end">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 truncate">
                    {movie?.Title || "Unknown Title"}
                </h3>
                <div className="flex items-center justify-between text-gray-400 text-xs sm:text-sm">
                    <span>{movie?.Year || "N/A"}</span>
                    <span className="capitalize">{movie?.Type || "Unknown Type"}</span>
                </div>
            </div>

            <Link
                href={`/movie/${movie?.imdbID}`}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 bg-red-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label={`View details for ${movie?.Title || "movie"}`}
                title={`View details for ${movie?.Title || "movie"}`}
            >
                <FiEye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
            </Link>
        </div>
    );
}
