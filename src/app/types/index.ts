export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Genre?: string;
  Runtime?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Language?: string;
  Rated?: string;
  Released?: string;
  Country?: string;
  Awards?: string;
}

export interface MovieSearchParams {
  query?: string;
  type?: string;
  year?: string;
  page?: number;
}

export interface MovieSearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface InfoItem {
  id: number;
  quote: string;
  name: string;
  icon: string;
}