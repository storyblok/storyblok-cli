import { describe, expect, it, vi } from 'vitest'
import { loginWithToken } from './actions'
import { loginCommand } from './'
import { addNetrcEntry } from '../../creds'
import { handleError, konsola } from '../../utils'
import { input, password, select } from '@inquirer/prompts'
import { regions } from 'src/constants'
import chalk from 'chalk'

vi.mock('./actions', () => ({
  loginWithEmailAndPassword: vi.fn(),
  loginWithOtp: vi.fn(),
  loginWithToken: vi.fn(),
}))

vi.mock('../../creds', () => ({
  addNetrcEntry: vi.fn(),
}))

vi.mock('../../utils', async () => {
  const actualUtils = await vi.importActual('../../utils')
  return {
    ...actualUtils,
    konsola: {
      ok: vi.fn(),
      error: vi.fn(),
    },
    handleError: (error: Error, header = false) => {
      konsola.error(error, header)
      // Optionally, prevent process.exit during tests
    },
  }
})

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  password: vi.fn(),
  select: vi.fn(),
}))

describe('loginCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('if --token is provided', () => {
    it('should login with a valid token', async () => {
      const mockToken = 'test-token'
      const mockUser = { email: 'test@example.com' }
      loginWithToken.mockResolvedValue({ user: mockUser })

      await loginCommand.parseAsync(['node', 'test', '--token', mockToken])

      expect(loginWithToken).toHaveBeenCalledWith(mockToken, 'eu')
      expect(addNetrcEntry).toHaveBeenCalledWith({
        machineName: 'api.storyblok.com',
        login: mockUser.email,
        password: mockToken,
        region: 'eu',
      })
      expect(konsola.ok).toHaveBeenCalledWith('Successfully logged in with token')
    })

    it('should login with a valid token in another region --region', async () => {
      const mockToken = 'test-token'
      const mockUser = { email: 'test@example.com' }
      loginWithToken.mockResolvedValue({ user: mockUser })

      await loginCommand.parseAsync(['node', 'test', '--token', mockToken, '--region', 'us'])

      expect(loginWithToken).toHaveBeenCalledWith(mockToken, 'us')
      expect(addNetrcEntry).toHaveBeenCalledWith({
        machineName: 'api-us.storyblok.com',
        login: mockUser.email,
        password: mockToken,
        region: 'us',
      })
      expect(konsola.ok).toHaveBeenCalledWith('Successfully logged in with token')
    })

    it('should throw an error for an invalid token', async () => {
      const mockError = new Error(`The token provided ${chalk.bold('inva*********')} is invalid: ${chalk.bold('401 Unauthorized')}

      Please make sure you are using the correct token and try again.`)

      loginWithToken.mockRejectedValue(mockError)

      await loginCommand.parseAsync(['node', 'test', '--token', 'invalid-token'])

      // expect(handleError).toHaveBeenCalledWith(mockError, true)
      expect(konsola.error).toHaveBeenCalledWith(expect.any(Error), true)
    })
  })

/*   it('should login with token when token is provided', async () => {
    const mockToken = 'test-token'
    const mockUser = { email: 'test@example.com' }
    loginWithToken.mockResolvedValue({ user: mockUser })

    await loginCommand.parseAsync(['node', 'test', '--token', mockToken])

    expect(loginWithToken).toHaveBeenCalledWith(mockToken, 'eu')
    expect(addNetrcEntry).toHaveBeenCalledWith({
      machineName: 'api.storyblok.com',
      login: mockUser.email,
      password: mockToken,
      region: 'eu',
    })
    expect(konsola.ok).toHaveBeenCalledWith('Successfully logged in with token')
  })

  it('should prompt for login strategy when no token is provided', async () => {
    select.mockResolvedValueOnce('login-with-token')
    password.mockResolvedValueOnce('test-token')
    const mockUser = { email: 'test@example.com' }
    loginWithToken.mockResolvedValue({ user: mockUser })

    await loginCommand.parseAsync(['node', 'test'])

    expect(select).toHaveBeenCalledWith(expect.objectContaining({
      message: 'How would you like to login?',
    }))
    expect(password).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Please enter your token:',
    }))
    expect(loginWithToken).toHaveBeenCalledWith('test-token', 'eu')
    expect(addNetrcEntry).toHaveBeenCalledWith({
      machineName: 'api.storyblok.com',
      login: mockUser.email,
      password: 'test-token',
      region: 'eu',
    })
    expect(konsola.ok).toHaveBeenCalledWith('Successfully logged in with token')
  })

  it('should handle invalid region error with correct message', async () => {
    await loginCommand.parseAsync(['node', 'test', '--region', 'invalid-region'])

    expect(konsola.error).toHaveBeenCalledWith(expect.any(Error), true)

    // Access the error argument
    const errorArg = konsola.error.mock.calls[0][0]

    // Build the expected error message
    const expectedMessage = `The provided region: invalid-region is not valid. Please use one of the following values: ${Object.values(regions).join(' | ')}`

    expect(errorArg.message).toBe(expectedMessage)
  }) */
})
