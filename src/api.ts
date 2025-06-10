import type { RegionCode } from './constants';
import { getStoryblokUrl } from './utils/api-routes';
import { delay, FetchError } from './utils/fetch';

export interface ManagementApiClientOptions {
  token?: string;
  url?: string;
  region?: RegionCode;
  maxRetries?: number;
  baseDelay?: number;
  verbose?: boolean;
}

export interface FetchOptions {
  headers?: Record<string, string>;
  method?: string;
  body?: any;
  maxRetries?: number;
  baseDelay?: number;
}

export interface GetResponse<T> {
  data: T;
  attempt: number;
}

export interface MapiClient {
  uuid: string;
  get: <T>(path: string, fetchOptions?: FetchOptions) => Promise<GetResponse<T>>;
  post: <T>(path: string, fetchOptions?: FetchOptions) => Promise<GetResponse<T>>;
  put: <T>(path: string, fetchOptions?: FetchOptions) => Promise<GetResponse<T>>;
  dispose: () => void;
}

let instance: MapiClient | null = null;

const createMapiClient = (options: ManagementApiClientOptions): MapiClient => {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Authorization': options.token,
  };

  const state = {
    uuid: `mapi-client-${Math.random().toString(36).substring(2, 15)}`,
    baseHeaders,
    url: options.url || getStoryblokUrl(options.region),
    maxRetries: options.maxRetries ?? 6,
    baseDelay: options.baseDelay ?? 500,
    freeze: false,
  };

  // Internal: isRateLimitOwner is true for the request that first hits 429 and is responsible for lifting the freeze
  const request = async <T>(
    path: string,
    fetchOptions?: FetchOptions,
    attempt: number = 0,
    isRateLimitOwner: boolean = false,
  ): Promise<GetResponse<T>> => {
    // Only non-owner calls should wait for freeze
    if (state.freeze && !isRateLimitOwner) {
      if (options?.verbose) {
        console.log(`⏳ ${path} - Waiting for rate limit to be resolved`);
      }
      await new Promise<void>((resolve) => {
        const checkFreeze = setInterval(() => {
          if (!state.freeze) {
            clearInterval(checkFreeze);
            resolve();
          }
        }, 50);
      });
      // Add a random delay (e.g., 100-500ms) to spread out retries
      await delay(100 + Math.random() * 400);
      return request<T>(path, fetchOptions, attempt);
    }
    try {
      if (options?.verbose) {
        console.log(`${state.url}/${path} - Attempt ${attempt}`);
      }
      const res = await fetch(`${state.url}/${path}`, {
        headers: {
          ...state.baseHeaders,
          ...fetchOptions?.headers,
        } as HeadersInit,
        ...fetchOptions,
      });

      if (res.ok) {
        if (options?.verbose) {
          console.log(`✅ ${path}`);
        }
        return {
          data: await res.json(),
          attempt,
        };
      }
      else {
        throw new FetchError('Request failed', {
          status: res.status,
          statusText: res.statusText,
          data: await res.json(),
        });
      }
    }
    catch (error) {
      if (error instanceof FetchError) {
        if (error.response.status === 429 && attempt < state.maxRetries) {
          if (options?.verbose) {
            console.log(`❌ ${path} - Rate limit exceeded`);
          }
          let isOwner = isRateLimitOwner;
          // Set freeze to true if this is the first 429
          if (!state.freeze) {
            state.freeze = true;
            isOwner = true;
          }
          const waitTime = state.baseDelay * 2 ** attempt + Math.random() * 100;
          await delay(waitTime);
          try {
            // Pass isOwner down the retry chain
            const result = await request<T>(path, fetchOptions, attempt + 1, isOwner);
            return result;
          }
          finally {
            // Only the owner can lift the freeze
            if (isOwner && state.freeze) {
              state.freeze = false;
            }
          }
        }
      }
      // Always lift freeze if all retries are exhausted
      if (state.freeze && isRateLimitOwner) {
        state.freeze = false;
      }
      throw error;
    }
  };

  const get = async (path: string, fetchOptions?: FetchOptions) => {
    return request(path, fetchOptions);
  };

  const post = async (path: string, fetchOptions?: FetchOptions) => {
    return request(path, { ...fetchOptions, method: 'POST' });
  };

  const put = async (path: string, fetchOptions?: FetchOptions) => {
    return request(path, { ...fetchOptions, method: 'PUT' });
  };

  instance = {
    uuid: state.uuid,
    get,
    post,
    put,
    dispose: () => {
      instance = null;
    },
  } as MapiClient;

  return instance;
};

export function mapiClient(options?: ManagementApiClientOptions) {
  if (!instance) {
    instance = createMapiClient(options ?? {});
  }
  return instance;
};
