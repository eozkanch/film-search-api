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

    const response = await fetch(url.toString());
    const data = await response.json() as MovieSearchResponse;

    if (data.Response === "True") {
        return data;
    } else {
        throw new Error(data.Error || "API request failed");
    }
}

