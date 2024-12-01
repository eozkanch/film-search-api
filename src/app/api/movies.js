export async function fetchMovies({ query, type, year, page }) {
    const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const url = new URL(API_URL);
    url.searchParams.append("apikey", API_KEY);

    if (query) url.searchParams.append("s", query); // Sorgu metni
    if (type) url.searchParams.append("type", type); // Tür
    if (year) url.searchParams.append("y", year); // Yıl
    if (page) url.searchParams.append("page", page); // Sayfa numarası

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.Response === "True") {
        return data;
    } else {
        throw new Error(data.Error || "API request failed");
    }
}