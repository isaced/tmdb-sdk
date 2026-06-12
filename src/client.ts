import { TMDBHttpClient, type TMDBClientOptions, type TMDBRequestOptions, type TMDBTransport } from './http'
import { ConfigurationResource } from './resources/configuration'
import { GenresResource } from './resources/genres'
import { ImagesHelper } from './resources/images'
import { MoviesResource } from './resources/movies'
import { PeopleResource } from './resources/people'
import { SearchResource } from './resources/search'
import { TrendingResource } from './resources/trending'
import { TVResource } from './resources/tv'

/**
 * Options accepted by {@link createTMDB} and the {@link TMDBClient} constructor.
 *
 * Extends {@link TMDBClientOptions} with an optional {@link TMDBTransport} so
 * callers can plug in a custom transport (typically for tests, caching, or
 * instrumentation) without having to mock `fetch` or the factory itself.
 */
export type TMDBFactoryOptions = TMDBClientOptions & {
  transport?: TMDBTransport
}

/**
 * Main SDK entry point.
 *
 * Resource properties are intentionally small and explicit. The SDK focuses on
 * common TMDB workflows first, while request<T>() keeps uncommon endpoints easy
 * to call without waiting for a generated surface area.
 */
export class TMDBClient {
  readonly configuration: ConfigurationResource
  readonly genres: GenresResource
  readonly images: ImagesHelper
  readonly movies: MoviesResource
  readonly people: PeopleResource
  readonly search: SearchResource
  readonly trending: TrendingResource
  readonly tv: TVResource

  readonly #transport: TMDBTransport

  constructor(options: TMDBFactoryOptions) {
    const { transport, images, ...httpOptions } = options
    // When the caller supplies a custom transport we still want to honor the
    // global images.transform option; otherwise read it back from the HTTP
    // client after it has been constructed.
    const fallbackTransform = images?.transform
    const builtInClient = transport === undefined ? new TMDBHttpClient({ ...httpOptions, images }) : undefined
    this.#transport = builtInClient ?? (transport as TMDBTransport)

    this.configuration = new ConfigurationResource(this.#transport)
    this.genres = new GenresResource(this.#transport)
    this.images = new ImagesHelper(
      this.#transport,
      builtInClient ? builtInClient.imageTransform : fallbackTransform,
    )
    this.movies = new MoviesResource(this.#transport)
    this.people = new PeopleResource(this.#transport)
    this.search = new SearchResource(this.#transport)
    this.trending = new TrendingResource(this.#transport)
    this.tv = new TVResource(this.#transport)
  }

  request<T>(path: string, options?: TMDBRequestOptions): Promise<T> {
    return this.#transport.get<T>(path, options)
  }
}

export function createTMDB(options: TMDBFactoryOptions): TMDBClient {
  return new TMDBClient(options)
}
