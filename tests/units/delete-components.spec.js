import deleteComponents from '../../src/tasks/delete-components'
import { FAKE_COMPONENTS } from '../constants'
import fs from 'fs'
import { jest } from '@jest/globals'

jest.mock('fs')
jest.spyOn(fs, 'readFileSync')

afterEach(() => {
  jest.clearAllMocks()
})

describe('testing deleteComponents', () => {
  it('api.deleteComponents', async () => {
    const source = 'components.js'
    const components = FAKE_COMPONENTS()
    fs.readFileSync.mockReturnValue(JSON.stringify({
      components
    }))
    const api = {
      get: jest.fn((path) => {
        const id = path.split('/')[1]
        return Promise.resolve({ data: { component: components[id] } })
      }),
      getComponents: jest.fn(() => {
        return components
      }),
      delete: jest.fn(() => Promise.resolve())
    }
    return deleteComponents(api, { source, reversed: false }).then(() => {
      expect(api.delete.mock.calls.length).toBe(components.length)
    })
  })
  it('api.deleteComponents reverse', () => {
    const source = 'components.js'
    const components = FAKE_COMPONENTS()
    const copy = [...components]
    copy.splice(2, 1)
    fs.readFileSync.mockReturnValue(JSON.stringify([...copy]))

    const api = {
      get: jest.fn((path) => {
        const id = path.split('/')[1]
        return Promise.resolve({ data: { component: components[id] } })
      }),
      getComponents: jest.fn(() => {
        return components
      }),
      delete: jest.fn(() => Promise.resolve())
    }
    return deleteComponents(api, { source, reversed: true }).then(() => {
      expect(api.delete.mock.calls.length).toBe(1)
    })
  })
  it('api.deleteComponents --dryrun', () => {
    const source = 'components.js'
    const components = FAKE_COMPONENTS()
    fs.readFileSync.mockReturnValue(JSON.stringify({
      components
    }))
    const api = {
      get: jest.fn((path) => {
        const id = path.split('/')[1]
        return Promise.resolve({ data: { component: components[id] } })
      }),
      delete: jest.fn(() => Promise.resolve())
    }
    return deleteComponents(api, { source, reversed: false, dryRun: true }).then(() => {
      expect(api.delete.mock.calls.length).toBe(0)
    })
  })
  it('api.deleteComponents reverse --dryrun', () => {
    const source = 'components.js'
    const components = FAKE_COMPONENTS()
    fs.readFileSync.mockReturnValue(JSON.stringify({
      components
    }))
    const api = {
      get: jest.fn((path) => {
        const id = path.split('/')[1]
        return Promise.resolve({ data: { component: components[id] } })
      }),
      getComponents: jest.fn(() => {
        const copy = [...components]
        copy.splice(3, 1)
        return copy
      }),
      delete: jest.fn(() => Promise.resolve())
    }
    return deleteComponents(api, { source, reversed: true, dryRun: true }).then(() => {
      expect(api.delete.mock.calls.length).toBe(0)
    })
  })
})
