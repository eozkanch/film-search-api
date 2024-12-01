const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchMovieDetails(id) {
    if (!id) throw new Error("Movie ID is required");
    const params = new URLSearchParams({
        apikey: OMDB_API_KEY,
        i: id,
    });

    const response = await fetch(`${OMDB_API_URL}?${params}`);
    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }

    const data = await response.json();

    if (data.Response === "False") {
        throw new Error(data.Error || "No data available for this movie");
    }

    return data;
}