"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Performance: Lazy load heavy components for code splitting
const TopRatedMovies = dynamic(() => import("./components/TopRatedMovies"), {
    loading: () => <LoadingSpinner message="Loading top rated movies..." />,
    ssr: true, // Keep SSR for SEO
});

const NewMovies = dynamic(() => import("./components/NewMovies"), {
    loading: () => <LoadingSpinner message="Loading new movies..." />,
    ssr: true,
});

const NewSeries = dynamic(() => import("./components/NewSeries"), {
    loading: () => <LoadingSpinner message="Loading new series..." />,
    ssr: true,
});

const Categories = dynamic(() => import("./components/Categories"), {
    loading: () => <LoadingSpinner message="Loading categories..." />,
    ssr: true,
});

export default function HomePage() {
    return (
        <main className="min-h-screen bg-black">
          <h1 className="sr-only">Film Search App - Search and Discover Movies</h1>
          <Suspense fallback={<LoadingSpinner />}>
            <TopRatedMovies />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <NewMovies />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <NewSeries />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <Categories />
          </Suspense>
        </main>
    );
}