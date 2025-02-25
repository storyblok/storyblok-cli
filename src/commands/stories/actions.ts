import { customFetch } from '../../utils/fetch';
import { getStoryblokUrl } from '../../utils/api-routes';
import type { RegionCode } from '../../constants';
import type { StoriesQueryParams, Story } from './constants';
import { handleAPIError } from '../../utils/error';
import { objectToStringParams } from '../../utils';

/**
 * Fetches stories from Storyblok Management API with optional query parameters
 * @param space - The space ID
 * @param token - The authentication token
 * @param region - The region code
 * @param params - Optional query parameters for filtering stories
 * @returns Promise with an array of stories or undefined if error occurs
 */
export const fetchStories = async (
  space: string,
  token: string,
  region: RegionCode,
  params?: StoriesQueryParams,
) => {
  try {
    const url = getStoryblokUrl(region);
    const queryString = params ? new URLSearchParams(objectToStringParams(params)).toString() : '';
    const endpoint = `${url}/spaces/${space}/stories${queryString ? `?${queryString}` : ''}`;

    const response = await customFetch<{
      stories: Story[];
    }>(endpoint, {
      headers: {
        Authorization: token,
      },
    });
    return response.stories;
  }
  catch (error) {
    handleAPIError('pull_stories', error as Error);
  }
};
