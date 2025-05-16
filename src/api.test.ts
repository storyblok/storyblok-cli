import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createManagementClient, type StoryblokManagementClientOptions } from './api';
import { FetchError } from './utils/fetch';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Setup MSW server
const server = setupServer();

// Mock response data
const mockResponse = {
  data: { id: 1, name: 'Test' },
  meta: { status: 200 },
};

describe('storyblok Management Client', () => {
  const mockOptions: StoryblokManagementClientOptions = {
    accessToken: 'test-token',
    region: 'eu',
  };

  // Start server before all tests
  beforeAll(() => server.listen());
  // Reset handlers and client instance after each test
  afterEach(() => {
    server.resetHandlers();
  });
  // Close server after all tests
  afterAll(() => server.close());

  describe('initialization', () => {
    beforeEach(() => {
      // Note: This is a workaround to reset the client instance for the tests
      createManagementClient({
        accessToken: 'test-token',
        region: 'eu',
      }).reset();
    });

    it('should create a new client instance with valid options', () => {
      const client = createManagementClient(mockOptions);
      expect(client.getClientName()).toBe('management-client');
      expect(client.endpoint).toBeDefined();
    });

    it('should throw error when trying to get instance without initialization', () => {
      expect(() => createManagementClient()).toThrow('MAPI Client requires an access token for initialization');
    });

    it('should maintain singleton instance', () => {
      const client1 = createManagementClient(mockOptions);
      const client2 = createManagementClient();
      expect(client1).toBe(client2);
    });
  });

  describe('gET requests', () => {
    it('should make successful GET request', async () => {
      server.use(
        http.get('*/test', () => {
          return HttpResponse.json(mockResponse);
        }),
      );

      const client = createManagementClient(mockOptions);
      const result = await client.get('/test');

      expect(result).toEqual(mockResponse);
    });

    it('should handle non-JSON responses', async () => {
      server.use(
        http.get('*/test', () => {
          return new HttpResponse('Not JSON', {
            headers: {
              'Content-Type': 'text/plain',
            },
          });
        }),
      );

      const client = createManagementClient(mockOptions);
      await expect(client.get('/test')).rejects.toThrow(FetchError);
    });

    it('should handle HTTP errors', async () => {
      server.use(
        http.get('*/test', () => {
          return new HttpResponse(null, {
            status: 404,
            statusText: 'Not Found',
          });
        }),
      );

      const client = createManagementClient(mockOptions);
      await expect(client.get('/test')).rejects.toThrow(FetchError);
    });

    it('should handle network errors', async () => {
      server.use(
        http.get('*/test', () => {
          return HttpResponse.error();
        }),
      );

      const client = createManagementClient(mockOptions);
      await expect(client.get('/test')).rejects.toThrow(FetchError);
    });
  });

  describe('pOST requests', () => {
    it('should make successful POST request', async () => {
      server.use(
        http.post('*/test', async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            ...mockResponse,
            requestBody: body,
          });
        }),
      );

      const client = createManagementClient(mockOptions);
      const body = { name: 'Test' };
      const result = await client.post('/test', body);

      expect(result).toEqual({
        ...mockResponse,
        requestBody: body,
      });
    });

    it('should handle HTTP errors in POST requests', async () => {
      server.use(
        http.post('*/test', () => {
          return new HttpResponse(null, {
            status: 400,
            statusText: 'Bad Request',
          });
        }),
      );

      const client = createManagementClient(mockOptions);
      await expect(client.post('/test', {})).rejects.toThrow('API request failed');
    });
  });
});
