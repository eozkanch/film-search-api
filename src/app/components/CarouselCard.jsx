"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility"; // MUI Visibility Icon

export default function MovieCard({ movie }) {
    const [posterUrl, setPosterUrl] = useState("/NoImage.webp"); // Default poster image

    // Function to validate the poster URL
    const validatePosterUrl = async (url) => {
        try {
            const response = await fetch(url, { method: "HEAD" });
            if (response.ok && response.headers.get("content-type")?.startsWith("image/")) {
                return url;
            }
        } catch (error) {
            console.error("Error validating poster URL:", error);
        }
        return "/NoImage.webp"; // Fallback image
    };

    useEffect(() => {
        if (movie?.Poster) {
            validatePosterUrl(movie.Poster).then(setPosterUrl);
        }
    }, [movie?.Poster]);

    // Inline styles for better maintainability
    const cardStyle = {
        height: "250px", // Fixed card height
    };

    return (
        <div
            className="rounded-lg overflow-hidden bg-gray-900 text-white shadow-lg hover:shadow-2xl transition-transform duration-300 relative group hover:scale-105"
            style={cardStyle}
        >
            {/* Poster Image */}
            <div className="relative w-full h-full">
                <Image
                    src={posterUrl}
                    alt={movie?.Title || "No Image Available"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
            </div>

            {/* Movie Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-lg font-semibold mb-1 truncate">
                    {movie?.Title || "Unknown Title"}
                </h3>
                <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span>{movie?.Year || "N/A"}</span>
                    <span className="capitalize">{movie?.Type || "Unknown Type"}</span>
                </div>
            </div>

            {/* Visibility Icon */}
            <Link
                href={`/movie/${movie?.imdbID}`}
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label={`View details for ${movie?.Title}`}
            >
                <VisibilityIcon sx={{ fontSize: 24 }} />
            </Link>
        </div>
    );
}