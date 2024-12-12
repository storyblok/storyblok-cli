import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { vol } from 'memfs'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { fetchComponents, saveComponentsToFiles } from './actions'

const handlers = [
  http.get('https://api.storyblok.com/v1/spaces/12345/components', async ({ request }) => {
    const token = request.headers.get('Authorization')
    if (token === 'valid-token') {
      return HttpResponse.json({
        components: [{
          name: 'component-name',
          display_name: 'Component Name',
          created_at: '2021-08-09T12:00:00Z',
          updated_at: '2021-08-09T12:00:00Z',
          id: 12345,
          schema: { type: 'object' },
          color: null,
          internal_tags_list: ['tag'],
          interntal_tags_ids: [1],
        }, {
          name: 'component-name-2',
          display_name: 'Component Name 2',
          created_at: '2021-08-09T12:00:00Z',
          updated_at: '2021-08-09T12:00:00Z',
          id: 12346,
          schema: { type: 'object' },
          color: null,
          internal_tags_list: ['tag'],
          interntal_tags_ids: [1],
        }],
      })
    }
    return new HttpResponse('Unauthorized', { status: 401 })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => server.resetHandlers())
afterAll(() => server.close())

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe('pull components actions', () => {
  it('should pull components successfully with a valid token', async () => {
    const mockResponse = [{
      name: 'component-name',
      display_name: 'Component Name',
      created_at: '2021-08-09T12:00:00Z',
      updated_at: '2021-08-09T12:00:00Z',
      id: 12345,
      schema: { type: 'object' },
      color: null,
      internal_tags_list: ['tag'],
      interntal_tags_ids: [1],
    }, {
      name: 'component-name-2',
      display_name: 'Component Name 2',
      created_at: '2021-08-09T12:00:00Z',
      updated_at: '2021-08-09T12:00:00Z',
      id: 12346,
      schema: { type: 'object' },
      color: null,
      internal_tags_list: ['tag'],
      interntal_tags_ids: [1],
    }]

    const result = await fetchComponents('12345', 'valid-token', 'eu')
    expect(result).toEqual(mockResponse)
  })

  it('should throw an masked error for invalid token', async () => {
    await expect(fetchComponents('12345', 'invalid-token', 'eu')).rejects.toThrow(
      new Error(`The user is not authorized to access the API`),
    )
  })

  describe('saveComponentsToFiles', () => {
    it('should save components to files successfully', async () => {
      vol.fromJSON({
        '/path/to/components': null,
      })

      const components = [{
        name: 'component-name',
        display_name: 'Component Name',
        created_at: '2021-08-09T12:00:00Z',
        updated_at: '2021-08-09T12:00:00Z',
        id: 12345,
        schema: { type: 'object' },
        color: null,
        internal_tags_list: ['tag'],
        interntal_tags_ids: [1],
      }]

      await saveComponentsToFiles('12345', components, { path: '/path/to/components' })

      const files = vol.readdirSync('/path/to/components')
      expect(files).toEqual(['components.12345.json'])
    })

    it('should save components to files with custom filename', async () => {
      vol.fromJSON({
        '/path/to/components2': null,
      })

      const components = [{
        name: 'component-name',
        display_name: 'Component Name',
        created_at: '2021-08-09T12:00:00Z',
        updated_at: '2021-08-09T12:00:00Z',
        id: 12345,
        schema: { type: 'object' },
        color: null,
        internal_tags_list: ['tag'],
        interntal_tags_ids: [1],
      }]

      await saveComponentsToFiles('12345', components, { path: '/path/to/components2', filename: 'custom' })

      const files = vol.readdirSync('/path/to/components2')
      expect(files).toEqual(['custom.12345.json'])
    })

    it('should save components to files with custom suffix', async () => {
      vol.fromJSON({
        '/path/to/components3': null,
      })

      const components = [{
        name: 'component-name',
        display_name: 'Component Name',
        created_at: '2021-08-09T12:00:00Z',
        updated_at: '2021-08-09T12:00:00Z',
        id: 12345,
        schema: { type: 'object' },
        color: null,
        internal_tags_list: ['tag'],
        interntal_tags_ids: [1],
      }]

      await saveComponentsToFiles('12345', components, { path: '/path/to/components3', suffix: 'custom' })

      const files = vol.readdirSync('/path/to/components3')
      expect(files).toEqual(['components.custom.json'])
    })

    it('should save components to separate files', async () => {
      vol.fromJSON({
        '/path/to/components4': null,
      })

      const components = [{
        name: 'component-name',
        display_name: 'Component Name',
        created_at: '2021-08-09T12:00:00Z',
        updated_at: '2021-08-09T12:00:00Z',
        id: 12345,
        schema: { type: 'object' },
        color: null,
        internal_tags_list: ['tag'],
        interntal_tags_ids: [1],
      }, {
        name: 'component-name-2',
        display_name: 'Component Name 2',
        created_at: '2021-08-09T12:00:00Z',
        updated_at: '2021-08-09T12:00:00Z',
        id: 12346,
        schema: { type: 'object' },
        color: null,
        internal_tags_list: ['tag'],
        interntal_tags_ids: [1],
      }]

      await saveComponentsToFiles('12345', components, { path: '/path/to/components4', separateFiles: true })

      const files = vol.readdirSync('/path/to/components4')
      expect(files).toEqual(['component-name-2.12345.json', 'component-name.12345.json'])
    })
  })
})
