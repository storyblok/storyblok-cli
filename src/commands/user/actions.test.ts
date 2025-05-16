import { getUser } from './actions';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createManagementClient } from '../../api';

const handlers = [
  http.get('https://api.storyblok.com/v1/users/me', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({
        user: {
          friendly_name: 'Test User',
          email: 'test@example.com',
        },
      });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('user actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should get user successfully with a valid token', async () => {
      createManagementClient({
        accessToken: 'valid-token',
        region: 'eu',
      });

      const mockResponse = {
        friendly_name: 'Test User',
        email: 'test@example.com',
      };
      const result = await getUser();
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error for invalid token', async () => {
      createManagementClient({
        accessToken: 'invalid-token',
        region: 'eu',
      });

      await expect(getUser()).rejects.toMatchObject({
        name: 'API Error',
        errorId: 'unauthorized',
        cause: 'The user is not authorized to access the API',
        code: 401,
        messageStack: [
          'Failed to get user',
          'The user is not authorized to access the API',
        ],
      });
    });
  });
});
