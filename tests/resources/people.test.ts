import { describe, expect, it } from 'vitest'
import { createTMDB } from '../../src'
import { expectPaths, expectRequest } from '../_support/assertions'
import { paged, personDetails } from '../_support/fixtures'
import { createFetchMock } from '../_support/fetch'

describe('PeopleResource', () => {
  it('maps popular people and person details endpoints', async () => {
    const mock = createFetchMock({ body: paged() }, { body: personDetails })
    const tmdb = createTMDB({
      accessToken: 'read-token',
      defaultLanguage: 'zh-CN',
      fetch: mock.fetch,
    })

    await tmdb.people.popular({ page: 5 })
    await tmdb.people.details(31, { language: 'ja-JP' })

    expectPaths(mock.calls, ['/3/person/popular', '/3/person/31'])
    expectRequest(mock.calls[0]!, {
      path: '/3/person/popular',
      query: {
        language: 'zh-CN',
        page: '5',
      },
    })
    expectRequest(mock.calls[1]!, {
      path: '/3/person/31',
      query: {
        language: 'ja-JP',
      },
    })
  })

  it('rejects invalid person ids before a request is made', () => {
    const mock = createFetchMock()
    const tmdb = createTMDB({ accessToken: 'read-token', fetch: mock.fetch })

    expect(() => tmdb.people.details(-1)).toThrow('personId must be a positive integer')
    expect(mock.calls).toHaveLength(0)
  })
})
