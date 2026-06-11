import { describe, expect, it } from 'vitest'
import { createTMDB } from '../../src'
import { expectPaths, expectRequest } from '../_support/assertions'
import { paged } from '../_support/fixtures'
import { createFetchMock } from '../_support/fetch'

describe('SearchResource', () => {
  it('maps movie search options to TMDB query parameters', async () => {
    const mock = createFetchMock({ body: paged() })
    const tmdb = createTMDB({
      accessToken: 'read-token',
      defaultLanguage: 'zh-CN',
      defaultRegion: 'CN',
      fetch: mock.fetch,
    })

    await tmdb.search.movies('  Dune  ', {
      includeAdult: false,
      page: 3,
      primaryReleaseYear: 2021,
      region: 'US',
      year: 2021,
    })

    expectRequest(mock.lastCall(), {
      path: '/3/search/movie',
      query: {
        include_adult: 'false',
        language: 'zh-CN',
        page: '3',
        primary_release_year: '2021',
        query: 'Dune',
        region: 'US',
        year: '2021',
      },
    })
  })

  it('maps tv, people, and multi search endpoints', async () => {
    const mock = createFetchMock(
      { body: paged() },
      { body: paged() },
      { body: paged() },
    )
    const tmdb = createTMDB({ accessToken: 'read-token', fetch: mock.fetch })

    await tmdb.search.tv('Dark', {
      firstAirDateYear: 2017,
      includeAdult: true,
      page: 2,
      year: 2017,
    })
    await tmdb.search.people('Sofia Coppola', { includeAdult: false })
    await tmdb.search.multi('Tom Hardy')

    expectPaths(mock.calls, [
      '/3/search/tv',
      '/3/search/person',
      '/3/search/multi',
    ])
    expectRequest(mock.calls[0]!, {
      path: '/3/search/tv',
      query: {
        first_air_date_year: '2017',
        include_adult: 'true',
        page: '2',
        query: 'Dark',
        year: '2017',
      },
    })
    expectRequest(mock.calls[1]!, {
      path: '/3/search/person',
      query: {
        include_adult: 'false',
        query: 'Sofia Coppola',
      },
    })
    expectRequest(mock.calls[2]!, {
      path: '/3/search/multi',
      query: {
        query: 'Tom Hardy',
      },
    })
  })

  it('rejects empty queries before a request is made', () => {
    const mock = createFetchMock()
    const tmdb = createTMDB({ accessToken: 'read-token', fetch: mock.fetch })

    expect(() => tmdb.search.movies('   ')).toThrow('search query must not be empty')
    expect(() => tmdb.search.multi('\n\t')).toThrow('search query must not be empty')
    expect(mock.calls).toHaveLength(0)
  })
})
