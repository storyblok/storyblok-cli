import { customFetch } from '../../utils/fetch';
import { getStoryblokUrl } from '../../utils/api-routes';
import type { RegionCode } from '../../constants';
import type { StoriesQueryParams, Story, StoryContent } from './constants';
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

export const fetchStoriesByComponent = async (
  space: string,
  token: string,
  region: RegionCode,
  componentName: string,
) => {
  try {
    const stories = await fetchStories(space, token, region, {
      contain_component: componentName,
    });

    return stories;
  }
  catch (error) {
    handleAPIError('pull_stories', error as Error);
  }
};

export const fetchStory = async (
  space: string,
  token: string,
  region: RegionCode,
  storyId: string,
) => {
  try {
    const url = getStoryblokUrl(region);
    const endpoint = `${url}/spaces/${space}/stories/${storyId}`;

    const response = await customFetch<{
      story: Story;
    }>(endpoint, {
      headers: {
        Authorization: token,
      },
    });
    return response.story;
  }
  catch (error) {
    handleAPIError('pull_story', error as Error);
  }
};

/**
 * Updates a story in Storyblok with new content
 * @param space - The space ID
 * @param token - The authentication token
 * @param region - The region code
 * @param storyId - The ID of the story to update
 * @param content - The new content for the story
 * @returns Promise with the updated story or undefined if error occurs
 */
export const updateStory = async (
  space: string,
  token: string,
  region: RegionCode,
  storyId: number,
  content: StoryContent,
): Promise<Story | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const endpoint = `${url}/spaces/${space}/stories/${storyId}`;

    const response = await customFetch<{
      story: Story;
    }>(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        story: {
          content,
        },
      }),
    });

    return response.story;
  }
  catch (error) {
    handleAPIError('update_story', error as Error);
    return undefined;
  }
};
