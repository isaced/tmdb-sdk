import type { TMDBTransport } from '../http'
import { buildImageUrl } from '../query'
import type { ImageSize } from '../types'

/** Function that transforms a TMDB image URL (e.g. for CDN proxying). */
export type ImageUrlTransform = (url: string) => string

/**
 * Helper for constructing TMDB image URLs from API path values.
 *
 * Obtained via `client.images`. Supports optional URL transforms for
 * routing image requests through a CDN or proxy.
 */
export class ImagesHelper {
  readonly #transport: TMDBTransport
  readonly #transform: ImageUrlTransform | undefined

  constructor(transport: TMDBTransport, transform?: ImageUrlTransform) {
    this.#transport = transport
    this.#transform = transform
  }

  url(
    path: string | null | undefined,
    size: ImageSize = 'original',
    options: { transform?: ImageUrlTransform } = {},
  ): string | null {
    return buildImageUrl(path, size, {
      baseUrl: this.#transport.defaults.imageBaseUrl,
      transform: options.transform ?? this.#transform,
    })
  }
}
