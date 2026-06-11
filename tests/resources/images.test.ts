import { describe, expect, it } from 'vitest'
import { createTMDB } from '../../src'
import { createFetchMock } from '../_support/fetch'

describe('ImagesHelper', () => {
  it('uses the client image base URL override', () => {
    const tmdb = createTMDB({
      accessToken: 'read-token',
      fetch: createFetchMock().fetch,
      imageBaseUrl: 'https://images.example/t/p/',
    })

    expect(tmdb.images.url('/poster.jpg', 'w500')).toBe('https://images.example/t/p/w500/poster.jpg')
    expect(tmdb.images.url(null, 'w500')).toBeNull()
  })
})
