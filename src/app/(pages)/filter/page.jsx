"use client";

import { useEffect, useState, useRef } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Pagination,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { fetchMovies } from "@/app/api/movies";
import MovieCard from "@/app/components/MovieCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useDebounce } from "@/app/hooks/useDebounce"; // Debounce custom hook

export default function ExplorePage() {
    // States
    const [query, setQuery] = useState(""); // Search query
    const [year, setYear] = useState(""); // Year filter
    const [type, setType] = useState(""); // Type filter
    const [movies, setMovies] = useState([]); // Movies list
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error message
    const [page, setPage] = useState(1); // Current page
    const [totalResults, setTotalResults] = useState(0); // Total results

    const debouncedQuery = useDebounce(query, 500); // Debounce input to reduce API calls
    const cache = useRef(new Map()); // Cache for storing API results

    // Fetch movies from API
    const handleFetchMovies = async () => {
        const sanitizeInput = (input) =>
            input.replace(/[^\w\s]/gi, "").trim(); // Remove special characters
        const sanitizedQuery = sanitizeInput(query);

        if (!sanitizedQuery) {
            setError("Search query cannot be empty.");
            setMovies([]);
            setTotalResults(0);
            return;
        }

        if (year && year.length < 4) {
            setError("Year must be 4 digits.");
            setMovies([]);
            setTotalResults(0);
            return;
        }

        const cacheKey = `${sanitizedQuery}-${type}-${year}-${page}`;
        if (cache.current.has(cacheKey)) {
            // Use cached data if available
            setMovies(cache.current.get(cacheKey).movies);
            setTotalResults(cache.current.get(cacheKey).totalResults);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await fetchMovies({
                query: sanitizedQuery,
                type,
                year,
                page,
            });
            if (data.Search) {
                // Cache results
                cache.current.set(cacheKey, {
                    movies: data.Search,
                    totalResults: parseInt(data.totalResults, 10),
                });
            }
            setMovies(data.Search || []);
            setTotalResults(parseInt(data.totalResults, 10) || 0);
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
            setMovies([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    // Fetch movies when query, type, year, or page changes
    useEffect(() => {
        if (debouncedQuery) {
            handleFetchMovies();
        }
    }, [debouncedQuery, type, year, page]);

    const totalPages = Math.ceil(totalResults / 10); // Calculate total pages

    // Reset filters
    const resetFilters = () => {
        setQuery("");
        setYear("");
        setType("");
        setPage(1);
        setMovies([]);
        setTotalResults(0);
        setError(null);
    };

    return (
        <Box sx={{ padding: { xs: 2, sm: 3 }, backgroundColor: "black", minHeight: "100vh" }}>
            {/* Title */}
            <Typography
                variant="h4"
                sx={{
                    color: "white",
                    mb: 3,
                    textAlign: "center",
                    fontSize: { xs: "1.8rem", sm: "2.5rem" },
                }}
            >
                Explore Movies, Series, and Episodes
            </Typography>

            {/* Filter Controls */}
            <Box
                sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    flexWrap: "wrap",
                    justifyContent: "center",
                    mb: 4,
                }}
            >
                <TextField
                    placeholder="Search by title..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    onClick={handleFetchMovies}
                                    variant="contained"
                                    color="primary"
                                    sx={{ padding: "4px 8px", minWidth: "unset" }}
                                >
                                    <SearchIcon />
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: { xs: "100%", sm: "300px" },
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                            "& fieldset": { borderColor: "gray" },
                            "&:hover fieldset": { borderColor: "red" },
                            "&.Mui-focused fieldset": { borderColor: "red" },
                        },
                    }}
                />

                <TextField
                    placeholder="Year (e.g., 1999)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    size="small"
                    type="number"
                    sx={{
                        width: { xs: "100%", sm: "150px" },
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            borderRadius: 1,
                            "& fieldset": { borderColor: "gray" },
                            "&:hover fieldset": { borderColor: "red" },
                            "&.Mui-focused fieldset": { borderColor: "red" },
                        },
                    }}
                />

                {["", "movie", "series", "episode"].map((filterType) => (
                    <Button
                        key={filterType}
                        variant={type === filterType ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setType(filterType)}
                        sx={{
                            flexGrow: { xs: 1, sm: 0 },
                            maxWidth: "100px",
                        }}
                    >
                        {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "All"}
                    </Button>
                ))}

                <Button
                    variant="contained"
                    color="error"
                    onClick={resetFilters}
                    sx={{
                        flexGrow: { xs: 1, sm: 0 },
                        "&:hover": {
                            backgroundColor: "rgba(255, 0, 0, 0.8)",
                        },
                    }}
                >
                    Reset
                </Button>
            </Box>

            {/* Loading Spinner */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <LoadingSpinner />
                </Box>
            )}

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ maxWidth: "400px", margin: "0 auto 20px" }}>
                    {error}
                </Alert>
            )}

            {/* Movies Grid */}
            <Grid container spacing={3}>
                {movies.map((movie) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}  key={movie.imdbID}>
                        <MovieCard movie={movie} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {!loading && !error && totalResults > 10 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                        sx={{
                            "& .MuiPaginationItem-root": { color: "white" },
                            "& .Mui-selected": { backgroundColor: "red", color: "white" },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}