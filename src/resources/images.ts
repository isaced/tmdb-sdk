import type { TMDBTransport } from '../http'
import { buildImageUrl } from '../query'
import type { ImageSize } from '../types'

export type ImageUrlTransform = (url: string) => string

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
