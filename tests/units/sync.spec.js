import sync from '../../src/tasks/sync'
import Storyblok from 'storyblok-js-client'
import { getRegionApiEndpoint } from '../../src/utils/region'
import { EU_CODE } from '@storyblok/region-helper'

import { jest } from '@jest/globals'

jest.unmock('axios')

// prevent timeout execution error
jest.setTimeout(30000)

const getData = async (client, space, entity) => {
  const path = `spaces/${space}/${entity}`
  const response = await client.get(path)

  return Promise.resolve(response.data[entity] || [])
}

describe('testing sync function', () => {
  it('sync("syncStories", options) should sync stories between two spaces', async () => {
    if (
      process.env.STORYBLOK_TOKEN &&
      process.env.STORYBLOK_SPACE &&
      process.env.STORYBLOK_ANOTHER_SPACE
    ) {
      try {
        const _types = ['stories']

        await sync(_types, {
          token: process.env.STORYBLOK_TOKEN,
          source: process.env.STORYBLOK_SPACE,
          target: process.env.STORYBLOK_ANOTHER_SPACE
        })

        const client = new Storyblok({
          oauthToken: process.env.STORYBLOK_TOKEN
        }, getRegionApiEndpoint(EU_CODE))

        const sourceStories = await getData(
          client,
          process.env.STORYBLOK_SPACE,
          'stories'
        )

        const targetStories = await getData(
          client,
          process.env.STORYBLOK_ANOTHER_SPACE,
          'stories'
        )

        const existingSourceStories = []

        targetStories.forEach(story => {
          const exists = sourceStories.filter(_story => {
            return _story.name === story.name
          })

          if (exists.length) {
            existingSourceStories.push(story.name)
          }
        })

        expect(existingSourceStories.length).toBe(sourceStories.length)
      } catch (e) {
        console.error(e)
      }
    }
  })
  
  describe('UUID update handling in folders sync', () => {
    const SOURCE_SPACE = 'SRC'
    const TARGET_SPACE = 'TGT'

    const makeApiWithClient = (client) => ({ getClient: () => client })

    const makeBaseClient = ({ putThrows }) => ({
      getAll: (path, params) => {
        if (path === `spaces/${SOURCE_SPACE}/stories` && params && params.folder_only === 1) {
          return Promise.resolve([
            { id: 1, full_slug: 'brand', parent_id: 0, name: 'brand' }
          ])
        }
        return Promise.reject(new Error('Unexpected getAll call'))
      },
      get: (path, params) => {
        if (path === `spaces/${SOURCE_SPACE}/stories/1`) {
          return Promise.resolve({ data: { story: { id: 1, uuid: 'SRC-UUID', full_slug: 'brand', name: 'brand' } } })
        }
        if (path === `spaces/${TARGET_SPACE}/stories` && params && params.with_slug === 'brand') {
          return Promise.resolve({ data: { stories: [] } })
        }
      },
      post: (path, _payload) => {
        if (path === `spaces/${TARGET_SPACE}/stories`) {
          return Promise.resolve({ data: { story: { id: 99, uuid: 'TARGET-UUID', full_slug: 'brand' } } })
        }
      },
      put: (path, _payload) => {
        if (path === `spaces/${TARGET_SPACE}/stories/99/update_uuid`) {
          if (putThrows) return Promise.reject(putThrows)
          return Promise.resolve({})
        }
      }
    })

    let errorSpy
    let originalError

    beforeEach(() => {
      originalError = console.error
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      errorSpy.mockRestore()
      console.error = originalError
      jest.clearAllMocks()
    })

    it('silences UUID has already been taken (422) for update_uuid', async () => {
      const uuidTakenError = { message: 'Unprocessable Content', status: 422, response: ['UUID has already been taken'] }
      const client = makeBaseClient({ putThrows: uuidTakenError })
      const api = makeApiWithClient(client)

      await sync(['folders'], { api, token: 'x', source: SOURCE_SPACE, target: TARGET_SPACE })

      expect(errorSpy).not.toHaveBeenCalled()
    })

    it('rethrows non-UUID 422 errors to be handled upstream (logs by outer catch)', async () => {
      const other422 = { message: 'Unprocessable Content', status: 422, response: ['Some other error'] }
      const client = makeBaseClient({ putThrows: other422 })
      const api = makeApiWithClient(client)

      await sync(['folders'], { api, token: 'x', source: SOURCE_SPACE, target: TARGET_SPACE })

      expect(errorSpy).toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Folder brand Sync failed: Unprocessable Content'))
    })
  })
})
