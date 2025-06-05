import type { RegionCode } from './constants';
import { getStoryblokUrl } from './utils/api-routes';
import { delay, FetchError } from './utils/fetch';

export interface ManagementApiClientOptions {
  token: string;
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

export const mapiClient = (options: ManagementApiClientOptions) => {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Authorization': options.token,
  };

  const state = {
    baseHeaders,
    url: options.url || getStoryblokUrl(options.region),
    maxRetries: options.maxRetries ?? 6,
    baseDelay: options.baseDelay ?? 500,
    freeze: false,
  };

  interface GetResponse {
    data: any;
    attempt: number;
  }

  // Internal: isRateLimitOwner is true for the request that first hits 429 and is responsible for lifting the freeze
  const get = async (
    path: string,
    fetchOptions?: FetchOptions,
    attempt: number = 0,
    isRateLimitOwner: boolean = false,
  ): Promise<GetResponse> => {
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
      return get(path, fetchOptions, attempt);
    }
    try {
      if (options?.verbose) {
        console.log(`${state.url}/${path} - Attempt ${attempt}`);
      }
      const res = await fetch(`${state.url}/${path}`, {
        method: 'GET',
        headers: state.baseHeaders,
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
          data: null,
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
            const result = await get(path, options, attempt + 1, isOwner);
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

  return {
    get,
  };
};

export const createMapiClient = (options: ManagementApiClientOptions) => mapiClient(options);
