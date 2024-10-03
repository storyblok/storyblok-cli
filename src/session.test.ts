// session.test.ts
import { session } from './session'

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
