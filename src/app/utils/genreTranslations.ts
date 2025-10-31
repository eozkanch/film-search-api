import { GenreId } from "./genres";

// Genre ID'den translation key'e çevir
export function getGenreTranslationKey(genreId: GenreId): "genre.action" | "genre.adventure" | "genre.comedy" | "genre.drama" | "genre.horror" | "genre.thriller" | "genre.sciFi" | "genre.romance" | "genre.fantasy" | "genre.animation" | "genre.crime" | "genre.mystery" {
    const mapping: Record<GenreId, "genre.action" | "genre.adventure" | "genre.comedy" | "genre.drama" | "genre.horror" | "genre.thriller" | "genre.sciFi" | "genre.romance" | "genre.fantasy" | "genre.animation" | "genre.crime" | "genre.mystery"> = {
        "action": "genre.action",
        "adventure": "genre.adventure",
        "comedy": "genre.comedy",
        "drama": "genre.drama",
        "horror": "genre.horror",
        "thriller": "genre.thriller",
        "sci-fi": "genre.sciFi",
        "romance": "genre.romance",
        "fantasy": "genre.fantasy",
        "animation": "genre.animation",
        "crime": "genre.crime",
        "mystery": "genre.mystery",
    };
    return mapping[genreId];
}

