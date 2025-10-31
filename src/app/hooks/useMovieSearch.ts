import { useState, useCallback, useRef } from "react";
import { fetchMovies } from "@/app/api/movies";
import { Movie } from "../types";
import { sanitizeInput, validateYear } from "../utils/sanitize";

interface CacheEntry {
    movies: Movie[];
    totalResults: number;
}

interface UseMovieSearchReturn {
    query: string;
    year: string;
    type: string;
    movies: Movie[];
    loading: boolean;
    error: string | null;
    page: number;
    totalResults: number;
    totalPages: number;
    setQuery: (query: string) => void;
    setYear: (year: string) => void;
    setType: (type: string) => void;
    setPage: (page: number) => void;
    handleFetchMovies: () => Promise<void>;
    resetFilters: () => void;
    clearCache: () => void;
}

export const useMovieSearch = (maxCacheSize: number = 50): UseMovieSearchReturn => {
    const [query, setQuery] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);

    const cache = useRef(new Map<string, CacheEntry>());

    const getFromCache = useCallback((key: string): CacheEntry | null => {
        if (cache.current.has(key)) {
            const value = cache.current.get(key)!;
            cache.current.delete(key);
            cache.current.set(key, value);
            return value;
        }
        return null;
    }, []);

    const setToCache = useCallback((key: string, value: CacheEntry): void => {
        if (cache.current.size >= maxCacheSize) {
            const firstKey = cache.current.keys().next().value;
            if (firstKey) {
                cache.current.delete(firstKey);
            }
        }
        cache.current.set(key, value);
    }, [maxCacheSize]);

    const handleFetchMovies = useCallback(async (): Promise<void> => {
        // Security: Sanitize and validate inputs
        const sanitizedQuery = sanitizeInput(query);

        if (!sanitizedQuery) {
            setError("Search query cannot be empty.");
            setMovies([]);
            setTotalResults(0);
            return;
        }

        // Security: Validate year input
        const validatedYear = year ? validateYear(year) : "";
        if (year && !validatedYear) {
            setError("Invalid year format. Please enter a 4-digit year (1900-2100).");
            setMovies([]);
            setTotalResults(0);
            return;
        }

        const cacheKey = `${sanitizedQuery}-${type || 'all'}-${validatedYear || 'all'}-${page}`;
        const cachedData = getFromCache(cacheKey);

        if (cachedData) {
            setMovies(cachedData.movies);
            setTotalResults(cachedData.totalResults);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await fetchMovies({
                query: sanitizedQuery,
                type: type || undefined, // Only pass if defined
                year: validatedYear || undefined,
                page,
            });

            const movieData = data.Search || [];
            const total = parseInt(data.totalResults || "0", 10);

            setToCache(cacheKey, {
                movies: movieData,
                totalResults: total,
            });

            setMovies(movieData);
            setTotalResults(total);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            setMovies([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [query, type, year, page, getFromCache, setToCache]);

    const resetFilters = useCallback((): void => {
        setQuery("");
        setYear("");
        setType("");
        setPage(1);
        setMovies([]);
        setTotalResults(0);
        setError(null);
    }, []);

    const clearCache = useCallback((): void => {
        cache.current.clear();
    }, []);

    const totalPages = Math.ceil(totalResults / 10);

    return {
        query,
        year,
        type,
        movies,
        loading,
        error,
        page,
        totalResults,
        totalPages,
        setQuery,
        setYear,
        setType,
        setPage,
        handleFetchMovies,
        resetFilters,
        clearCache,
    };
};
