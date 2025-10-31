"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiFilter } from "react-icons/fi";
import MovieCard from "@/app/components/MovieCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useMovieSearch } from "@/app/hooks/useMovieSearch";

export default function ExplorePage() {
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState<boolean>(false);
    
    const {
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
    } = useMovieSearch();

    const debouncedQuery = useDebounce(query, 500);

    // URL'den year ve type parametrelerini al
    useEffect(() => {
        const yearParam = searchParams.get("year");
        const typeParam = searchParams.get("type");
        
        if (yearParam && !year) {
            setYear(yearParam);
        }
        if (typeParam && !type) {
            setType(typeParam);
        }
    }, [searchParams, year, type, setYear, setType]);

    useEffect(() => {
        if (debouncedQuery && debouncedQuery.length >= 3) {
            handleFetchMovies();
        }
    }, [debouncedQuery, type, year, page, handleFetchMovies]);

    const handlePageChange = (newPage: number): void => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (): void => {
        setPage(1);
        handleFetchMovies();
    };

    return (
        <main className="relative bg-gradient-to-b from-black via-black to-gray-900 text-white min-h-screen">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative w-full px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
                {/* Header */}
                <div className="mb-6 sm:mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                            Explore
                        </span>
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg">
                        Discover movies, series, and episodes
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-5 sm:mb-6 md:mb-8 space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="relative flex-1 min-w-0">
                            <FiSearch className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-9 sm:pl-10 md:pl-12 pr-2 sm:pr-3 md:pr-4 py-2.5 sm:py-3 md:py-4 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all duration-300 text-sm sm:text-base"
                            />
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={handleSearch}
                                disabled={loading || !query || query.length < 3}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                            >
                                <span className="hidden sm:inline">Search</span>
                                <span className="sm:hidden">🔍</span>
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4 animate-fade-in">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 2024"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full px-2.5 sm:px-3 md:px-4 py-2 bg-black/50 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all duration-300 text-sm sm:text-base"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                                        Type
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {["", "movie", "series", "episode"].map((filterType) => (
                                            <button
                                                key={filterType}
                                                onClick={() => setType(filterType)}
                                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                                    type === filterType
                                                        ? "bg-red-600 text-white hover:bg-red-700"
                                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                                                }`}
                                            >
                                                {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "All"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={handleSearch}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Results Info */}
                    {totalResults > 0 && (
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base px-1">
                            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                            {type && ` (${type})`}
                            {year && ` in ${year}`}
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center my-8 sm:my-10 md:my-12">
                        <LoadingSpinner message="Aranıyor..." />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-full sm:max-w-md mx-auto mb-6 sm:mb-8 bg-red-500/10 border border-red-500/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-red-400 text-xs sm:text-sm md:text-base">
                        {error}
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && movies.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {movies.map((movie, index) => (
                                <div key={movie.imdbID || index} className="flex justify-center">
                                    <MovieCard movie={movie} index={index} priority={index < 6} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-6 sm:mt-8 md:mt-12">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors text-xs sm:text-sm md:text-base font-medium"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center max-w-full overflow-x-auto px-2 py-1">
                                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 10) {
                                            pageNum = i + 1;
                                        } else if (page <= 5) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 4) {
                                            pageNum = totalPages - 9 + i;
                                        } else {
                                            pageNum = page - 4 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm md:text-base font-medium min-w-[2.5rem] ${
                                                    page === pageNum
                                                        ? "bg-red-600 text-white"
                                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors text-xs sm:text-sm md:text-base font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && movies.length === 0 && query && query.length >= 3 && (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-4">
                            No results found. Try a different search term or filters.
                        </p>
                    </div>
                )}

                {/* Initial State */}
                {!loading && !error && movies.length === 0 && (!query || query.length < 3) && (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <p className="text-gray-400 text-xs sm:text-sm md:text-base lg:text-lg px-4">
                            Start searching by typing at least 3 characters...
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
