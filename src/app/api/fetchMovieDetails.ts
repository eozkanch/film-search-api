import { Movie } from "../types";
import { logError, logInfo } from "../utils/logger";

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface MovieDetailsResponse extends Movie {
    Response?: string;
    Error?: string;
}

export async function fetchMovieDetails(id: string): Promise<Movie> {
    if (!id) {
        throw new Error("Movie ID is required");
    }
    
    if (!OMDB_API_KEY || !OMDB_API_URL) {
        logError("API configuration missing", undefined, {
            hasKey: !!OMDB_API_KEY,
            hasUrl: !!OMDB_API_URL
        });
        throw new Error("API configuration error");
    }
    
    const params = new URLSearchParams({
        apikey: OMDB_API_KEY,
        i: id.trim(),
    });

    try {
        logInfo("Fetching movie details", { movieId: id });
        
        const response = await fetch(`${OMDB_API_URL}?${params}`, {
            cache: 'no-store', // Ensure fresh data
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!response.ok) {
            // Handle specific HTTP status codes with generic messages
            if (response.status === 401) {
                logError("API authentication error", undefined, { status: response.status });
                throw new Error("Unable to authenticate with the movie database. Please try again later.");
            } else if (response.status === 429) {
                logError("API rate limit exceeded", undefined, { status: response.status });
                throw new Error("Service temporarily unavailable. Please try again later.");
            } else {
                logError("API request failed", undefined, { status: response.status });
                throw new Error("Unable to fetch movie details. Please try again later.");
            }
        }

        const data = await response.json() as MovieDetailsResponse;

        if (data.Response === "False") {
            const errorMessage = data.Error || "No data available for this movie";
            logError("API returned error", undefined, { error: errorMessage });
            
            // Check for specific API errors
            if (errorMessage.toLowerCase().includes("limit") || errorMessage.toLowerCase().includes("exceeded")) {
                throw new Error("Service temporarily unavailable. Please try again later.");
            }
            
            // Generic error message for production
            throw new Error("Movie details not available");
        }

        if (!data.imdbID || !data.Title) {
            logError("Invalid movie data received");
            throw new Error("Invalid movie data received");
        }

        return data as Movie;
    } catch (error) {
        if (error instanceof Error) {
            logError("Error in fetchMovieDetails", error);
            throw error;
        }
        throw new Error("Unable to fetch movie details. Please try again later.");
    }
}