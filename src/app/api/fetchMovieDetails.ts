import { Movie } from "../types";

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
        console.error("API configuration missing:", {
            hasKey: !!OMDB_API_KEY,
            hasUrl: !!OMDB_API_URL
        });
        throw new Error("API key or URL is not configured");
    }
    
    const params = new URLSearchParams({
        apikey: OMDB_API_KEY,
        i: id.trim(),
    });

    try {
        const apiUrl = `${OMDB_API_URL}?${params}`;
        console.log("Fetching movie details for ID:", id);
        
        const response = await fetch(apiUrl, {
            cache: 'no-store', // Ensure fresh data
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!response.ok) {
            console.error("API response not OK:", response.status, response.statusText);
            
            // Handle specific HTTP status codes
            if (response.status === 401) {
                throw new Error("API key is invalid or unauthorized. Please check your API key.");
            } else if (response.status === 429) {
                throw new Error("Request limit reached! Please try again later or upgrade your API plan.");
            } else {
                throw new Error(`Failed to fetch movie details: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json() as MovieDetailsResponse;

        if (data.Response === "False") {
            const errorMessage = data.Error || "No data available for this movie";
            console.error("API returned error:", errorMessage);
            
            // Check for specific API errors
            if (errorMessage.toLowerCase().includes("limit") || errorMessage.toLowerCase().includes("exceeded")) {
                throw new Error("Request limit reached! Please try again later or upgrade your API plan.");
            }
            
            throw new Error(errorMessage);
        }

        if (!data.imdbID || !data.Title) {
            console.error("Invalid movie data received:", data);
            throw new Error("Invalid movie data received from API");
        }

        return data as Movie;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in fetchMovieDetails:", error.message);
            throw error;
        }
        throw new Error("Unknown error occurred while fetching movie details");
    }
}