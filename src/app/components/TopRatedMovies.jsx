"use client";

import { useEffect, useState, useRef } from "react";
import MovieCarousel from "@/app/components/MovieCarousel";
import { fetchMovies } from "@/app/api/movies";
import LoadingSpinner from "@/app/components/LoadingSpinner";

// List of top-rated movie titles
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
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cache = useRef(new Map()); // Cache to store API responses

    useEffect(() => {
        fetchTopRatedMovies();
    }, []);

    const fetchTopRatedMovies = async () => {
        setLoading(true);
        setError(null);

        try {
            const moviePromises = TOP_RATED_TITLES.map((title) => {
                if (cache.current.has(title)) {
                    // Return cached data if available
                    return Promise.resolve(cache.current.get(title));
                }
                // Fetch movie data using fetchMovies API
                return fetchMovies({ query: title }).then((data) => {
                    const movie = data.Search?.[0] || null;
                    if (movie) {
                        cache.current.set(title, movie); // Cache the result
                    }
                    return movie;
                });
            });

            const results = await Promise.allSettled(moviePromises);
            const fetchedMovies = results
                .filter(
                    (result) => result.status === "fulfilled" && result.value
                )
                .map((result) => result.value);

            setMovies(fetchedMovies);
        } catch (error) {
            setError("Failed to fetch top-rated movies. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" bg-black text-white">
            {/* Page Title */}
            <h1 className="text-center text-3xl sm:text-4xl font-bold py-6">
                Top-Rated Movies
            </h1>

            {/* Loading State */}
            {loading && (
                <LoadingSpinner message="Loading top-rated movies..." />
            )}

            {/* Error State */}
            {error && (
                <p className="text-center text-red-500">{error}</p>
            )}

            {/* Movie Carousel */}
            {!loading && !error && movies.length > 0 && (
                <MovieCarousel movies={movies} />
            )}

            {/* No Results State */}
            {!loading && !error && movies.length === 0 && (
                <p className="text-center text-gray-400">
                    No top-rated movies found.
                </p>
            )}
        </div>
    );
}