import { MovieSearchParams, MovieSearchResponse } from "../types";
import { logError } from "../utils/logger";

export async function fetchMovies({ query, type, year, page }: MovieSearchParams): Promise<MovieSearchResponse> {
    const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_KEY || !API_URL) {
        throw new Error("API key or URL is not configured");
    }

    const url = new URL(API_URL);
    url.searchParams.append("apikey", API_KEY);

    if (query) url.searchParams.append("s", query);
    if (type) url.searchParams.append("type", type);
    if (year) url.searchParams.append("y", year);
    if (page) url.searchParams.append("page", page.toString());

    try {
        const response = await fetch(url.toString(), {
            cache: 'no-store',
            next: { revalidate: 3600 }
        });

        // Handle HTTP errors (401, 429, etc.)
        if (!response.ok) {
            if (response.status === 401) {
                logError("API authentication error", undefined, { status: response.status });
                throw new Error("Unable to authenticate with the movie database. Please try again later.");
            } else if (response.status === 429) {
                logError("API rate limit exceeded", undefined, { status: response.status });
                throw new Error("Service temporarily unavailable. Please try again later.");
            } else {
                logError("API request failed", undefined, { status: response.status });
                throw new Error("Unable to fetch movies. Please try again later.");
            }
        }

        const data = await response.json() as MovieSearchResponse;

        if (data.Response === "True") {
            return data;
        } else {
            // Check for specific API errors
            const errorMessage = data.Error || "API request failed";
            logError("API returned error", undefined, { error: errorMessage });
            
            if (errorMessage.toLowerCase().includes("limit") || errorMessage.toLowerCase().includes("exceeded")) {
                throw new Error("Service temporarily unavailable. Please try again later.");
            }
            
            // Generic error message for production
            throw new Error("Unable to fetch movies. Please try again later.");
        }
    } catch (error) {
        if (error instanceof Error) {
            logError("Error in fetchMovies", error);
            throw error;
        }
        throw new Error("Unable to fetch movies. Please try again later.");
    }
}

