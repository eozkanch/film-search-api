"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Pagination,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { fetchMovies } from "@/app/api/movies";
import MovieCard from "@/app/components/MovieCard";
import SearchIcon from "@mui/icons-material/Search";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q");

    // States
    const [query, setQuery] = useState(initialQuery || "");
    const [year, setYear] = useState("");
    const [type, setType] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const debouncedQuery = useDebounce(query, 500);

    // Cache for storing API results
    const cache = useRef(new Map());

    // Fetch movies
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
            setMovies([]);
            setTotalResults(0);
            return;
        }

        const cacheKey = `${sanitizedQuery}-${type}-${year}-${page}`;
        if (cache.current.has(cacheKey)) {
            setMovies(cache.current.get(cacheKey));
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
                cache.current.set(cacheKey, data.Search); // Cache the results
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

    // Calculate total pages
    const totalPages = Math.ceil(totalResults / 10);

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
        <Box sx={{ padding: 3, backgroundColor: "black", minHeight: "100vh" }}>
            {/* Title */}
            <Typography variant="h4" sx={{ color: "white", mb: 3, textAlign: "center" }}>
                Search Results For:{" "}
                <span style={{ color: "red" }}>{query || "All"}</span>
            </Typography>

            {/* Filters */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
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
                    >
                        {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "All"}
                    </Button>
                ))}

                <Button
                    variant="contained"
                    color="error"
                    onClick={resetFilters}
                    sx={{
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={movie.imdbID}>
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