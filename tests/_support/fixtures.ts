import type {
  Configuration,
  CreditsResponse,
  GenresResponse,
  ImagesResponse,
  PagedResponse,
  VideosResponse,
} from '../../src'

export function paged<T>(results: T[] = []): PagedResponse<T> {
  return {
    page: 1,
    results,
    total_pages: 1,
    total_results: results.length,
  }
}

export const movieDetails = {
  id: 550,
  title: 'Fight Club',
}

export const tvDetails = {
  id: 1399,
  name: 'Game of Thrones',
}

export const personDetails = {
  id: 31,
  name: 'Tom Hanks',
}

export const creditsResponse: CreditsResponse = {
  cast: [],
  crew: [],
  id: 550,
}

export const videosResponse: VideosResponse = {
  id: 550,
  results: [],
}

export const imagesResponse: ImagesResponse = {
  backdrops: [],
  id: 550,
  posters: [],
}

export const genresResponse: GenresResponse = {
  genres: [],
}

export const configurationResponse: Configuration = {
  change_keys: [],
  images: {
    backdrop_sizes: [],
    base_url: 'http://image.tmdb.org/t/p/',
    logo_sizes: [],
    poster_sizes: [],
    profile_sizes: [],
    secure_base_url: 'https://image.tmdb.org/t/p/',
    still_sizes: [],
  },
}
