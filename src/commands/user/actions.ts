import { handleAPIError } from '../../utils';
import type { StoryblokUser } from '../../types';
import { managementClient } from '../../api';

export const getUser = async (): Promise<StoryblokUser | undefined> => {
  try {
    const { get } = managementClient();
    const response = await get<{
      user: StoryblokUser;
    }>('/users/me');

    return response.user;
  }
  catch (error) {
    handleAPIError('get_user', error);
  }
};
