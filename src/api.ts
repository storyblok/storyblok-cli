import type { RegionCode } from './constants';
import { getStoryblokUrl } from './utils/api-routes';
import { FetchError } from './utils/fetch';

/**
 * Configuration options for the mapi Client
 */
export interface StoryblokManagementClientOptions {
  /**
   * Oauth access token for authentication
   */
  accessToken: string;
  /**
   * Region code for the mapi Client
   */
  region: RegionCode;
}

/**
 * Internal state type for the mapi Client
 */
interface StoryblokManagementClientState {
  accessToken: string;
  headers: Headers;
  endpoint?: string;
}

/**
 * Type definition for the mapi Client instance
 */
export interface StoryblokManagementClient {
  endpoint?: string;
  getClientName: () => string;
  /**
   * Fetches data from the API
   * @param url - The URL path to fetch from
   * @returns Promise with the JSON response wrapped in StoryblokBaseResponse
   */
  get: <T = unknown>(url: string) => Promise<T>;
  post: <T = unknown>(url: string, body: any) => Promise<T>;
  reset: () => void;
}

/**
 * Creates a singleton instance of the mapi Client
 * Using a closure to maintain private state
 */
export const createManagementClient = (() => {
  let instance: StoryblokManagementClient | null = null;

  const state: StoryblokManagementClientState = {
    accessToken: '',
    headers: new Headers(),
  };

  async function get<T = unknown>(url: string): Promise<T> {
    if (!state.endpoint) {
      throw new Error('mapi Client endpoint is not initialized');
    }

    try {
      // Add token as query parameter
      const separator = url.includes('?') ? '&' : '?';
      const urlWithToken = `${state.endpoint}${url}${separator}`;

      const response = await fetch(urlWithToken, {
        headers: state.headers,
      });

      let data;
      try {
        data = await response.json();
      }
      catch {
        throw new FetchError('Non-JSON response', {
          status: response.status,
          statusText: response.statusText,
          data: null,
        });
      }

      if (!response.ok) {
        throw new FetchError(`HTTP error! status: ${response.status}`, {
          status: response.status,
          statusText: response.statusText,
          data,
        });
      }

      return data as T;
    }
    catch (error) {
      if (error instanceof FetchError) {
        throw error;
      }
      // For network errors or other non-HTTP errors
      throw new FetchError(error instanceof Error ? error.message : String(error), {
        status: 0,
        statusText: 'Network Error',
        data: null,
      });
    }
  }

  async function post<T = unknown>(url: string, body: any): Promise<T> {
    if (!state.endpoint) {
      throw new Error('mapi Client endpoint is not initialized');
    }
    const requestUrl = `${state.endpoint}/${url}`;
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: state.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  function reset() {
    instance = null;
  }

  const initialize = (clientOptions: StoryblokManagementClientOptions): StoryblokManagementClient => {
    state.accessToken = clientOptions.accessToken;
    state.endpoint = getStoryblokUrl(clientOptions.region);
    state.headers.set('Content-Type', 'application/json');
    state.headers.set('Accept', 'application/json');
    state.headers.set('Authorization', `${clientOptions.accessToken}`);

    return {
      endpoint: state.endpoint,
      getClientName: () => 'management-client',
      get,
      post,
      reset,
    };
  };

  return (clientOptions?: StoryblokManagementClientOptions): StoryblokManagementClient => {
    if (clientOptions) {
      instance = initialize(clientOptions);
    }
    else if (!instance) {
      throw new Error('MAPI Client requires an access token for initialization');
    }
    return instance;
  };
})();

// Export a default function to get the singleton instance
export const managementClient = createManagementClient;
