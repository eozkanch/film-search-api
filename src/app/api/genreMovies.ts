import { Movie } from "../types";
import { fetchMovies } from "./movies";
import { fetchMovieDetails } from "./fetchMovieDetails";
import { matchesGenre, getGenreById } from "../utils/genres";

interface GenreMoviesParams {
    genre: string;
    type?: "movie" | "series";
    limit?: number;
    page?: number;
}

// Genre'ye göre film/dizi getir
export async function fetchMoviesByGenre({ 
    genre, 
    type, 
    limit = 20,
    page = 1 
}: GenreMoviesParams): Promise<{ movies: Movie[]; hasMore: boolean }> {
    const genreInfo = getGenreById(genre);
    if (!genreInfo) {
        return { movies: [], hasMore: false };
    }

    // Popüler anahtar kelimelerle arama yap
    const searchQueries = getGenreSearchQueries(genreInfo.id);
    
    const allMovies: Movie[] = [];
    const seenIds = new Set<string>();
    
    // Her arama sorgusu için filmleri getir (maksimum 3 sorgu ile sınırla)
    const queriesToUse = searchQueries.slice(0, 3);
    
    for (const query of queriesToUse) {
        try {
            // Birden fazla sayfa için arama yap (her sorgu için 2 sayfa)
            for (let p = 1; p <= 2 && allMovies.length < limit; p++) {
                const response = await fetchMovies({
                    query,
                    type,
                    page: p,
                });
                
                if (response.Search && response.Search.length > 0) {
                    // İlk 10 filmin detaylarını çek (performans için)
                    const moviesToCheck = response.Search.slice(0, 10);
                    
                    for (const movie of moviesToCheck) {
                        if (seenIds.has(movie.imdbID) || allMovies.length >= limit) continue;
                        
                        try {
                            // Rate limiting için kısa bir bekleme
                            await new Promise(resolve => setTimeout(resolve, 200));
                            
                            const details = await fetchMovieDetails(movie.imdbID);
                            
                            // Genre eşleşmesi kontrolü
                            if (details.Genre && matchesGenre(details.Genre, genreInfo.id)) {
                                allMovies.push(details);
                                seenIds.add(movie.imdbID);
                            }
                        } catch (error) {
                            // Detay çekme hatasını görmezden gel, devam et
                            continue;
                        }
                    }
                } else {
                    break; // Bu sayfada sonuç yok, bir sonraki sorguya geç
                }
                
                // Limit'e ulaştıysak dur
                if (allMovies.length >= limit) break;
            }
        } catch (error) {
            // Arama hatasını görmezden gel, bir sonraki sorguya geç
            continue;
        }
        
        // Limit'e ulaştıysak dur
        if (allMovies.length >= limit) break;
    }
    
    return { 
        movies: allMovies.slice(0, limit), 
        hasMore: allMovies.length >= limit 
    };
}

// Genre'ye göre arama sorguları oluştur
function getGenreSearchQueries(genre: string): string[] {
    const genreMap: Record<string, string[]> = {
        "action": ["action", "fight", "war", "battle", "martial arts"],
        "adventure": ["adventure", "journey", "quest", "expedition"],
        "comedy": ["comedy", "funny", "humor", "comedic"],
        "drama": ["drama", "emotional", "dramatic"],
        "horror": ["horror", "scary", "ghost", "zombie", "haunted"],
        "thriller": ["thriller", "suspense", "chase", "tense"],
        "sci-fi": ["sci-fi", "science fiction", "space", "future", "alien"],
        "romance": ["romance", "love", "dating", "romantic"],
        "fantasy": ["fantasy", "magic", "dragon", "wizard", "fantasy"],
        "animation": ["animation", "animated", "cartoon", "anime"],
        "crime": ["crime", "gangster", "mafia", "robbery", "criminal"],
        "mystery": ["mystery", "detective", "murder", "investigation", "who done it"],
    };
    
    return genreMap[genre.toLowerCase()] || [genre];
}

