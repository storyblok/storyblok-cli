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

  const get = async (path: string, options?: FetchOptions, attempt: number = 0) => {
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
          const waitTime = state.baseDelay * 2 ** attempt;
          await delay(waitTime);
          return get(path, options, attempt + 1);
        }
      }
      throw error;
    }
  };

  return {
    get,
  };
};

export const createMapiClient = (options: ManagementApiClientOptions) => mapiClient(options);
