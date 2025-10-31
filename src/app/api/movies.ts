import { MovieSearchParams, MovieSearchResponse } from "../types";

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
                throw new Error("API key is invalid or unauthorized. Please check your API key.");
            } else if (response.status === 429) {
                throw new Error("Request limit reached! Please try again later or upgrade your API plan.");
            } else {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json() as MovieSearchResponse;

        if (data.Response === "True") {
            return data;
        } else {
            // Check for specific API errors
            const errorMessage = data.Error || "API request failed";
            
            if (errorMessage.toLowerCase().includes("limit") || errorMessage.toLowerCase().includes("exceeded")) {
                throw new Error("Request limit reached! Please try again later or upgrade your API plan.");
            }
            
            throw new Error(errorMessage);
        }
    } catch (error) {
        if (error instanceof Error) {
            // Re-throw with same error message
            throw error;
        }
        throw new Error("Unknown error occurred while fetching movies");
    }
}

