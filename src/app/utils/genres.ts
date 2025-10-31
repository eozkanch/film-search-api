// Popüler film ve dizi türleri
export const GENRES = [
    { id: "action", name: "Action", icon: "🎬", color: "from-red-600 to-orange-600" },
    { id: "adventure", name: "Adventure", icon: "🗺️", color: "from-yellow-600 to-orange-600" },
    { id: "comedy", name: "Comedy", icon: "😂", color: "from-yellow-500 to-yellow-400" },
    { id: "drama", name: "Drama", icon: "🎭", color: "from-purple-600 to-pink-600" },
    { id: "horror", name: "Horror", icon: "👻", color: "from-gray-900 to-red-900" },
    { id: "thriller", name: "Thriller", icon: "🔪", color: "from-gray-800 to-red-800" },
    { id: "sci-fi", name: "Sci-Fi", icon: "🚀", color: "from-blue-600 to-purple-600" },
    { id: "romance", name: "Romance", icon: "💕", color: "from-pink-600 to-red-500" },
    { id: "fantasy", name: "Fantasy", icon: "🧙", color: "from-indigo-600 to-purple-600" },
    { id: "animation", name: "Animation", icon: "🎨", color: "from-cyan-500 to-blue-500" },
    { id: "crime", name: "Crime", icon: "🔍", color: "from-gray-700 to-black" },
    { id: "mystery", name: "Mystery", icon: "🕵️", color: "from-gray-600 to-gray-800" },
] as const;

export type GenreId = typeof GENRES[number]["id"];
export type Genre = typeof GENRES[number];

// Genre ID'den genre bilgisi al
export function getGenreById(id: string): Genre | undefined {
    return GENRES.find(g => g.id === id);
}

// Genre isminden genre bilgisi al
export function getGenreByName(name: string): Genre | undefined {
    const normalizedName = name.toLowerCase().replace(/\s+/g, "-");
    return GENRES.find(g => g.id === normalizedName || g.name.toLowerCase() === name.toLowerCase());
}

// Movie Genre string'ini normalize et (OMDb'den gelen format: "Action, Adventure, Drama")
export function normalizeGenre(genreString?: string): string[] {
    if (!genreString) return [];
    return genreString.split(",").map(g => g.trim().toLowerCase());
}

// Movie'yi genre'ye göre filtrele
export function matchesGenre(movieGenre: string | undefined, targetGenre: string): boolean {
    if (!movieGenre) return false;
    const normalized = normalizeGenre(movieGenre);
    const target = targetGenre.toLowerCase();
    return normalized.some(g => g === target || g.includes(target));
}


