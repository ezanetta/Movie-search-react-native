import { Movie, MovieSummary } from '@/domain/movie';

const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY ?? '';
const BASE_URL = 'https://www.omdbapi.com';

interface SearchResponse {
  Search?: Array<{
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Type: string;
  }>;
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

interface DetailResponse extends Movie {
  Response: 'True' | 'False';
  Error?: string;
}

export async function searchMovies(query: string): Promise<MovieSummary[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `${BASE_URL}/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`
  );
  const data: SearchResponse = await response.json();

  if (data.Response === 'False' || !data.Search) return [];

  return data.Search.map(item => ({
    imdbID: item.imdbID,
    Title: item.Title,
    Year: item.Year,
    Poster: item.Poster,
    Type: item.Type,
  }));
}

export async function getMovieDetails(imdbID: string): Promise<Movie> {
  const response = await fetch(
    `${BASE_URL}/?i=${encodeURIComponent(imdbID)}&apikey=${API_KEY}&plot=full`
  );
  const data: DetailResponse = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error ?? 'Movie not found');
  }

  return data;
}
