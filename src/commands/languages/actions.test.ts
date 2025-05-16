import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { vol } from 'memfs';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchLanguages, saveLanguagesToFile } from './actions';
import { FetchError } from 'src/utils/fetch';
import { APIError } from 'src/utils';
import { createManagementClient } from '../../api';

const handlers = [
  http.get('https://api.storyblok.com/v1/spaces/12345', async ({ request }) => {
    const token = request.headers.get('Authorization');
    console.log('msw token', token);
    if (token === 'valid-token') {
      return HttpResponse.json({
        space: {
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
        },
      });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
];

// Mock the managementClient module
vi.mock('src/api', () => ({
  managementClient: vi.fn(),
  createManagementClient: vi.fn(),
}));

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('node:fs');
vi.mock('node:fs/promises');

describe.only('pull languages actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vol.reset();
  });

  describe('fetchLanguages', () => {
    it('should pull languages successfully', async () => {
      createManagementClient({
        accessToken: 'valid-token',
        region: 'eu',
      });

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
      };
      const result = await fetchLanguages('12345');
      expect(result).toEqual(mockResponse);
    });
  });
  it('should throw an masked error for invalid token', async () => {
    createManagementClient({
      accessToken: 'invalid-token',
      region: 'eu',
    });

    await expect(fetchLanguages('12345')).rejects.toMatchObject({
      name: 'API Error',
      errorId: 'unauthorized',
      cause: 'The user is not authorized to access the API',
      code: 401,
      messageStack: [
        'Failed to pull languages',
        'The user is not authorized to access the API',
      ],
    });
  });

  describe('saveLanguagesToFile', () => {
    it('should save a consolidated languages file', async () => {
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
      };
      await saveLanguagesToFile('12345', mockResponse, {
        filename: 'languages',
        path: '/temp',
        verbose: false,
        space: '12345',
      });
      const content = vol.readFileSync('/temp/languages/12345/languages.json', 'utf8');
      expect(content).toBe(JSON.stringify(mockResponse, null, 2));
    });
  });
});
