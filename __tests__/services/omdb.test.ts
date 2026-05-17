import { getMovieDetails, searchMovies } from '@/services/omdb';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockResponse(body: unknown) {
  return { json: async () => body };
}

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── searchMovies ────────────────────────────────────────────────────────────

describe('searchMovies', () => {
  it('returns empty array without calling fetch when query is blank', async () => {
    expect(await searchMovies('')).toEqual([]);
    expect(await searchMovies('   ')).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns empty array when API responds with Response=False', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({ Response: 'False', Error: 'Movie not found!' })
    );
    const result = await searchMovies('xyznotfound');
    expect(result).toEqual([]);
  });

  it('maps API Search array to MovieSummary[]', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({
        Response: 'True',
        totalResults: '2',
        Search: [
          { imdbID: 'tt1', Title: 'Batman Begins', Year: '2005', Poster: 'url1', Type: 'movie' },
          { imdbID: 'tt2', Title: 'The Dark Knight', Year: '2008', Poster: 'url2', Type: 'movie' },
        ],
      })
    );
    const result = await searchMovies('batman');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      imdbID: 'tt1',
      Title: 'Batman Begins',
      Year: '2005',
      Poster: 'url1',
      Type: 'movie',
    });
    expect(result[1].imdbID).toBe('tt2');
  });

  it('URL-encodes the query string', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ Response: 'False' }));
    await searchMovies('spider man');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('spider%20man'));
  });

  it('includes the API key in the request URL', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ Response: 'False' }));
    await searchMovies('batman');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('apikey='));
  });
});

// ─── getMovieDetails ─────────────────────────────────────────────────────────

const fullMovie = {
  imdbID: 'tt0372784',
  Title: 'Batman Begins',
  Year: '2005',
  Rated: 'PG-13',
  Released: '15 Jun 2005',
  Runtime: '140 min',
  Genre: 'Action, Drama',
  Director: 'Christopher Nolan',
  Writer: 'Bob Kane',
  Actors: 'Christian Bale',
  Plot: 'After training with his mentor...',
  Language: 'English',
  Country: 'USA',
  Awards: 'Nominated for 1 Oscar',
  Poster: 'https://example.com/poster.jpg',
  imdbRating: '8.2',
  imdbVotes: '1,500,000',
  Type: 'movie',
  Response: 'True' as const,
};

describe('getMovieDetails', () => {
  it('returns full Movie object on success', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(fullMovie));
    const result = await getMovieDetails('tt0372784');
    expect(result.imdbID).toBe('tt0372784');
    expect(result.Title).toBe('Batman Begins');
    expect(result.Director).toBe('Christopher Nolan');
  });

  it('requests full plot via plot=full parameter', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(fullMovie));
    await getMovieDetails('tt0372784');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('plot=full'));
  });

  it('throws with the API error message when Response=False', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({ Response: 'False', Error: 'Incorrect IMDb ID.' })
    );
    await expect(getMovieDetails('bad-id')).rejects.toThrow('Incorrect IMDb ID.');
  });

  it('throws a fallback message when error field is missing', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse({ Response: 'False' }));
    await expect(getMovieDetails('bad-id')).rejects.toThrow('Movie not found');
  });
});
