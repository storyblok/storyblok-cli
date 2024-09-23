import { addNetrcEntry, getNetrcCredentials, getNetrcFilePath } from './creds'
import { vol } from 'memfs'
import { join } from 'pathe'
// tell vitest to use fs mock from __mocks__ folder
// this can be done in a setup file if fs should always be mocked
vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset()
})

describe('creds', async () => {
  describe('getNetrcFilePath', async () => {
    const originalPlatform = process.platform
    const originalEnv = { ...process.env }
    const originalCwd = process.cwd

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
    // Restore the original platform after each test
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      })
      // Restore process.cwd()
      process.cwd = originalCwd
    })

    it('should return the correct path on Unix-like systems when HOME is set', () => {
    // Mock the platform to be Unix-like
      Object.defineProperty(process, 'platform', {
        value: 'linux',
      })

      // Set the HOME environment variable
      process.env.HOME = '/home/testuser'

      const expectedPath = join('/home/testuser', '.netrc')
      const result = getNetrcFilePath()

      expect(result).toBe(expectedPath)
    })

    it('should return the correct path on Windows systems when USERPROFILE is set', () => {
      // Mock the platform to be Windows
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      })

      // Set the USERPROFILE environment variable
      process.env.USERPROFILE = 'C:/Users/TestUser'

      const expectedPath = join('C:/Users/TestUser', '.netrc')
      const result = getNetrcFilePath()

      expect(result).toBe(expectedPath)
    })

    it('should use process.cwd() when home directory is not set', () => {
      // Mock the platform to be Unix-like
      Object.defineProperty(process, 'platform', {
        value: 'linux',
      })

      // Remove HOME and USERPROFILE
      delete process.env.HOME
      delete process.env.USERPROFILE

      // Mock process.cwd()
      process.cwd = vi.fn().mockReturnValue('/current/working/directory')

      const expectedPath = join('/current/working/directory', '.netrc')
      const result = getNetrcFilePath()

      expect(result).toBe(expectedPath)
    })

    it('should use process.cwd() when HOME is empty', () => {
      // Mock the platform to be Unix-like
      Object.defineProperty(process, 'platform', {
        value: 'linux',
      })

      // Set HOME to an empty string
      process.env.HOME = ''

      // Mock process.cwd()
      process.cwd = vi.fn().mockReturnValue('/current/working/directory')

      const expectedPath = join('/current/working/directory', '.netrc')
      const result = getNetrcFilePath()

      expect(result).toBe(expectedPath)
    })

    it('should handle Windows platform when USERPROFILE is not set', () => {
      // Mock the platform to be Windows
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      })

      // Remove USERPROFILE
      delete process.env.USERPROFILE

      // Mock process.cwd()
      process.cwd = vi.fn().mockReturnValue('C:/Current/Directory')

      const expectedPath = join('C:/Current/Directory', '.netrc')
      const result = getNetrcFilePath()

      expect(result).toBe(expectedPath)
    })
  })

  describe('getNetrcCredentials', () => {
    it('should return empty object if .netrc file does not exist', async () => {
      const creds = await getNetrcCredentials()
      expect(creds).toEqual({})
    })
    it('should return the parsed content of .netrc file', async () => {
      vol.fromJSON({
        'test/.netrc': `machine api.storyblok.com
        login julio.iglesias@storyblok.com
        password my_access_token
        region eu`,
      }, '/temp')

      const credentials = await getNetrcCredentials('/temp/test/.netrc')

      expect(credentials['api.storyblok.com']).toEqual({
        login: 'julio.iglesias@storyblok.com',
        password: 'my_access_token',
        region: 'eu',
      })
    })
  })

  describe('addNetrcEntry', () => {
    it('should add a new entry to an empty .netrc file', async () => {
      vol.fromJSON({
        'test/.netrc': '',
      }, '/temp')

      await addNetrcEntry({
        filePath: '/temp/test/.netrc',
        machineName: 'api.storyblok.com',
        login: 'julio.iglesias@storyblok.com',
        password: 'my_access_token',
        region: 'eu',
      })

      const content = vol.readFileSync('/temp/test/.netrc', 'utf8')

      expect(content).toBe(`machine api.storyblok.com
    login julio.iglesias@storyblok.com
    password my_access_token
    region eu
`)
    })
  })
})
