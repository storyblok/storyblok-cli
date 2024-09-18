import { apiClient } from './api'
import StoryblokClient from 'storyblok-js-client';

// Mock the StoryblokClient to prevent actual HTTP requests
vi.mock('storyblok-js-client', () => {
  const StoryblokClientMock = vi.fn().mockImplementation((config) => {
    return {
      config,
    };
  });

  return {
    default: StoryblokClientMock,
    __esModule: true, // Important for ESM modules
  };
});

describe('Storyblok API Client', () => {
  beforeEach(() => {
    // Reset the module state before each test to ensure test isolation
    vi.resetModules();
  });

  it('should have a default region of "eu"', () => {
    const { region } = apiClient()
    expect(region).toBe('eu')
  })

  it('should return the same client instance when called multiple times without changes', () => {
    const api1 = apiClient();
    const client1 = api1.client;

    const api2 = apiClient();
    const client2 = api2.client;

    expect(client1).toBe(client2);
  });

  it('should set the region on the client', () => {
    const { setRegion } = apiClient();
    setRegion('us');
    const { region } = apiClient();
    expect(region).toBe('us');
  })

  it('should set the access token on the client', () => {
    const { setAccessToken } = apiClient();
    setAccessToken('test-token');
    const { client } = apiClient();
    expect(client.config.accessToken).toBe('test-token');
  })
})