import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility"; // MUI Göz İkonu

export default function MovieCard({ movie }) {
    const [posterUrl, setPosterUrl] = useState("/NoImage.webp");

    // Poster URL'ini doğrulayan fonksiyon
    async function validatePosterUrl(posterUrl) {
        if (!posterUrl) {
            console.warn("Poster URL geçersiz:", posterUrl);
            return "/NoImage.webp";
        }
    
        try {
            const response = await fetch(posterUrl, { method: "HEAD" });
    
            if (response.ok && response.headers.get("content-type")?.startsWith("image/")) {
                return posterUrl;
            } else {
                console.warn("Poster URL geçerli değil:", posterUrl);
            }
        } catch (error) {
            console.error("Poster URL kontrolü sırasında hata oluştu:", error.message);
        }
    
        return "/NoImage.webp"; // Varsayılan görsel
    }

    useEffect(() => {
        // Poster URL kontrolü
        validatePosterUrl(movie.Poster).then(setPosterUrl);
    }, [movie.Poster]);

    return (
        <div
            className="max-w-xs rounded-lg overflow-hidden bg-gray-900 text-white shadow-lg hover:shadow-2xl transition-shadow duration-300 relative group hover:scale-105"
            style={{
                height: "400px", // Kart yüksekliği
            }}
        >
            {/* Poster Arka Plan */}
            <div className="relative w-full h-full">
                <Image
                    src={posterUrl}
                    alt={movie.Title || "No Image Available"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
            </div>

            {/* Bilgiler */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end">
                {/* Başlık */}
                <h3 className="text-lg font-semibold mb-1 truncate">{movie.Title || "Unknown Title"}</h3>

                {/* Yıl ve Tür */}
                <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span>{movie.Year || "N/A"}</span>
                    <span className="capitalize">{movie.Type || "Unknown Type"}</span>
                </div>
            </div>

            {/* Göz İkonu (Hover Durumunda Görünür) */}
            <Link
                href={`/movie/${movie.imdbID}`}
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                <VisibilityIcon sx={{ fontSize: 24 }} />
            </Link>
        </div>
    );
}