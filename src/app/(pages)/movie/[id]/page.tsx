import { fetchMovieDetails } from "@/app/api/fetchMovieDetails";
import Image from "next/image";
import type { Metadata } from "next";
import { Movie } from "@/app/types";
import { generateSEOMetadata, seoConfig } from "@/app/config/seo";
import MovieDetailsContent from "./MovieDetailsContent";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const movie = await fetchMovieDetails(id);

        if (!movie) {
            return generateSEOMetadata({
                title: "Film Bulunamadı",
                description: "Aradığınız film bulunamadı. Lütfen tekrar deneyin.",
                keywords: ["film bulunamadı", "hata"],
                path: `/movie/${id}`,
                lang: "tr",
            });
        }

        const movieTitle = `${movie.Title} (${movie.Year})`;
        const movieDescription = movie.Plot || `${movie.Title} hakkında detaylı bilgiler, IMDb puanı, oyuncular, yönetmen ve daha fazlası.`;
        const movieKeywords = [
            movie.Title,
            `${movie.Title} film`,
            `${movie.Title} izle`,
            movie.Genre?.split(",").map(g => g.trim()) || [],
            movie.Year ? `${movie.Year} filmleri` : "",
            movie.Type === "movie" ? "film detayları" : "dizi detayları",
            ...seoConfig.primaryKeywords.tr
        ].flat().filter(Boolean);

        return generateSEOMetadata({
            title: `${movieTitle} - Film Detayları`,
            description: movieDescription,
            keywords: movieKeywords,
            path: `/movie/${id}`,
            image: movie.Poster !== "N/A" ? movie.Poster : seoConfig.ogImages.default,
            type: "article",
            lang: "tr",
        });
    } catch (error) {
        console.error("Error generating metadata:", error);

        return generateSEOMetadata({
            title: "Film Detayları - Hata",
            description: "Film detayları yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
            keywords: ["hata", "film detayları"],
            path: `/movie/${id}`,
            lang: "tr",
        });
    }
}

export default async function MovieDetails({ params }: PageProps) {
    try {
        const { id } = await params;
        
        // Validate ID format (IMDb ID should start with 'tt')
        if (!id || (!id.startsWith('tt') && !id.match(/^[0-9a-zA-Z]+$/))) {
            console.error("Invalid movie ID format:", id);
            return <MovieDetailsContent movie={null} />;
        }

        const movie = await fetchMovieDetails(id);

        // Check if movie data is valid
        if (!movie || !movie.imdbID) {
            console.error("Invalid movie data received");
            return <MovieDetailsContent movie={null} />;
        }

        return <MovieDetailsContent movie={movie} />;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        
        // Log more details for debugging
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        
        return <MovieDetailsContent movie={null} />;
    }
}
