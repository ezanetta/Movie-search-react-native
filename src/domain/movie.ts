export interface MovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

// Richer type stored in favourites — populated from the detail endpoint.
// Fields beyond MovieSummary are optional so cards added from the grid
// can omit them gracefully.
export interface FavMovie extends MovieSummary {
  Runtime?: string;
  Rated?: string;
  Genre?: string;
  imdbRating?: string;
}

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  BoxOffice?: string;
}
