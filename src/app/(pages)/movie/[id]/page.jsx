

import { fetchMovieDetails } from "@/app/api/fetchMovieDetails";
import Image from "next/image";

/**
 * Generates metadata for the movie details page.
 * @param {Object} params - Route parameters.
 * @returns {Object} Metadata object.
 */
export async function generateMetadata({ params }) {
    const { id } = params;

    try {
        const movie = await fetchMovieDetails(id);

        if (!movie || movie.Response === "False") {
            return {
                title: "Movie Details - Not Found",
                description: "Movie details are not available.",
            };
        }

        return {
            title: `${movie.Title} - Movie Details`,
            description: movie.Plot || "Detailed information about the movie.",
        };
    } catch (error) {
        console.error("Error generating metadata:", error);

        return {
            title: "Movie Details - Error",
            description: "An error occurred while fetching movie details.",
        };
    }
}

/**
 * MovieDetails Component
 * Displays detailed information about a movie.
 * @param {Object} params - Route parameters.
 * @returns {JSX.Element} Rendered component.
 */
export default async function MovieDetails({ params }) {
    const { id } = params;

    const movie = await fetchMovieDetails(id);

    if (!movie || movie.Response === "False") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <h1 className="text-3xl font-bold">Movie not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-12 bg-black text-white">
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
               
            ></div>

            <div className="container mx-auto flex flex-col lg:flex-row gap-12 items-start">
                {/* Poster Section */}
                <div className="flex-shrink-0 w-full lg:w-1/3">
                    <Image
                        src={movie.Poster !== "N/A" ? movie.Poster : "/NoImage.webp"}
                        alt={movie.Title || "No Image"}
                        width={400}
                        height={600}
                        className="rounded-lg shadow-lg object-cover"
                        priority
                    />
                </div>

                {/* Movie Details Section */}
                <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-4">{movie.Title || "No Title Available"}</h1>
                    <p className="text-gray-300 text-lg">{`${movie.Year || "N/A"} | ${movie.Genre || "N/A"}`}</p>

                    <div className="flex items-center gap-6 my-6">
                        <div className="flex items-center gap-2 text-yellow-400">
                            <span className="text-2xl">&#9733;</span>
                            <span className="text-lg">{movie.imdbRating || "N/A"}/10</span>
                        </div>
                        <p className="text-gray-400">{movie.Runtime || "N/A"}</p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold mb-2">Plot</h2>
                        <p className="text-gray-300 leading-relaxed">
                            {movie.Plot || "No plot available."}
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Director", value: movie.Director },
                            { label: "Writer", value: movie.Writer },
                            { label: "Actors", value: movie.Actors },
                            { label: "Language", value: movie.Language },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <h3 className="text-lg font-semibold text-gray-400">{label}</h3>
                                <p className="text-gray-300">{value || "N/A"}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <a
                            href={`https://www.imdb.com/title/${movie.imdbID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-lg transition"
                        >
                            View on IMDb
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}