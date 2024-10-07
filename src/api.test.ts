import { apiClient } from './api'

// Mock the StoryblokClient to prevent actual HTTP requests
vi.mock('storyblok-js-client', () => {
  const StoryblokClientMock = vi.fn().mockImplementation((config) => {
    return {
      config,
    }
  })

  return {
    default: StoryblokClientMock,
    __esModule: true, // Important for ESM modules
  }
})

// Mocking the session module
vi.mock('./session', () => {
  let _cache
  const session = () => {
    if (!_cache) {
      _cache = {
        state: {
          isLoggedIn: true,
          password: 'test-token',
          region: 'eu',
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

describe('storyblok API Client', () => {
  beforeEach(async () => {
    // Reset the module state before each test to ensure test isolation
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should have a default region of "eu"', () => {
    const { region } = apiClient()
    expect(region).toBe('eu')
  })

  it('should return the same client instance when called multiple times without changes', () => {
    const api1 = apiClient()
    const client1 = api1.client

    const api2 = apiClient()
    const client2 = api2.client

    expect(client1).toBe(client2)
  })

  it('should set the region on the client', () => {
    const { setRegion } = apiClient()
    setRegion('us')
    const { region } = apiClient()
    expect(region).toBe('us')
  })

  it('should set the access token on the client', () => {
    const { setAccessToken } = apiClient()
    setAccessToken('test-token')
    const { client } = apiClient()
    expect(client.config.accessToken).toBe('test-token')
  })
})
