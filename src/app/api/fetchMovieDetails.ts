import { Movie } from "../types";

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface MovieDetailsResponse extends Movie {
    Response?: string;
    Error?: string;
}

export async function fetchMovieDetails(id: string): Promise<Movie> {
    if (!id) throw new Error("Movie ID is required");
    if (!OMDB_API_KEY || !OMDB_API_URL) {
        throw new Error("API key or URL is not configured");
    }
    
    const params = new URLSearchParams({
        apikey: OMDB_API_KEY,
        i: id,
    });

    const response = await fetch(`${OMDB_API_URL}?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }

    const data = await response.json() as MovieDetailsResponse;

    if (data.Response === "False") {
        throw new Error(data.Error || "No data available for this movie");
    }

    return data as Movie;
}