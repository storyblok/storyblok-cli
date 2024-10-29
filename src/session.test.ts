// session.test.ts
import { session } from './session'

import { getCredentialsForMachine } from './creds'
import type { Mock } from 'vitest'

vi.mock('./creds', () => ({
  getNetrcCredentials: vi.fn(),
  getCredentialsForMachine: vi.fn(),
}))

const mockedGetCredentialsForMachine = getCredentialsForMachine as Mock

describe('session', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
  })
  describe('session initialization with netrc', () => {
    it('should initialize session with netrc credentials', async () => {
      mockedGetCredentialsForMachine.mockReturnValue({
        login: 'test_login',
        password: 'test_token',
        region: 'test_region',
      })
      const userSession = session()
      await userSession.initializeSession()
      expect(userSession.state.isLoggedIn).toBe(true)
      expect(userSession.state.login).toBe('test_login')
      expect(userSession.state.password).toBe('test_token')
      expect(userSession.state.region).toBe('test_region')
    })
    it('should initialize session with netrc credentials for a specific machine', async () => {
      mockedGetCredentialsForMachine.mockReturnValue({
        login: 'test_login',
        password: 'test_token',
        region: 'test_region',
      })
      const userSession = session()
      await userSession.initializeSession('test-machine')
      expect(userSession.state.isLoggedIn).toBe(true)
      expect(userSession.state.login).toBe('test_login')
      expect(userSession.state.password).toBe('test_token')
      expect(userSession.state.region).toBe('test_region')
    })

    it('should initialize session with netrc credentials for a specific machine when no matching machine is present', async () => {
      mockedGetCredentialsForMachine.mockReturnValue(undefined)
      const userSession = session()
      await userSession.initializeSession('nonexistent-machine')
      expect(userSession.state.isLoggedIn).toBe(false)
      expect(userSession.state.login).toBe(undefined)
      expect(userSession.state.password).toBe(undefined)
      expect(userSession.state.region).toBe(undefined)
    })
    /*
    it('should initialize session with netrc credentials for a specific machine', async () => {
      const userSession = session()
      await userSession.initializeSession('test-machine')
      expect(userSession.state.isLoggedIn).toBe(true)
      expect(userSession.state.login).toBe('test_login')
      expect(userSession.state.password).toBe('test_token')
      expect(userSession.state.region).toBe('test_region')
    })

    it('should initialize session with netrc credentials for a specific machine when multiple machines are present', async () => {
      const userSession = session()
      await userSession.initializeSession('test-machine-2')
      expect(userSession.state.isLoggedIn).toBe(true)
      expect(userSession.state.login).toBe('test_login_2')
      expect(userSession.state.password).toBe('test_token_2')
      expect(userSession.state.region).toBe('test_region_2')
    })

    it('should initialize session with netrc credentials for a specific machine when no matching machine is present', async () => {
      const userSession = session()
      await userSession.initializeSession('nonexistent-machine')
      expect(userSession.state.isLoggedIn).toBe(false)
      expect(userSession.state.login).toBe(undefined)
      expect(userSession.state.password).toBe(undefined)
      expect(userSession.state.region).toBe(undefined)
    }) */
  })
  describe('session initialization with environment variables', () => {
    beforeEach(() => {
    // Clear environment variables before each test
      delete process.env.STORYBLOK_LOGIN
      delete process.env.STORYBLOK_TOKEN
      delete process.env.STORYBLOK_REGION
      delete process.env.TRAVIS_STORYBLOK_LOGIN
      delete process.env.TRAVIS_STORYBLOK_TOKEN
      delete process.env.TRAVIS_STORYBLOK_REGION
    })

    it('should initialize session from STORYBLOK_ environment variables', async () => {
      process.env.STORYBLOK_LOGIN = 'test_login'
      process.env.STORYBLOK_TOKEN = 'test_token'
      process.env.STORYBLOK_REGION = 'test_region'

      const userSession = session()
      await userSession.initializeSession()
      expect(userSession.state.isLoggedIn).toBe(true)
      expect(userSession.state.login).toBe('test_login')
      expect(userSession.state.password).toBe('test_token')
      expect(userSession.state.region).toBe('test_region')
    })

    it('should initialize session from TRAVIS_STORYBLOK_ environment variables', async () => {
      process.env.TRAVIS_STORYBLOK_LOGIN = 'test_login'
      process.env.TRAVIS_STORYBLOK_TOKEN = 'test_token'
      process.env.TRAVIS_STORYBLOK_REGION = 'test_region'

      const userSession = session()
      await userSession.initializeSession()
      expect(userSession.state.isLoggedIn).toBe(true)
      expect(userSession.state.login).toBe('test_login')
      expect(userSession.state.password).toBe('test_token')
      expect(userSession.state.region).toBe('test_region')
    })
  })
})
