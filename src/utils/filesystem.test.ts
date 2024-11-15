import { vol } from 'memfs'
import { resolvePath, saveToFile } from './filesystem'
import { resolve } from 'node:path'

// tell vitest to use fs mock from __mocks__ folder
// this can be done in a setup file if fs should always be mocked
vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  vi.clearAllMocks()
  // reset the state of in-memory fs
  vol.reset()
})

describe('filesystem utils', async () => {
  describe('saveToFile', async () => {
    it('should save the data to the file', async () => {
      const filePath = '/path/to/file.txt'
      const data = 'Hello, World!'

      await saveToFile(filePath, data)

      const content = vol.readFileSync(filePath, 'utf8')
      expect(content).toBe(data)
    })

    it('should create the directory if it does not exist', async () => {
      const filePath = '/path/to/new/file.txt'
      const data = 'Hello, World!'

      await saveToFile(filePath, data)

      const content = vol.readFileSync(filePath, 'utf8')
      expect(content).toBe(data)
    })
  })

  describe('resolvePath', async () => {
    it('should resolve the path correctly', async () => {
      const path = '/path/to/file'
      const folder = 'folder'

      const resolvedPath = resolvePath(path, folder)
      expect(resolvedPath).toBe(resolve(process.cwd(), path))

      const resolvedPathWithoutPath = resolvePath(undefined, folder)
      expect(resolvedPathWithoutPath).toBe(resolve(process.cwd(), '.storyblok/folder'))
    })
  })
})
