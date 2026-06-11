import { describe, expect, it } from 'vitest'
import { createTMDB, TMDBClient } from '../../src'
import { expectRequest } from '../_support/assertions'
import { createFetchMock } from '../_support/fetch'

describe('TMDBClient facade', () => {
  it('creates the full resource surface from the factory', () => {
    const tmdb = createTMDB({
      accessToken: 'read-token',
      fetch: createFetchMock().fetch,
    })

    expect(tmdb).toBeInstanceOf(TMDBClient)
    expect(tmdb.configuration).toBeDefined()
    expect(tmdb.genres).toBeDefined()
    expect(tmdb.images).toBeDefined()
    expect(tmdb.movies).toBeDefined()
    expect(tmdb.people).toBeDefined()
    expect(tmdb.search).toBeDefined()
    expect(tmdb.trending).toBeDefined()
    expect(tmdb.tv).toBeDefined()
  })

  it('keeps a typed request escape hatch for endpoints that are not wrapped yet', async () => {
    const mock = createFetchMock({ body: { results: [] } })
    const tmdb = createTMDB({
      accessToken: 'read-token',
      baseUrl: 'https://proxy.example/tmdb/3',
      defaultLanguage: 'en-US',
      fetch: mock.fetch,
    })

    const response = await tmdb.request<{ results: unknown[] }>('/discover/movie', {
      query: {
        language: 'fr-FR',
        sort_by: 'popularity.desc',
      },
    })

    expect(response.results).toEqual([])
    expectRequest(mock.lastCall(), {
      path: '/tmdb/3/discover/movie',
      query: {
        language: 'fr-FR',
        sort_by: 'popularity.desc',
      },
    })
  })

  it('uses the configured image base URL through the images helper', () => {
    const tmdb = createTMDB({
      accessToken: 'read-token',
      fetch: createFetchMock().fetch,
      imageBaseUrl: 'https://images.example/t/p/',
    })

    expect(tmdb.images.url('/profile.png', 'h632')).toBe('https://images.example/t/p/h632/profile.png')
  })
})
