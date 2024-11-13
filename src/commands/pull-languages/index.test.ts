import chalk from 'chalk'
import { pullLanguagesCommand } from '.'
import { session } from '../../session'
import { CommandError, konsola } from './../../utils/'
import { pullLanguages, saveLanguagesToFile } from './actions'
import { colorPalette } from '../../constants'

vi.mock('./actions', () => ({
  pullLanguages: vi.fn(),
  saveLanguagesToFile: vi.fn(),
}))

vi.mock('../../creds', () => ({
  addNetrcEntry: vi.fn(),
  isAuthorized: vi.fn(),
  getNetrcCredentials: vi.fn(),
  getCredentialsForMachine: vi.fn(),
}))

// Mocking the session module
vi.mock('../../session', () => {
  let _cache: Record<string, any> | null = null
  const session = () => {
    if (!_cache) {
      _cache = {
        state: {
          isLoggedIn: false,
        },
        updateSession: vi.fn(),
        persistCredentials: vi.fn(),
        initializeSession: vi.fn(),
      }
    }
    return _cache
  }

  return {
    session,
  }
})

vi.mock('../../utils', async () => {
  const actualUtils = await vi.importActual('../../utils')
  return {
    ...actualUtils,
    konsola: {
      ok: vi.fn(),
      title: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
    handleError: (error: Error, header = false) => {
      konsola.error(error, header)
      // Optionally, prevent process.exit during tests
    },
  }
})

describe('pullLanguages', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
    // Reset the option values
    pullLanguagesCommand._optionValues = {}
  })

  describe('default mode', () => {
    it('should prompt the user if operation was sucessfull', async () => {
      const mockResponse = {
        default_lang_name: 'en',
        languages: [
          {
            code: 'ca',
            name: 'Catalan',
          },
          {
            code: 'fr',
            name: 'French',
          },
        ],
      }
      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(pullLanguages).mockResolvedValue(mockResponse)
      await pullLanguagesCommand.parseAsync(['node', 'test', '--space', '12345'])
      expect(pullLanguages).toHaveBeenCalledWith('12345', 'valid-token', 'eu')
      expect(saveLanguagesToFile).toHaveBeenCalledWith('12345', mockResponse, undefined)
      expect(konsola.ok).toHaveBeenCalledWith(`Languages schema downloaded successfully at ${chalk.hex(colorPalette.PRIMARY)(`.storyblok/languages/languages.12345.json`)}`)
    })

    it('should throw an error if the user is not logged in', async () => {
      session().state = {
        isLoggedIn: false,
      }
      const mockError = new CommandError(`You are currently not logged in. Please login first to get your user info.`)
      await pullLanguagesCommand.parseAsync(['node', 'test', '--space', '12345'])
      expect(konsola.error).toHaveBeenCalledWith(mockError, false)
    })

    it('should throw an error if the space is not provided', async () => {
      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      const mockError = new CommandError(`Please provide the space as argument --space YOUR_SPACE_ID.`)

      console.log(pullLanguagesCommand)
      await pullLanguagesCommand.parseAsync(['node', 'test'])
      expect(konsola.error).toHaveBeenCalledWith(mockError, false)
    })

    it('should prompt a warning the user if no languages are found', async () => {
      const mockResponse = {
        default_lang_name: 'en',
        languages: [],
      }
      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(pullLanguages).mockResolvedValue(mockResponse)

      await pullLanguagesCommand.parseAsync(['node', 'test', '--space', '24568'])
      expect(konsola.warn).toHaveBeenCalledWith(`No languages found in the space 24568`)
    })
  })

  describe('--path option', () => {
    it('should save the file at the provided path', async () => {
      const mockResponse = {
        default_lang_name: 'en',
        languages: [
          {
            code: 'ca',
            name: 'Catalan',
          },
          {
            code: 'fr',
            name: 'French',
          },
        ],
      }
      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(pullLanguages).mockResolvedValue(mockResponse)
      await pullLanguagesCommand.parseAsync(['node', 'test', '--space', '12345', '--path', '/tmp'])
      expect(pullLanguages).toHaveBeenCalledWith('12345', 'valid-token', 'eu')
      expect(saveLanguagesToFile).toHaveBeenCalledWith('12345', mockResponse, '/tmp')
      expect(konsola.ok).toHaveBeenCalledWith(`Languages schema downloaded successfully at ${chalk.hex(colorPalette.PRIMARY)(`/tmp/languages.12345.json`)}`)
    })
  })
})
