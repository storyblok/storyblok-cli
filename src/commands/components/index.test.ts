import { session } from '../../session'
import { CommandError, konsola } from '../../utils'
import { fetchComponents, saveComponentsToFiles } from './actions'
import { componentsCommand } from '.'
import chalk from 'chalk'
import { colorPalette } from '../../constants'
import { group } from 'node:console'

vi.mock('./actions', () => ({
  fetchComponents: vi.fn(),
  fetchComponentGroups: vi.fn(),
  fetchComponentPresets: vi.fn(),
  saveComponentsToFiles: vi.fn(),
}))

vi.mock('../../creds', () => ({
  getCredentials: vi.fn(),
  addCredentials: vi.fn(),
  removeCredentials: vi.fn(),
  removeAllCredentials: vi.fn(),
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

describe('pull', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
    // Reset the option values
    componentsCommand._optionValues = {}
    for (const command of componentsCommand.commands) {
      command._optionValues = {}
    }
  })

  describe('default mode', () => {
    it('should prompt the user if the operation was sucessfull', async () => {
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

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(fetchComponents).mockResolvedValue(mockResponse)
      await componentsCommand.parseAsync(['node', 'test', 'pull', '--space', '12345'])
      expect(fetchComponents).toHaveBeenCalledWith('12345', 'valid-token', 'eu')
      expect(saveComponentsToFiles).toHaveBeenCalledWith('12345', {
        components: mockResponse,
        groups: [],
        presets: [],
      }, {
        path: undefined,
      })
      expect(konsola.ok).toHaveBeenCalledWith(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(`.storyblok/components/12345/components.json`)}`)
    })

    it('should throw an error if the user is not logged in', async () => {
      session().state = {
        isLoggedIn: false,
      }
      const mockError = new CommandError(`You are currently not logged in. Please login first to get your user info.`)
      await componentsCommand.parseAsync(['node', 'test', 'pull', '--space', '12345'])
      expect(konsola.error).toHaveBeenCalledWith(mockError, false)
    })

    it('should throw an error if the space is not provided', async () => {
      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      const mockError = new CommandError(`Please provide the space as argument --space YOUR_SPACE_ID.`)

      await componentsCommand.parseAsync(['node', 'test', 'pull'])
      expect(konsola.error).toHaveBeenCalledWith(mockError, false)
    })
  })

  describe('--path option', () => {
    it('should save the file at the provided path', async () => {
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
      }]

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(fetchComponents).mockResolvedValue(mockResponse)

      await componentsCommand.parseAsync(['node', 'test', 'pull', '--space', '12345', '--path', '/path/to/components'])
      expect(fetchComponents).toHaveBeenCalledWith('12345', 'valid-token', 'eu')
      expect(saveComponentsToFiles).toHaveBeenCalledWith('12345', {
        components: mockResponse,
        groups: [],
        presets: [],
      }, { path: '/path/to/components' })
      expect(konsola.ok).toHaveBeenCalledWith(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(`/path/to/components/components.json`)}`)
    })
  })

  describe('--filename option', () => {
    it('should save the file with the custom filename', async () => {
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
      }]

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(fetchComponents).mockResolvedValue(mockResponse)

      await componentsCommand.parseAsync(['node', 'test', 'pull', '--space', '12345', '--filename', 'custom'])
      expect(fetchComponents).toHaveBeenCalledWith('12345', 'valid-token', 'eu')
      expect(saveComponentsToFiles).toHaveBeenCalledWith('12345', {
        components: mockResponse,
        groups: [],
        presets: [],
      }, { filename: 'custom' })
      expect(konsola.ok).toHaveBeenCalledWith(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(`.storyblok/components/12345/custom.json`)}`)
    })
  })

  describe('--separate-files option', () => {
    it('should save each component in a separate file', async () => {
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

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(fetchComponents).mockResolvedValue(mockResponse)

      await componentsCommand.parseAsync(['node', 'test', 'pull', '--space', '12345', '--separate-files'])
      expect(fetchComponents).toHaveBeenCalledWith('12345', 'valid-token', 'eu')
      expect(saveComponentsToFiles).toHaveBeenCalledWith('12345', {
        components: mockResponse,
        groups: [],
        presets: [],
      }, { separateFiles: true, path: undefined })
      expect(konsola.ok).toHaveBeenCalledWith(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(`.storyblok/components/12345/`)}`)
    })

    it('should warn the user if the --filename is used along', async () => {
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
      }]

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      }

      vi.mocked(fetchComponents).mockResolvedValue(mockResponse)

      await componentsCommand.parseAsync(['node', 'test', 'pull', '--space', '12345', '--separate-files', '--filename', 'custom'])
      expect(fetchComponents).toHaveBeenCalledWith('12345', 'valid-token', 'eu')
      expect(saveComponentsToFiles).toHaveBeenCalledWith('12345', {
        components: mockResponse,
        groups: [],
        presets: [],
      }, { separateFiles: true, filename: 'custom' })
      expect(konsola.warn).toHaveBeenCalledWith(`The --filename option is ignored when using --separate-files`)
    })
  })
})
